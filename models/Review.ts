import mongoose, { Schema, Document } from "mongoose";

export interface IReviewDocument extends Document {
  listingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    listingId: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

ReviewSchema.index({ listingId: 1 });
ReviewSchema.index({ userId: 1, listingId: 1 }, { unique: true });

export default mongoose.models.Review ||
  mongoose.model<IReviewDocument>("Review", ReviewSchema);
