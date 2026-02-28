"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Loader2 } from "lucide-react";
import ListingGrid from "@/components/listings/ListingGrid";
import type { IListing, IUser } from "@/types";

export default function SavedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [listings, setListings] = useState<IListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status !== "authenticated") return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch("/api/users/me")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setUser(data);
        const savedIds = data.savedListings ?? [];
        if (savedIds.length === 0) {
          setListings([]);
          return;
        }
        return Promise.all(
          savedIds.map((id: string) =>
            fetch(`/api/listings/${id}`).then((r) => (r.ok ? r.json() : null))
          )
        );
      })
      .then((results) => {
        if (!cancelled && results) {
          setListings(results.filter(Boolean));
        }
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
  }, [status, router]);

  if (status === "loading" || (status === "authenticated" && loading && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="font-body text-muted">Loading saved listings...</p>
        </motion.div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
            Something went wrong
          </h1>
          <p className="font-body text-muted mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-primary text-white font-heading font-semibold hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
        </motion.div>
      </div>
    );
  }

  const savedIds = user?.savedListings ?? [];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-8 w-8 text-secondary" />
            Saved Listings
          </h1>
          <p className="font-body text-muted mt-1">
            Your favorite listings in one place
          </p>
        </motion.header>

        {listings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary/10 mb-6">
              <Heart className="h-12 w-12 text-secondary/60" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
              No saved listings yet
            </h3>
            <p className="font-body text-muted max-w-md mb-6">
              Save listings you like by clicking the heart icon. They&apos;ll appear here.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-heading font-semibold hover:bg-primary/90 transition-colors"
            >
              Explore Listings
            </Link>
          </motion.div>
        ) : (
          <ListingGrid listings={listings} savedIds={savedIds} />
        )}
      </div>
    </div>
  );
}
