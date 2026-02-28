import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Listing from "@/models/Listing";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const rating = searchParams.get("rating");
    const sortBy = searchParams.get("sortBy") || "saarthiScore";
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));

    const session = await getServerSession(authOptions);
    const isAdmin = (session?.user as { role?: string })?.role === "admin";
    const isVendor = (session?.user as { role?: string })?.role === "vendor";
    const userId = (session?.user as { id?: string })?.id;
    const mine = searchParams.get("mine") === "1" || searchParams.get("mine") === "true";

    const query: Record<string, unknown> = {};

    if (mine && userId && (isVendor || isAdmin)) {
      query.vendorId = userId;
    } else if (!isAdmin) {
      query.approved = true;
      query.availability = true;
    }

    if (category) query.category = category;
    if (city) query["location.city"] = { $regex: new RegExp(city, "i") };
    if (minPrice) query.price = { ...(query.price as object || {}), $gte: parseFloat(minPrice) };
    if (maxPrice) query.price = { ...(query.price as object || {}), $lte: parseFloat(maxPrice) };
    if (rating) query.rating = { $gte: parseFloat(rating) };

    if (search) {
      query.$or = [
        { title: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
      ];
    }

    const sortOptions: Record<string, Record<string, 1 | -1>> = {
      saarthiScore: { saarthiScore: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1 },
    };
    const sort = sortOptions[sortBy] || sortOptions.saarthiScore;

    const skip = (page - 1) * limit;

    const [listings, total] = await Promise.all([
      Listing.find(query).sort(sort).skip(skip).limit(limit).populate("vendorId", "name email"),
      Listing.countDocuments(query),
    ]);

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Listings GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    const role = (session.user as { role?: string }).role;

    if (role !== "vendor" && role !== "admin") {
      return NextResponse.json(
        { error: "Only vendors and admins can create listings" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      category,
      title,
      description,
      price,
      priceUnit = "month",
      images = [],
      location,
      amenities = [],
      contactPhone,
    } = body;

    if (!category || !title || !description || price == null || !location) {
      return NextResponse.json(
        { error: "category, title, description, price, and location are required" },
        { status: 400 }
      );
    }

    if (!location.address || !location.city || location.lat == null || location.lng == null) {
      return NextResponse.json(
        { error: "location must include address, city, lat, and lng" },
        { status: 400 }
      );
    }

    await dbConnect();

    const listing = await Listing.create({
      vendorId: userId,
      category,
      title,
      description,
      price,
      priceUnit,
      images,
      location,
      amenities,
      contactPhone,
      approved: false,
      availability: true,
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("Listings POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
