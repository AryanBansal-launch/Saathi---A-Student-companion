"use client";

import dynamic from "next/dynamic";
import type { IListing } from "@/types";

const MapViewClient = dynamic(
  () => import("./MapViewClient"),
  { ssr: false }
);

interface MapViewProps {
  listings: IListing[];
  center?: [number, number];
  zoom?: number;
}

export default function MapView({
  listings,
  center = [28.6139, 77.2090],
  zoom = 12,
}: MapViewProps) {
  return (
    <MapViewClient
      listings={listings}
      center={center}
      zoom={zoom}
    />
  );
}
