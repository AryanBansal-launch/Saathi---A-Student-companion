import mongoose, { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: "student" | "vendor" | "admin";
  phone?: string;
  city?: string;
  location?: { lat: number; lng: number };
  preferences?: {
    budget?: number;
    categories?: string[];
  };
  savedListings: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    role: {
      type: String,
      enum: ["student", "vendor", "admin"],
      default: "student",
    },
    phone: { type: String },
    city: { type: String },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    preferences: {
      budget: { type: Number },
      categories: [{ type: String }],
    },
    savedListings: [{ type: Schema.Types.ObjectId, ref: "Listing" }],
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUserDocument>("User", UserSchema);
