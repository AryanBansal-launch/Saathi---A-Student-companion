"use client";

import { useState, useEffect, useCallback } from "react";
import { IListing, FilterOptions } from "@/types";
import { useStore } from "@/store/useStore";

export function useListings(initialFilters?: FilterOptions) {
  const {
    listings,
    setListings,
    filteredListings,
    setFilteredListings,
    isLoading,
    setIsLoading,
  } = useStore();
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(
    async (filters?: FilterOptions) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        const f = filters || initialFilters;
        if (f?.category) params.set("category", f.category);
        if (f?.minPrice) params.set("minPrice", f.minPrice.toString());
        if (f?.maxPrice) params.set("maxPrice", f.maxPrice.toString());
        if (f?.city) params.set("city", f.city);
        if (f?.rating) params.set("rating", f.rating.toString());
        if (f?.sortBy) params.set("sortBy", f.sortBy);
        if (f?.search) params.set("search", f.search);

        const res = await fetch(`/api/listings?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch listings");

        const data = await res.json();
        setListings(data.listings);
        setFilteredListings(data.listings);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [initialFilters, setIsLoading, setListings, setFilteredListings]
  );

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return { listings, filteredListings, isLoading, error, refetch: fetchListings };
}
