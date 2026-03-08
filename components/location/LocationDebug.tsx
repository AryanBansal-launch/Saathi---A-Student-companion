"use client";

import { useLocationContext } from "@/contexts/LocationContext";
import { MapPin, Trash2, RefreshCw } from "lucide-react";

export default function LocationDebug() {
  const { city, lat, lng, hasPermission, clearLocation, requestLocation } = useLocationContext();

  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-surface border border-muted/30 rounded-xl shadow-lg p-4 max-w-xs">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-primary" />
        <h3 className="font-heading font-semibold text-sm">Location Debug</h3>
      </div>
      
      <div className="space-y-2 text-xs font-mono">
        <div>
          <span className="text-muted">City:</span>{" "}
          <span className="text-foreground font-semibold">{city || "Not detected"}</span>
        </div>
        <div>
          <span className="text-muted">Coords:</span>{" "}
          <span className="text-foreground">
            {lat && lng ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : "N/A"}
          </span>
        </div>
        <div>
          <span className="text-muted">Permission:</span>{" "}
          <span className="text-foreground">
            {hasPermission === null ? "Not asked" : hasPermission ? "Granted" : "Denied"}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={requestLocation}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
        <button
          onClick={clearLocation}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 text-xs font-medium transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>
    </div>
  );
}
