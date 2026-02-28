"use client";

import { Star } from "lucide-react";
import type { IReview } from "@/types";

interface ReviewCardProps {
  review: IReview;
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const fullStars = Math.floor(review.rating);
  const hasHalf = review.rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <article className="rounded-xl border border-white/60 bg-surface p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex gap-0.5">
          {Array.from({ length: fullStars }).map((_, i) => (
            <Star
              key={`full-${i}`}
              className="h-4 w-4 fill-amber-400 text-amber-400"
            />
          ))}
          {hasHalf && (
            <Star className="h-4 w-4 fill-amber-400/50 text-amber-400" />
          )}
          {Array.from({ length: emptyStars }).map((_, i) => (
            <Star
              key={`empty-${i}`}
              className="h-4 w-4 text-amber-400/30"
            />
          ))}
        </div>
        <span className="font-body text-sm font-medium text-foreground">
          {review.rating.toFixed(1)}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="font-heading font-medium text-foreground text-sm">
          {review.user?.name ?? "Anonymous"}
        </span>
        <span className="text-muted text-xs">•</span>
        <time
          dateTime={
            typeof review.createdAt === "string"
              ? review.createdAt
              : review.createdAt.toISOString()
          }
          className="font-body text-xs text-muted"
        >
          {formatDate(review.createdAt)}
        </time>
      </div>

      <p className="font-body text-sm text-foreground/90 leading-relaxed">
        {review.comment}
      </p>
    </article>
  );
}
