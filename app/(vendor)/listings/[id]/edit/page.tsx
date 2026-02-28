"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import ListingForm from "@/components/listings/ListingForm";

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setListing)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: any) => {
    const payload = {
      title: data.title,
      description: data.description,
      category: data.category,
      price: data.price,
      priceUnit: data.priceUnit,
      contactPhone: data.contactPhone,
      amenities: data.amenities ?? [],
      images: data.images ?? listing?.images ?? [],
      availability: data.availability ?? true,
      location: {
        address: data.address ?? data.location?.address ?? "",
        city: data.city ?? data.location?.city ?? "",
        lat: data.lat ?? data.location?.lat ?? 0,
        lng: data.lng ?? data.location?.lng ?? 0,
      },
    };
    const res = await fetch(`/api/listings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to update listing");
    }
    router.push("/listings");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="p-8 text-center">
        <p className="font-body text-muted">Listing not found.</p>
        <Link href="/listings" className="text-primary font-medium mt-2 inline-block">
          Back to Listings
        </Link>
      </div>
    );
  }

  const defaultValues = {
    title: listing.title,
    description: listing.description,
    category: listing.category,
    price: listing.price,
    priceUnit: listing.priceUnit,
    location: listing.location,
    address: listing.location?.address,
    city: listing.location?.city,
    lat: listing.location?.lat,
    lng: listing.location?.lng,
    contactPhone: listing.contactPhone,
    amenities: listing.amenities ?? [],
    availability: listing.availability,
    images: listing.images ?? [],
  };

  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <Link
        href="/listings"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground font-body mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Listings
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-heading text-2xl font-bold text-foreground mb-6">
          Edit Listing
        </h1>
        <ListingForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isEditing
        />
      </motion.div>
    </div>
  );
}
