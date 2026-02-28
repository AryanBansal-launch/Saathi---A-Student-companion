"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { IListing } from "@/types";

// Fix default marker icon in Next.js (leaflet uses window which is undefined in SSR)
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface MapViewClientProps {
  listings: IListing[];
  center: [number, number];
  zoom: number;
}

function MapCenterController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

export default function MapViewClient({
  listings,
  center,
  zoom,
}: MapViewClientProps) {
  const validListings = listings.filter(
    (l) =>
      l.location?.lat != null &&
      l.location?.lng != null &&
      !isNaN(l.location.lat) &&
      !isNaN(l.location.lng)
  );

  const PRICE_UNIT_LABELS: Record<string, string> = {
    month: "/mo",
    day: "/day",
    item: "/item",
  };

  return (
    <div className="h-full min-h-[400px] w-full rounded-2xl overflow-hidden border border-white/50 shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full z-0"
        scrollWheelZoom={true}
      >
        <MapCenterController center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validListings.map((listing) => (
          <Marker
            key={listing._id}
            position={[listing.location!.lat, listing.location!.lng]}
          >
            <Popup>
              <div className="min-w-[200px] p-1">
                <h3 className="font-heading font-semibold text-foreground text-sm mb-1 line-clamp-2">
                  {listing.title}
                </h3>
                <p className="font-body text-primary font-bold text-sm mb-2">
                  ₹{listing.price.toLocaleString()}
                  {PRICE_UNIT_LABELS[listing.priceUnit] || ""}
                </p>
                <Link
                  href={`/listing/${listing._id}`}
                  className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  View listing
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
