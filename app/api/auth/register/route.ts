import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Vendor from "@/models/Vendor";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role = "student" } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
    });

    if (role === "vendor") {
      await Vendor.create({
        userId: user._id,
        businessName: name,
      });
    }

    const userObj = user.toObject();
    delete (userObj as Record<string, unknown>).passwordHash;

    return NextResponse.json(userObj, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
