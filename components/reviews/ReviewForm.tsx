"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  listingId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ listingId, onSuccess }: ReviewFormProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  const rating = watch("rating");
  const displayRating = hoverRating ?? rating;

  const handleStarClick = (value: number) => {
    setValue("rating", value, { shouldValidate: true });
  };

  const onSubmit = async (data: ReviewFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          rating: data.rating,
          comment: data.comment,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to submit review");
      }
      reset({ rating: 0, comment: "" });
      onSuccess?.();
    } catch (err) {
      console.error(err);
      // Could add toast/error state here
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block font-heading font-medium text-foreground text-sm mb-2">
          Your rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleStarClick(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(null)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  value <= displayRating
                    ? "fill-amber-400 text-amber-400"
                    : "text-amber-400/30"
                }`}
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="mt-1 text-sm text-secondary">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="comment"
          className="block font-heading font-medium text-foreground text-sm mb-2"
        >
          Your review
        </label>
        <textarea
          id="comment"
          {...register("comment")}
          rows={4}
          placeholder="Share your experience..."
          className="w-full px-4 py-3 rounded-xl border-2 border-white/60 bg-surface text-foreground placeholder:text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body resize-none"
        />
        {errors.comment && (
          <p className="mt-1 text-sm text-secondary">
            {errors.comment.message}
          </p>
        )}
      </div>

      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 px-4 rounded-xl bg-primary text-white font-heading font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? "Submitting..." : "Submit review"}
      </motion.button>
    </form>
  );
}
