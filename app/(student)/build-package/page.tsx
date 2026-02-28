"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  MapPin,
  IndianRupee,
  UtensilsCrossed,
  Loader2,
  Building2,
  Shirt,
  Bike,
  Home,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type {
  BuildPackageResponse,
  CuratedPackage,
  FoodPreference,
  ServiceCategory,
} from "@/types";

const CITIES = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Pune",
  "Hyderabad",
  "Chennai",
];

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  hostel: "Hostel",
  mess: "Mess",
  bike: "Bike",
  accommodation: "Accommodation",
  laundry: "Laundry",
  furniture: "Furniture",
  books: "Books",
  other: "Other",
};

const DEFAULT_CATEGORIES: ServiceCategory[] = [
  "hostel",
  "mess",
  "laundry",
  "bike",
];

function PackageCard({
  pkg,
  index,
}: {
  pkg: CuratedPackage;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-2xl bg-surface border border-white/60 shadow-card hover:shadow-card-hover p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading font-semibold text-lg text-foreground">
            {pkg.name}
          </h3>
          <p className="font-body text-sm text-muted mt-0.5">{pkg.description}</p>
        </div>
        <div className="text-right">
          <span className="font-heading font-bold text-xl text-primary">
            ₹{pkg.totalMonthlyPrice.toLocaleString()}
          </span>
          <span className="font-body text-sm text-muted block">/ month</span>
        </div>
      </div>

      <ul className="space-y-3">
        {pkg.items.map(({ category, listing }) => {
          const Icon =
            category === "hostel" || category === "accommodation"
              ? Building2
              : category === "mess"
              ? UtensilsCrossed
              : category === "laundry"
              ? Shirt
              : category === "bike"
              ? Bike
              : Home;
          return (
            <li key={listing._id}>
              <Link
                href={`/listing/${listing._id}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-background/60 hover:bg-primary/5 border border-white/40 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-foreground truncate">
                    {listing.title}
                  </p>
                  <p className="font-body text-xs text-muted">
                    {CATEGORY_LABELS[category]} · ₹
                    {listing.price.toLocaleString()}
                    {listing.priceUnit === "month"
                      ? "/mo"
                      : listing.priceUnit === "day"
                      ? "/day"
                      : "/item"}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted flex-shrink-0" />
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.article>
  );
}

export default function BuildPackagePage() {
  const [city, setCity] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [foodPreference, setFoodPreference] = useState<FoodPreference>("any");
  const [categories, setCategories] = useState<ServiceCategory[]>(
    DEFAULT_CATEGORIES
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BuildPackageResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    const budget = parseInt(totalBudget, 10);
    if (!city.trim()) {
      setError("Please select or enter a city.");
      return;
    }
    if (isNaN(budget) || budget < 0) {
      setError("Please enter a valid budget (₹0 or more).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/packages/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: city.trim(),
          totalBudget: budget,
          foodPreference,
          categories,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to build packages.");
        return;
      }
      setResult({
        packages: data.packages || [],
        city: data.city || city.trim(),
        totalBudget: data.totalBudget ?? budget,
        skippedCategories: data.skippedCategories,
      });
      if (data.message && !data.packages?.length) setError(data.message);
      else setError("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (cat: ServiceCategory) => {
    setCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-body text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Curated for you
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Build your best package
          </h1>
          <p className="font-body text-muted mt-2 max-w-xl mx-auto">
            Tell us your city, budget, and preferences. We’ll suggest 2–3
            combos—PG, food, laundry, bike—so you get the best in each category.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onSubmit={handleSubmit}
          className="rounded-2xl bg-surface border border-white/60 shadow-card p-6 md:p-8 mb-10"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                City / Locality
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-white/60 bg-background px-4 py-3 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              >
                <option value="">Select city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <IndianRupee className="inline h-4 w-4 mr-1" />
                Total monthly budget (₹)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                placeholder="e.g. 20000"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                className="w-full rounded-xl border border-white/60 bg-background px-4 py-3 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              <UtensilsCrossed className="inline h-4 w-4 mr-1" />
              Food preference
            </label>
            <div className="flex flex-wrap gap-3">
              {(["any", "veg", "non-veg"] as const).map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="food"
                    value={opt}
                    checked={foodPreference === opt}
                    onChange={() => setFoodPreference(opt)}
                    className="rounded-full border-white/60 text-primary focus:ring-primary/50"
                  />
                  <span className="font-body text-foreground capitalize">
                    {opt === "non-veg" ? "Non-veg" : opt === "any" ? "Any" : "Veg"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Include in package
            </label>
            <div className="flex flex-wrap gap-3">
              {(["hostel", "mess", "laundry", "bike", "accommodation"] as const).map(
                (cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={categories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="rounded border-white/60 text-primary focus:ring-primary/50"
                    />
                    <span className="font-body text-foreground">
                      {CATEGORY_LABELS[cat]}
                    </span>
                  </label>
                )
              )}
            </div>
            <p className="font-body text-xs text-muted mt-2">
              At least one category is required.
            </p>
          </div>

          {error && !result && (
            <div className="mt-4 p-3 rounded-xl bg-secondary/10 text-secondary text-sm font-body">
              {error}
            </div>
          )}

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading || categories.length === 0}
              className="btn-primary w-full md:w-auto min-w-[200px] inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-heading font-semibold disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Building packages…
                </>
              ) : (
                <>
                  <Package className="h-5 w-5" />
                  Build my package
                </>
              )}
            </button>
          </div>
        </motion.form>

        {result && (
          <section className="space-y-6">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Your curated options for {result.city}
            </h2>
            {result.skippedCategories && result.skippedCategories.length > 0 && (
              <p className="font-body text-sm text-muted rounded-xl bg-muted/30 border border-white/40 px-4 py-3">
                {CATEGORY_LABELS[result.skippedCategories[0]]}
                {result.skippedCategories.length > 1
                  ? result.skippedCategories
                      .slice(1)
                      .reduce(
                        (acc, c) => acc + ", " + CATEGORY_LABELS[c],
                        ""
                      )
                  : ""}{" "}
                {result.skippedCategories.length === 1 ? "is" : "are"} not
                available in {result.city} yet. Packages below show the best
                options for the rest.
              </p>
            )}
            {result.packages.length === 0 ? (
              <p className="font-body text-muted">
                {result.city
                  ? "No packages could be built for this city and budget. Try a higher budget or different city."
                  : "No packages found."}
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {result.packages.map((pkg, i) => (
                  <PackageCard key={pkg.id} pkg={pkg} index={i} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
