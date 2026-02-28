import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import Listing from "@/models/Listing";
import Interaction from "@/models/Interaction";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { listingId, rating, comment } = body;

    if (!listingId || !rating || !comment) {
      return NextResponse.json(
        { error: "listingId, rating, and comment are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
    }

    await dbConnect();

    const userId = (session.user as { id?: string }).id;

    const existingReview = await Review.findOne({
      userId,
      listingId,
    });
    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this listing" },
        { status: 409 }
      );
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const review = await Review.create({
      listingId,
      userId,
      rating,
      comment,
    });

    const reviews = await Review.find({ listingId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Listing.findByIdAndUpdate(listingId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    });

    await Interaction.create({
      userId,
      listingId,
      type: "review",
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Review POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
