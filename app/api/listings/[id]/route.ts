import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Listing from "@/models/Listing";
import Interaction from "@/models/Interaction";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
    }

    await dbConnect();

    const listing = await Listing.findById(id).populate("vendorId", "name email");
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    if (session?.user) {
      const userId = (session.user as { id?: string }).id;
      await Interaction.create({
        userId,
        listingId: id,
        type: "view",
      });
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Listing GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
    }

    await dbConnect();

    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const userId = (session.user as { id?: string }).id;
    if (listing.vendorId.toString() !== userId) {
      return NextResponse.json(
        { error: "Only the listing owner can update it" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const allowedFields = [
      "title",
      "description",
      "price",
      "priceUnit",
      "images",
      "location",
      "amenities",
      "availability",
      "contactPhone",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (listing as Record<string, unknown>)[field] = body[field];
      }
    }

    await listing.save();

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Listing PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
    }

    await dbConnect();

    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const userId = (session.user as { id?: string }).id;
    const role = (session.user as { role?: string }).role;

    const isOwner = listing.vendorId.toString() === userId;
    const isAdmin = role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Only the listing owner or admin can delete it" },
        { status: 403 }
      );
    }

    await Listing.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Listing DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
