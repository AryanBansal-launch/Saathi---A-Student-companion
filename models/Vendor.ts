import mongoose, { Schema, Document } from "mongoose";

export interface IVendorDocument extends Document {
  userId: mongoose.Types.ObjectId;
  businessName: string;
  verified: boolean;
  totalListings: number;
  rating: number;
}

const VendorSchema = new Schema<IVendorDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    businessName: { type: String, required: true },
    verified: { type: Boolean, default: false },
    totalListings: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Vendor ||
  mongoose.model<IVendorDocument>("Vendor", VendorSchema);
