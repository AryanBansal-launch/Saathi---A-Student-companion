"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Loader2, Navigation } from "lucide-react";
import { useLocationContext } from "@/contexts/LocationContext";
import { useState } from "react";

export default function LocationBanner() {
  const { city, loading, error, hasPermission, requestLocation } = useLocationContext();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if already has city, dismissed, or explicitly denied
  if (city || dismissed || hasPermission === false) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border-b border-primary/20"
      >
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary flex-shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-foreground text-sm sm:text-base">
                  {loading ? "Detecting your location..." : "Enable location for better results"}
                </p>
                <p className="font-body text-xs sm:text-sm text-muted mt-0.5">
                  {loading 
                    ? "Please wait while we find your city"
                    : "We'll show you services available in your area"}
                </p>
                {error && (
                  <p className="font-body text-xs text-red-600 mt-1">
                    {error}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!loading && (
                <button
                  onClick={requestLocation}
                  disabled={loading}
                  className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
                >
                  <Navigation className="h-4 w-4" />
                  <span className="hidden sm:inline">Detect Location</span>
                  <span className="sm:hidden">Enable</span>
                </button>
              )}
              {loading && (
                <div className="flex items-center gap-2 px-4 py-2 text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm hidden sm:inline">Detecting...</span>
                </div>
              )}
              <button
                onClick={() => setDismissed(true)}
                className="p-2 rounded-lg hover:bg-muted/20 text-muted hover:text-foreground transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
