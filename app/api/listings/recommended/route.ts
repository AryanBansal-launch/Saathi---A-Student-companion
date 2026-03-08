import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Listing from "@/models/Listing";
import { getRecommendations } from "@/lib/recommendations";
import { createCityRegex } from "@/lib/cityNormalizer";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "";

    if (!city.trim()) {
      return NextResponse.json(
        { error: "city query param is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const session = await getServerSession(authOptions);

    if (session?.user) {
      const userId = (session.user as { id?: string }).id;
      if (userId) {
        const scored = await getRecommendations(userId, city);
        const listingIds = scored.map((s) => s.listingId);
        const listings = await Listing.find({
          _id: { $in: listingIds },
          approved: true,
          availability: true,
        })
          .populate("vendorId", "name email")
          .lean();

        const listingMap = new Map(
          listings.map((l) => [l._id.toString(), l])
        );
        const ordered = listingIds
          .map((id) => listingMap.get(id))
          .filter(Boolean);

        return NextResponse.json({ listings: ordered });
      }
    }

    const cityRegex = createCityRegex(city);
    const listings = await Listing.find({
      "location.city": cityRegex ? { $regex: cityRegex } : { $regex: new RegExp(city, "i") },
      approved: true,
      availability: true,
    })
      .sort({ rating: -1 })
      .limit(10)
      .populate("vendorId", "name email")
      .lean();

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Recommended listings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
