"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutGrid, Map } from "lucide-react";
import FilterBar from "@/components/listings/FilterBar";
import ListingGrid from "@/components/listings/ListingGrid";
import MapView from "@/components/map/MapView";
import { useStore } from "@/store/useStore";
import type { IListing, FilterOptions } from "@/types";

const ITEMS_PER_PAGE = 12;

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const cityFromUrl = searchParams.get("city");

  const {
    filters,
    setFilters,
    listings,
    setListings,
    setFilteredListings,
    isMapView,
    toggleMapView,
    isLoading,
    setIsLoading,
  } = useStore();

  const [listingsData, setListingsData] = useState<{
    listings: IListing[];
    total: number;
    page: number;
    totalPages: number;
  }>({ listings: [], total: 0, page: 1, totalPages: 0 });

  const fetchListings = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        // Use URL params when present so first load respects ?city= and ?category=
        const category = categoryFromUrl || filters.category;
        const city = cityFromUrl || filters.city;
        if (category) params.set("category", category);
        if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
        if (city) params.set("city", city);
        if (filters.rating) params.set("rating", filters.rating.toString());
        if (filters.sortBy) params.set("sortBy", filters.sortBy ?? "saarthiScore");
        params.set("page", page.toString());
        params.set("limit", ITEMS_PER_PAGE.toString());

        const res = await fetch(`/api/listings?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch listings");

        const data = await res.json();
        setListingsData({
          listings: data.listings ?? [],
          total: data.pagination?.total ?? data.listings?.length ?? 0,
          page: data.pagination?.page ?? page,
          totalPages: data.pagination?.totalPages ?? 1,
        });
        setListings(data.listings ?? []);
        setFilteredListings(data.listings ?? []);
      } catch {
        setListingsData((prev) => ({ ...prev, listings: [] }));
        setListings([]);
        setFilteredListings([]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      categoryFromUrl,
      cityFromUrl,
      filters.category,
      filters.minPrice,
      filters.maxPrice,
      filters.city,
      filters.rating,
      filters.sortBy,
      setListings,
      setFilteredListings,
      setIsLoading,
    ]
  );

  useEffect(() => {
    const updates: Partial<FilterOptions> = {};
    if (categoryFromUrl) updates.category = categoryFromUrl as FilterOptions["category"];
    if (cityFromUrl) updates.city = cityFromUrl;
    if (Object.keys(updates).length > 0) {
      setFilters(updates);
    }
  }, [categoryFromUrl, cityFromUrl, setFilters]);

  useEffect(() => {
    fetchListings(1);
  }, [fetchListings]);

  const handlePageChange = (newPage: number) => {
    fetchListings(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-sm font-medium uppercase tracking-wider text-primary mb-2">
            Browse
          </p>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Explore Services
          </h1>
          <p className="font-body text-muted mt-1">
            Find hostels, mess, bikes, and more in your city
          </p>
        </motion.header>

        <FilterBar />

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-body text-muted text-sm">
            {isLoading
              ? "Loading..."
              : `${listingsData.total} result${listingsData.total !== 1 ? "s" : ""} found`}
          </p>
          <button
            onClick={toggleMapView}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-white/60 shadow-card hover:shadow-card-hover hover:border-primary/25 transition-all font-medium text-sm"
          >
            {isMapView ? (
              <>
                <LayoutGrid className="h-4 w-4" />
                Grid View
              </>
            ) : (
              <>
                <Map className="h-4 w-4" />
                Map View
              </>
            )}
          </button>
        </div>

        <div className="mt-6 min-h-[400px]">
          {isMapView ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl overflow-hidden border border-white/60 shadow-card h-[500px] lg:h-[600px]"
            >
              <MapView listings={listingsData.listings} />
            </motion.div>
          ) : (
            <>
              <ListingGrid
                listings={listingsData.listings}
                isLoading={isLoading}
              />
              {!isLoading &&
                listingsData.totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(listingsData.page - 1)}
                      disabled={listingsData.page <= 1}
                      className="px-4 py-2 rounded-xl bg-surface border border-white/50 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/30 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="flex items-center px-4 py-2 text-muted text-sm">
                      Page {listingsData.page} of {listingsData.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(listingsData.page + 1)}
                      disabled={listingsData.page >= listingsData.totalPages}
                      className="px-4 py-2 rounded-xl bg-surface border border-white/50 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/30 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
