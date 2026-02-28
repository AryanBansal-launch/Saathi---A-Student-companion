"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ListingForm from "@/components/listings/ListingForm";

export default function NewListingPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    const payload = {
      title: data.title,
      description: data.description,
      category: data.category,
      price: data.price,
      priceUnit: data.priceUnit,
      contactPhone: data.contactPhone,
      amenities: data.amenities ?? [],
      images: data.images ?? [],
      location: {
        address: data.address ?? "",
        city: data.city ?? "",
        lat: data.lat ?? 0,
        lng: data.lng ?? 0,
      },
    };
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to create listing");
    }
    const listing = await res.json();
    router.push("/listings");
    router.refresh();
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
          Add New Listing
        </h1>
        <ListingForm onSubmit={handleSubmit} />
      </motion.div>
    </div>
  );
}
