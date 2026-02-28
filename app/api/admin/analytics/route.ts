import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Vendor from "@/models/Vendor";
import Listing from "@/models/Listing";
import Review from "@/models/Review";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();

    const [totalUsers, totalVendors, totalListings, pendingListings, totalReviews] =
      await Promise.all([
        User.countDocuments(),
        Vendor.countDocuments(),
        Listing.countDocuments(),
        Listing.countDocuments({ approved: false }),
        Review.countDocuments(),
      ]);

    return NextResponse.json({
      totalUsers,
      totalVendors,
      totalListings,
      pendingListings,
      totalReviews,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
