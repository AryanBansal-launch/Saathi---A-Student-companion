import mongoose, { Schema, Document } from "mongoose";

export interface IListingDocument extends Document {
  vendorId: mongoose.Types.ObjectId;
  category:
    | "hostel"
    | "mess"
    | "bike"
    | "accommodation"
    | "laundry"
    | "furniture"
    | "books"
    | "other";
  title: string;
  description: string;
  price: number;
  priceUnit: "month" | "day" | "item";
  images: string[];
  location: {
    address: string;
    city: string;
    lat: number;
    lng: number;
  };
  amenities: string[];
  availability: boolean;
  contactPhone?: string;
  rating: number;
  reviewCount: number;
  saarthiScore: number;
  approved: boolean;
  createdAt: Date;
}

const ListingSchema = new Schema<IListingDocument>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      enum: [
        "hostel",
        "mess",
        "bike",
        "accommodation",
        "laundry",
        "furniture",
        "books",
        "other",
      ],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    priceUnit: {
      type: String,
      enum: ["month", "day", "item"],
      default: "month",
    },
    images: [{ type: String }],
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    amenities: [{ type: String }],
    availability: { type: Boolean, default: true },
    contactPhone: { type: String },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    saarthiScore: { type: Number, default: 0 },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ListingSchema.index({ "location.city": 1, category: 1 });
ListingSchema.index({ "location.lat": 1, "location.lng": 1 });
ListingSchema.index({ approved: 1, availability: 1 });

export default mongoose.models.Listing ||
  mongoose.model<IListingDocument>("Listing", ListingSchema);
