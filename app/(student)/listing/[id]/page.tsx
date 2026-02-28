"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import ListingDetail from "@/components/listings/ListingDetail";
import MapView from "@/components/map/MapView";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewForm from "@/components/reviews/ReviewForm";
import RecommendationStrip from "@/components/ai/RecommendationStrip";
import { useSession } from "next-auth/react";
import type { IListing, IReview } from "@/types";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const id = params?.id as string;

  const [listing, setListing] = useState<IListing | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/listings/${id}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error("Listing not found");
          throw new Error("Failed to fetch listing");
        }
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setListing(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/reviews/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.reviews ?? [];
        setReviews(
          list.map((r: IReview & { userId?: { name?: string } }) => ({
            ...r,
            user: r.user ?? (r.userId && typeof r.userId === "object" ? { name: (r.userId as { name?: string }).name } : undefined),
          }))
        );
      })
      .catch(() => setReviews([]));
  }, [id]);

  const refetchReviews = () => {
    if (!id) return;
    fetch(`/api/reviews/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.reviews ?? [];
        setReviews(
          list.map((r: IReview & { userId?: { name?: string } }) => ({
            ...r,
            user: r.user ?? (r.userId && typeof r.userId === "object" ? { name: (r.userId as { name?: string }).name } : undefined),
          }))
        );
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="font-body text-muted">Loading listing...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
            {error ?? "Listing not found"}
          </h1>
          <p className="font-body text-muted mb-6">
            The listing you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-heading font-semibold hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Link>
        </motion.div>
      </div>
    );
  }

  const mapListings = listing.location?.lat != null && listing.location?.lng != null
    ? [listing]
    : [];
  const mapCenter: [number, number] =
    listing.location?.lat != null && listing.location?.lng != null
      ? [listing.location.lat, listing.location.lng]
      : [28.6139, 77.209];
  const city = listing.location?.city ?? "Delhi";

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted hover:text-foreground font-body text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ListingDetail listing={listing} />
        </motion.div>

        {mapListings.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="font-heading font-semibold text-foreground mb-4">
              Location
            </h2>
            <div className="rounded-2xl overflow-hidden border border-white/50 shadow-md h-[300px]">
              <MapView
                listings={mapListings}
                center={mapCenter}
                zoom={15}
              />
            </div>
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="font-heading font-semibold text-foreground mb-6">
            Reviews ({reviews.length})
          </h2>

          {status === "authenticated" && (
            <div className="mb-8 p-6 rounded-2xl bg-surface border border-white/50 shadow-sm">
              <h3 className="font-heading font-medium text-foreground mb-4">
                Write a review
              </h3>
              <ReviewForm listingId={id} onSuccess={refetchReviews} />
            </div>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="font-body text-muted py-8">
                No reviews yet. Be the first to share your experience!
              </p>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <RecommendationStrip city={city} />
        </motion.section>
      </div>
    </div>
  );
}
