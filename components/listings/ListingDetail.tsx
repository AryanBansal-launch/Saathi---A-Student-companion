"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle,
  XCircle,
  Lock,
} from "lucide-react";
import type { IListing, ServiceCategory } from "@/types";

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

const PRICE_UNIT_LABELS: Record<string, string> = {
  month: "/month",
  day: "/day",
  item: "/item",
};

interface ListingDetailProps {
  listing: IListing;
}

export default function ListingDetail({ listing }: ListingDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const images = listing.images?.length ? listing.images : [null];
  const priceUnit = PRICE_UNIT_LABELS[listing.priceUnit] ?? "";

  const whatsappLink = listing.contactPhone
    ? `https://wa.me/${listing.contactPhone.replace(/\D/g, "")}`
    : null;

  const handleRevealPhone = () => {
    if (!session) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }
    setShowPhone(true);
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }
  };

  return (
    <div className="font-body">
      {/* Image gallery */}
      <div className="mb-8">
        <div className="relative aspect-[21/9] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
          <AnimatePresence mode="wait">
            {images[selectedImageIndex] ? (
              <motion.div
                key={selectedImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[selectedImageIndex]!}
                  alt={`${listing.title} - Image ${selectedImageIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
              </motion.div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30" />
            )}
          </AnimatePresence>
        </div>

        {images.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImageIndex(i)}
                className={`relative flex-shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImageIndex === i
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                {img ? (
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted/30" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-medium mb-2">
              {CATEGORY_LABELS[listing.category]}
            </span>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              {listing.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-primary">
              ₹{listing.price.toLocaleString()}
            </span>
            <span className="text-muted">{priceUnit}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            {listing.availability ? (
              <CheckCircle className="h-5 w-5 text-accent" />
            ) : (
              <XCircle className="h-5 w-5 text-secondary" />
            )}
            <span
              className={
                listing.availability ? "text-accent font-medium" : "text-secondary"
              }
            >
              {listing.availability ? "Available" : "Unavailable"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <span className="font-medium">{listing.rating?.toFixed(1) ?? "—"}</span>
            <span className="text-muted">({listing.reviewCount} reviews)</span>
          </div>
          {listing.location?.city && (
            <div className="flex items-center gap-1.5 text-muted">
              <MapPin className="h-4 w-4" />
              {listing.location.city}
              {listing.location.address && `, ${listing.location.address}`}
            </div>
          )}
        </div>
      </div>

      {/* Saarthi Score */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white font-heading font-bold text-2xl shadow-lg">
            {Math.round(listing.saarthiScore ?? 0)}
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">
              Saarthi Score
            </h3>
            <p className="text-sm text-muted">
              Our trust score based on reviews, verification & more
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="mb-8">
        <h2 className="font-heading font-semibold text-foreground mb-3">
          Description
        </h2>
        <p className="text-muted leading-relaxed whitespace-pre-wrap">
          {listing.description || "No description provided."}
        </p>
      </section>

      {/* Amenities */}
      {listing.amenities?.length > 0 && (
        <section className="mb-8">
          <h2 className="font-heading font-semibold text-foreground mb-3">
            Amenities
          </h2>
          <div className="flex flex-wrap gap-2">
            {listing.amenities.map((a) => (
              <span
                key={a}
                className="px-4 py-2 rounded-full bg-surface border border-primary/20 text-sm font-medium text-foreground"
              >
                {a}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="p-6 rounded-2xl bg-surface border border-white/50 shadow-sm">
        <h2 className="font-heading font-semibold text-foreground mb-4">
          Contact
        </h2>
        {!session && (
          <div className="mb-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground text-sm mb-1">
                  Login required to view contact details
                </p>
                <p className="text-muted text-sm">
                  Please sign in to reveal phone number and WhatsApp contact
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          {listing.contactPhone && (
            <>
              <button
                onClick={handleRevealPhone}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={!session ? "Login required" : ""}
              >
                {!session ? <Lock className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                {showPhone && session ? listing.contactPhone : "Reveal phone"}
              </button>
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-medium hover:bg-[#20bd5a] transition-colors"
                  title={!session ? "Login required" : ""}
                >
                  {!session ? <Lock className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                  WhatsApp
                </a>
              )}
            </>
          )}
          {!listing.contactPhone && (
            <p className="text-muted">Contact information not available.</p>
          )}
        </div>
      </section>
    </div>
  );
}
