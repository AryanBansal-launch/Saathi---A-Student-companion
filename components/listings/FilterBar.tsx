"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown, Star } from "lucide-react";
import { useStore } from "@/store/useStore";
import type { ServiceCategory, FilterOptions } from "@/types";

const CATEGORIES: (ServiceCategory | "all")[] = [
  "all",
  "hostel",
  "mess",
  "bike",
  "accommodation",
  "laundry",
  "furniture",
  "books",
  "other",
];

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  hostel: "Hostel",
  mess: "Mess",
  bike: "Bike",
  accommodation: "Accommodation",
  laundry: "Laundry",
  furniture: "Furniture",
  books: "Books",
  other: "Other",
};

const SORT_OPTIONS = [
  { value: "saarthiScore", label: "Saarthi Score" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
] as const;

export default function FilterBar() {
  const { filters, setFilters, resetFilters } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const hasActiveFilters =
    filters.category ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.rating !== undefined;

  return (
    <div className="font-body">
      {/* Mobile toggle */}
      <div className="flex items-center gap-2 md:hidden mb-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-muted/30 text-foreground font-medium shadow-sm"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="h-2 w-2 rounded-full bg-primary" />
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-secondary hover:bg-secondary/10 text-sm"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden mb-4"
          >
            <FilterContent
              filters={filters}
              setFilters={setFilters}
              resetFilters={resetFilters}
              onClose={() => setMobileOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop filter bar */}
      <div className="hidden md:flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-surface border border-white/50 shadow-sm">
        <FilterContent
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
        />
      </div>
    </div>
  );
}

interface FilterContentProps {
  filters: FilterOptions;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  onClose?: () => void;
}

function FilterContent({
  filters,
  setFilters,
  resetFilters,
  onClose,
}: FilterContentProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <>
      {/* Category dropdown */}
      <div className="relative">
        <button
          onClick={() => {
            setCategoryOpen(!categoryOpen);
            setSortOpen(false);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background border border-muted/20 hover:border-primary/30 transition-colors min-w-[140px] justify-between"
        >
          <span className="text-sm font-medium text-foreground">
            {filters.category
              ? CATEGORY_LABELS[filters.category]
              : "Category"}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted transition-transform ${categoryOpen ? "rotate-180" : ""}`}
          />
        </button>
        <AnimatePresence>
          {categoryOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setCategoryOpen(false)}
                aria-hidden="true"
              />
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute left-0 top-full mt-1 z-50 w-48 rounded-xl bg-surface border border-muted/20 shadow-lg py-1 max-h-60 overflow-y-auto"
              >
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setFilters({
                        category: c === "all" ? undefined : (c as ServiceCategory),
                      });
                      setCategoryOpen(false);
                      onClose?.();
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-primary/5 ${
                      (c === "all" && !filters.category) ||
                      filters.category === c
                        ? "text-primary font-medium bg-primary/5"
                        : "text-foreground"
                    }`}
                  >
                    {CATEGORY_LABELS[c]}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Price range */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min ₹"
          value={filters.minPrice ?? ""}
          onChange={(e) =>
            setFilters({
              minPrice: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="w-24 rounded-xl border border-muted/20 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <span className="text-muted">–</span>
        <input
          type="number"
          placeholder="Max ₹"
          value={filters.maxPrice ?? ""}
          onChange={(e) =>
            setFilters({
              maxPrice: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="w-24 rounded-xl border border-muted/20 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Rating filter */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((r) => {
          const isActive = filters.rating === r;
          return (
            <button
              key={r}
              onClick={() =>
                setFilters({
                  rating: isActive ? undefined : r,
                })
              }
              className={`p-2 rounded-lg transition-colors ${
                isActive ? "bg-amber-100 text-amber-600" : "hover:bg-muted/20 text-muted"
              }`}
              title={`${r}+ stars`}
            >
              <Star
                className={`h-5 w-5 ${isActive ? "fill-amber-400 text-amber-400" : ""}`}
              />
            </button>
          );
        })}
      </div>

      {/* Sort dropdown */}
      <div className="relative">
        <button
          onClick={() => {
            setSortOpen(!sortOpen);
            setCategoryOpen(false);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background border border-muted/20 hover:border-primary/30 transition-colors min-w-[160px] justify-between"
        >
          <span className="text-sm font-medium text-foreground">
            {SORT_OPTIONS.find((o) => o.value === filters.sortBy)?.label ??
              "Sort by"}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted transition-transform ${sortOpen ? "rotate-180" : ""}`}
          />
        </button>
        <AnimatePresence>
          {sortOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setSortOpen(false)}
                aria-hidden="true"
              />
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 top-full mt-1 z-50 w-52 rounded-xl bg-surface border border-muted/20 shadow-lg py-1"
              >
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => {
                      setFilters({ sortBy: o.value });
                      setSortOpen(false);
                      onClose?.();
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-primary/5 ${
                      filters.sortBy === o.value
                        ? "text-primary font-medium bg-primary/5"
                        : "text-foreground"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Clear all */}
      <button
        onClick={() => {
          resetFilters();
          onClose?.();
        }}
        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-secondary hover:bg-secondary/10 text-sm font-medium"
      >
        <X className="h-4 w-4" />
        Clear all
      </button>
    </>
  );
}
