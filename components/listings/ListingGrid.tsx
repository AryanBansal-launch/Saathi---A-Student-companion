"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import type { IListing } from "@/types";
import ListingCard from "./ListingCard";

interface ListingGridProps {
  listings: IListing[];
  isLoading?: boolean;
  savedIds?: string[];
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface border border-white/50 shadow-md animate-pulse">
      <div className="aspect-[4/3] bg-muted/30" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-muted/30 rounded w-3/4" />
        <div className="h-4 bg-muted/30 rounded w-1/2" />
        <div className="flex justify-between">
          <div className="h-6 bg-muted/30 rounded w-20" />
          <div className="h-4 bg-muted/30 rounded w-12" />
        </div>
      </div>
    </div>
  );
}

export default function ListingGrid({
  listings,
  isLoading = false,
  savedIds = [],
}: ListingGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!listings?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-6 text-center"
      >
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
          <Search className="h-12 w-12 text-primary/60" />
        </div>
        <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
          No listings found
        </h3>
        <p className="font-body text-muted max-w-md">
          Try adjusting your filters or search criteria to find what you&apos;re
          looking for.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard
          key={listing._id}
          listing={listing}
          isSaved={savedIds.includes(listing._id)}
        />
      ))}
    </div>
  );
}
