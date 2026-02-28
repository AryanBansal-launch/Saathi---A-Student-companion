/**
 * Ensure all MongoDB collections exist and have indexes as defined in Mongoose models.
 * Run after seed.js if you want indexes without starting the Next app.
 *
 * Run: node scripts/create-collections-and-indexes.js
 */

require("./load-env.js");

const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env.local");
  process.exit(1);
}

async function run() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);

  // Register models (same as app) so indexes are created
  const UserSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      passwordHash: { type: String },
      role: { type: String, enum: ["student", "vendor", "admin"], default: "student" },
      phone: String,
      city: String,
      location: { lat: Number, lng: Number },
      preferences: { budget: Number, categories: [String] },
      savedListings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
    },
    { timestamps: true }
  );

  const ListingSchema = new mongoose.Schema(
    {
      vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      category: { type: String, enum: ["hostel", "mess", "bike", "accommodation", "laundry", "furniture", "books", "other"], required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      priceUnit: { type: String, enum: ["month", "day", "item"], default: "month" },
      images: [String],
      location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
      amenities: [String],
      availability: { type: Boolean, default: true },
      contactPhone: String,
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

  const ReviewSchema = new mongoose.Schema(
    {
      listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
    },
    { timestamps: true }
  );
  ReviewSchema.index({ listingId: 1 });
  ReviewSchema.index({ userId: 1, listingId: 1 }, { unique: true });

  const VendorSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
      businessName: { type: String, required: true },
      verified: { type: Boolean, default: false },
      totalListings: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
    },
    { timestamps: true }
  );

  const InteractionSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
      type: { type: String, enum: ["view", "save", "contact", "review"], required: true },
      timestamp: { type: Date, default: Date.now },
    }
  );
  InteractionSchema.index({ userId: 1 });
  InteractionSchema.index({ listingId: 1 });

  const User = mongoose.model("User", UserSchema);
  const Listing = mongoose.model("Listing", ListingSchema);
  const Review = mongoose.model("Review", ReviewSchema);
  const Vendor = mongoose.model("Vendor", VendorSchema);
  const Interaction = mongoose.model("Interaction", InteractionSchema);

  console.log("Syncing indexes for User, Listing, Review, Vendor, Interaction...");
  await User.init();
  await Listing.init();
  await Review.init();
  await Vendor.init();
  await Interaction.init();
  console.log("Indexes synced.");

  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
