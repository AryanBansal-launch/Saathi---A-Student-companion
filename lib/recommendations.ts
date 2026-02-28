import Interaction from "@/models/Interaction";
import Listing from "@/models/Listing";
import User from "@/models/User";
import { SaarthiScore } from "@/types";

function getDaysAgo(date: Date): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

export function calculateHaversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getRecommendations(
  userId: string,
  city: string,
  category?: string
): Promise<SaarthiScore[]> {
  const interactions = await Interaction.find({ userId });
  const user = await User.findById(userId);

  const query: any = {
    "location.city": { $regex: new RegExp(city, "i") },
    approved: true,
    availability: true,
  };
  if (category) query.category = category;

  const listings = await Listing.find(query);

  const userCategories = user?.preferences?.categories || [];

  const scored: SaarthiScore[] = listings.map((listing) => {
    const ratingScore = (listing.rating / 5) * 40;
    const reviewScore = Math.min(listing.reviewCount / 50, 1) * 20;
    const interactionScore =
      interactions.filter(
        (i) => i.listingId.toString() === listing._id.toString()
      ).length * 5;
    const recencyScore = getDaysAgo(listing.createdAt) < 30 ? 10 : 0;
    const categoryPrefScore = userCategories.includes(listing.category) ? 15 : 0;

    return {
      listingId: listing._id.toString(),
      score:
        ratingScore +
        reviewScore +
        interactionScore +
        recencyScore +
        categoryPrefScore,
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 10);
}

export function calculateSaarthiScore(
  rating: number,
  reviewCount: number,
  price: number,
  avgPrice: number,
  distance?: number,
  maxDistance?: number
): number {
  const ratingComponent = (rating / 5) * 40;
  const priceCompetitiveness =
    avgPrice > 0 ? Math.max(0, 1 - price / avgPrice) : 0;
  const priceComponent = priceCompetitiveness * 30;
  const distanceComponent =
    distance !== undefined && maxDistance
      ? Math.max(0, 1 - distance / maxDistance) * 30
      : 15;

  return Math.round(ratingComponent + priceComponent + distanceComponent);
}
