import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Listing from "@/models/Listing";
import { calculateHaversineDistance } from "@/lib/recommendations";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");
    const radius = parseFloat(searchParams.get("radius") || "5");

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: "lat and lng query params are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const listings = await Listing.find({
      approved: true,
      availability: true,
    }).populate("vendorId", "name email");

    const withDistance = listings
      .map((listing) => {
        const listingLat = (listing.location as { lat: number }).lat;
        const listingLng = (listing.location as { lng: number }).lng;
        const distance = calculateHaversineDistance(
          lat,
          lng,
          listingLat,
          listingLng
        );
        return { listing: listing.toObject(), distance };
      })
      .filter((item) => item.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    return NextResponse.json({
      listings: withDistance.map((item) => ({
        ...item.listing,
        distance: item.distance,
      })),
    });
  } catch (error) {
    console.error("Nearby listings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
