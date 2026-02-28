"use client";

import { useState, useEffect } from "react";
import { IListing } from "@/types";

export function useRecommendations(city: string | null) {
  const [recommendations, setRecommendations] = useState<IListing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/listings/recommended?city=${encodeURIComponent(city)}`
        );
        if (res.ok) {
          const data = await res.json();
          setRecommendations(data.listings);
        }
      } catch {
        // Silently fail for recommendations
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [city]);

  return { recommendations, loading };
}
