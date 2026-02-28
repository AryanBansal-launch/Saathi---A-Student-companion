"use client";

import { useState, useEffect } from "react";

interface LocationState {
  lat: number | null;
  lng: number | null;
  city: string | null;
  error: string | null;
  loading: boolean;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    lat: null,
    lng: null,
    city: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported",
        loading: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "Unknown";
          setLocation({
            lat: latitude,
            lng: longitude,
            city,
            error: null,
            loading: false,
          });
        } catch {
          setLocation({
            lat: latitude,
            lng: longitude,
            city: null,
            error: "Could not determine city",
            loading: false,
          });
        }
      },
      (err) => {
        setLocation((prev) => ({
          ...prev,
          error: err.message,
          loading: false,
        }));
      }
    );
  }, []);

  return location;
}
