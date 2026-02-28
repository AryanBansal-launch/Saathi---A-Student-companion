import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Interaction from "@/models/Interaction";
import mongoose from "mongoose";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId } = await params;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
    }

    await dbConnect();

    const userId = (session.user as { id?: string }).id;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const listingObjectId = new mongoose.Types.ObjectId(listingId);
    const savedListings = user.savedListings || [];
    const index = savedListings.findIndex(
      (id: mongoose.Types.ObjectId) => id.toString() === listingId
    );

    let saved: boolean;
    if (index >= 0) {
      savedListings.splice(index, 1);
      saved = false;
    } else {
      savedListings.push(listingObjectId);
      saved = true;
    }

    user.savedListings = savedListings;
    await user.save();

    if (saved) {
      await Interaction.create({
        userId,
        listingId,
        type: "save",
      });
    }

    return NextResponse.json({
      saved,
      savedListings: savedListings.map((id: mongoose.Types.ObjectId) => id.toString()),
    });
  } catch (error) {
    console.error("Save listing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
