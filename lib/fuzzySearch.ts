import Fuse, { type IFuseOptions } from "fuse.js";
import { IListing } from "@/types";

const fuseOptions: IFuseOptions<IListing> = {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "description", weight: 0.2 },
    { name: "category", weight: 0.2 },
    { name: "location.address", weight: 0.1 },
    { name: "amenities", weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 2,
};

export function createSearchIndex(listings: IListing[]): Fuse<IListing> {
  return new Fuse(listings, fuseOptions);
}

export function searchListings(
  index: Fuse<IListing>,
  query: string
): IListing[] {
  const results = index.search(query);
  return results.map((r) => r.item);
}

export function parseNaturalQuery(query: string): {
  category?: string;
  maxPrice?: number;
  location?: string;
} {
  const parsed: { category?: string; maxPrice?: number; location?: string } = {};

  const categoryMap: Record<string, string> = {
    hostel: "hostel",
    pg: "hostel",
    mess: "mess",
    tiffin: "mess",
    dabba: "mess",
    bike: "bike",
    scooty: "bike",
    scooter: "bike",
    flat: "accommodation",
    room: "accommodation",
    accommodation: "accommodation",
    laundry: "laundry",
    wash: "laundry",
    furniture: "furniture",
    book: "books",
    books: "books",
  };

  const lowerQuery = query.toLowerCase();

  for (const [keyword, cat] of Object.entries(categoryMap)) {
    if (lowerQuery.includes(keyword)) {
      parsed.category = cat;
      break;
    }
  }

  const priceMatch = lowerQuery.match(/(?:under|below|less than|<)\s*(?:₹|rs\.?|inr)?\s*(\d+)/);
  if (priceMatch) {
    parsed.maxPrice = parseInt(priceMatch[1], 10);
  }

  const nearMatch = lowerQuery.match(/(?:near|around|in|at)\s+(.+?)(?:\s+(?:under|below|for|with)|$)/);
  if (nearMatch) {
    parsed.location = nearMatch[1].trim();
  }

  return parsed;
}
