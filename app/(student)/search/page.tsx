"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import SearchBar from "@/components/search/SearchBar";
import ListingGrid from "@/components/listings/ListingGrid";
import type { IListing } from "@/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [listings, setListings] = useState<IListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    if (!query.trim()) {
      setListings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ search: query.trim() });
      const res = await fetch(`/api/listings?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to search");

      const data = await res.json();
      setListings(data.listings ?? []);
    } catch {
      setError("Something went wrong. Please try again.");
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">
            Search
          </h1>
          <div className="max-w-xl">
            <SearchBar
              placeholder="Search hostels, mess, bikes..."
              defaultQuery={query}
              onSearch={() => fetchResults()}
            />
          </div>
        </motion.header>

        {query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <p className="font-body text-muted text-sm">
              {loading
                ? "Searching..."
                : error
                  ? error
                  : `Results for "${query}"`}
            </p>
          </motion.div>
        )}

        {!query.trim() ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <p className="font-body text-muted text-lg mb-4">
              Enter a search term to find hostels, mess, bikes, and more.
            </p>
            <p className="font-body text-muted text-sm">
              Try: &quot;cheap mess near IIT Delhi&quot;, &quot;hostel under ₹5000&quot;, or &quot;bike rental&quot;
            </p>
          </motion.div>
        ) : !loading && !error && listings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
              No results found
            </h3>
            <p className="font-body text-muted max-w-md mb-6">
              We couldn&apos;t find any listings matching &quot;{query}&quot;. Try different keywords or browse our categories.
            </p>
            <a
              href="/explore"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-heading font-semibold hover:bg-primary/90 transition-colors"
            >
              Browse All Listings
            </a>
          </motion.div>
        ) : (
          <ListingGrid listings={listings} isLoading={loading} />
        )}
      </div>
    </div>
  );
}
