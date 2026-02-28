"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Star, MapPin } from "lucide-react";
import type { IListing, ServiceCategory } from "@/types";

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  hostel: "Hostel",
  mess: "Mess",
  bike: "Bike",
  accommodation: "Accommodation",
  laundry: "Laundry",
  furniture: "Furniture",
  books: "Books",
  other: "Other",
};

const PRICE_UNIT_LABELS: Record<string, string> = {
  month: "/mo",
  day: "/day",
  item: "/item",
};

interface ListingCardProps {
  listing: IListing;
  onSave?: () => void;
  isSaved?: boolean;
}

export default function ListingCard({
  listing,
  onSave,
  isSaved = false,
}: ListingCardProps) {
  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/users/save/${listing._id}`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved);
        onSave?.();
      }
    } catch {
      // Silently fail - user may not be logged in
    } finally {
      setSaving(false);
    }
  };

  const imageUrl = listing.images?.[0];
  const priceUnit = PRICE_UNIT_LABELS[listing.priceUnit] || "";

  return (
    <Link href={`/listing/${listing._id}`}>
      <motion.article
        className="group relative overflow-hidden rounded-2xl bg-surface border border-white/60 shadow-card hover:shadow-card-hover transition-all duration-300"
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-secondary/15 to-accent/25" />
          )}

          {/* Category badge */}
          <span className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-surface/95 backdrop-blur-sm text-xs font-semibold text-foreground shadow-sm border border-white/40">
            {CATEGORY_LABELS[listing.category]}
          </span>

          {/* Save button */}
          <button
            onClick={handleSaveClick}
            className="absolute top-3 right-3 p-2.5 rounded-xl bg-surface/95 backdrop-blur-sm shadow-sm hover:bg-surface transition-all duration-200"
            aria-label={saved ? "Unsave listing" : "Save listing"}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                saved ? "fill-secondary text-secondary" : "text-muted hover:text-secondary"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-heading font-semibold text-foreground line-clamp-2 mb-1.5 text-[1.05rem]">
            {listing.title}
          </h3>

          {listing.location?.city && (
            <div className="flex items-center gap-1.5 text-muted text-sm mb-3">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="font-body truncate">{listing.location.city}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-bold text-primary text-lg">
                ₹{listing.price.toLocaleString()}
              </span>
              <span className="font-body text-sm text-muted">{priceUnit}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-body text-sm font-medium text-foreground">
                  {listing.rating?.toFixed(1) ?? "—"}
                </span>
              </div>
              {listing.reviewCount > 0 && (
                <span className="font-body text-xs text-muted">
                  ({listing.reviewCount})
                </span>
              )}
            </div>
          </div>

          {/* Saarthi Score */}
          <div className="mt-3 flex items-center justify-end gap-1.5">
            <span className="font-body text-xs text-muted">Score</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white font-heading font-bold text-sm shadow-md">
              {Math.round(listing.saarthiScore ?? 0)}
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
