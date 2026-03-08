"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LocationState {
  lat: number | null;
  lng: number | null;
  city: string | null;
  error: string | null;
  loading: boolean;
  hasPermission: boolean | null;
}

interface LocationContextType extends LocationState {
  requestLocation: () => void;
  setCity: (city: string) => void;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const LOCATION_STORAGE_KEY = "saarthi_user_location";

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationState>({
    lat: null,
    lng: null,
    city: null,
    error: null,
    loading: false,
    hasPermission: null,
  });

  // Load saved location from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLocation((prev) => ({
          ...prev,
          ...parsed,
          loading: false,
        }));
      } catch {
        // Invalid saved data, ignore
      }
    }
  }, []);

  const saveLocation = (data: Partial<LocationState>) => {
    const toSave = {
      lat: data.lat,
      lng: data.lng,
      city: data.city,
      hasPermission: data.hasPermission,
    };
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(toSave));
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        loading: false,
        hasPermission: false,
      }));
      return;
    }

    setLocation((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              headers: {
                "User-Agent": "Saarthi App",
              },
            }
          );
          const data = await res.json();
          let city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.state_district ||
            "Unknown";

          // Normalize city name: remove "District" suffix and clean up
          city = city
            .replace(/\s+District$/i, "")
            .replace(/\s+Metropolitan\s+City$/i, "")
            .replace(/\s+Municipal\s+Corporation$/i, "")
            .trim();

          const newLocation = {
            lat: latitude,
            lng: longitude,
            city,
            error: null,
            loading: false,
            hasPermission: true,
          };

          setLocation(newLocation);
          saveLocation(newLocation);
        } catch {
          const newLocation = {
            lat: latitude,
            lng: longitude,
            city: null,
            error: "Could not determine city name",
            loading: false,
            hasPermission: true,
          };
          setLocation(newLocation);
          saveLocation(newLocation);
        }
      },
      (err) => {
        const newLocation = {
          lat: null,
          lng: null,
          city: null,
          error: err.message === "User denied Geolocation" 
            ? "Location access denied" 
            : "Unable to get your location",
          loading: false,
          hasPermission: false,
        };
        setLocation(newLocation);
        localStorage.removeItem(LOCATION_STORAGE_KEY);
      }
    );
  };

  const setCity = (city: string) => {
    const newLocation = {
      ...location,
      city,
    };
    setLocation(newLocation);
    saveLocation(newLocation);
  };

  const clearLocation = () => {
    setLocation({
      lat: null,
      lng: null,
      city: null,
      error: null,
      loading: false,
      hasPermission: null,
    });
    localStorage.removeItem(LOCATION_STORAGE_KEY);
  };

  return (
    <LocationContext.Provider
      value={{
        ...location,
        requestLocation,
        setCity,
        clearLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocationContext must be used within a LocationProvider");
  }
  return context;
}
