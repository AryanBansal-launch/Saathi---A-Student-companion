"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { IListing } from "@/types";

const PRICE_UNIT_LABELS: Record<string, string> = {
  month: "/mo",
  day: "/day",
  item: "/item",
};

interface RecommendationStripProps {
  city: string;
}

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[220px] rounded-xl overflow-hidden bg-surface/80 border border-white/50 animate-pulse">
      <div className="aspect-[4/3] bg-muted/30" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-muted/30 rounded w-3/4" />
        <div className="h-4 bg-muted/30 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function RecommendationStrip({ city }: RecommendationStripProps) {
  const [listings, setListings] = useState<IListing[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!city.trim()) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/listings/recommended?city=${encodeURIComponent(city)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.listings) {
          setListings(data.listings);
        }
      })
      .catch(() => {
        if (!cancelled) setListings([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [city]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const step = 240;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 font-heading font-semibold text-foreground text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Recommended
        </h2>
        {!loading && listings.length > 0 && (
          <div className="flex gap-1">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="p-2 rounded-lg bg-surface border border-white/60 hover:bg-primary/10 hover:border-primary/30 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="p-2 rounded-lg bg-surface border border-white/60 hover:bg-primary/10 hover:border-primary/30 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 -mx-1 px-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {loading ? (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </>
        ) : listings.length === 0 ? (
          <p className="font-body text-muted text-sm py-8">
            No recommendations for this city yet.
          </p>
        ) : (
          listings.map((listing, i) => (
            <Link key={listing._id} href={`/listing/${listing._id}`}>
              <motion.article
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex-shrink-0 w-[220px] rounded-xl overflow-hidden bg-surface border border-white/50 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all group"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
                  {listing.images?.[0] ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="220px"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30" />
                  )}
                  <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white font-heading font-bold text-xs shadow-md">
                    {Math.round(listing.saarthiScore ?? 0)}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-heading font-semibold text-foreground text-sm line-clamp-2 mb-1">
                    {listing.title}
                  </h3>
                  <p className="font-body font-bold text-primary text-sm">
                    ₹{listing.price.toLocaleString()}
                    {PRICE_UNIT_LABELS[listing.priceUnit] || ""}
                  </p>
                </div>
              </motion.article>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
