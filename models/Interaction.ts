import mongoose, { Schema, Document } from "mongoose";

export interface IInteractionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  listingId: mongoose.Types.ObjectId;
  type: "view" | "save" | "contact" | "review";
  timestamp: Date;
}

const InteractionSchema = new Schema<IInteractionDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  listingId: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
  type: {
    type: String,
    enum: ["view", "save", "contact", "review"],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

InteractionSchema.index({ userId: 1 });
InteractionSchema.index({ listingId: 1 });

export default mongoose.models.Interaction ||
  mongoose.model<IInteractionDocument>("Interaction", InteractionSchema);
