"use client";

import { useState, useRef } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import type { IListing, ServiceCategory } from "@/types";

const CATEGORIES: ServiceCategory[] = [
  "hostel",
  "mess",
  "bike",
  "accommodation",
  "laundry",
  "furniture",
  "books",
  "other",
];

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

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum([
    "hostel",
    "mess",
    "bike",
    "accommodation",
    "laundry",
    "furniture",
    "books",
    "other",
  ]),
  price: z.coerce.number().min(0, "Price must be positive"),
  priceUnit: z.enum(["month", "day", "item"]),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  contactPhone: z.string().optional(),
  amenities: z.array(z.string()),
  amenityInput: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ListingFormProps {
  defaultValues?: Partial<IListing>;
  onSubmit: (data: FormData & { images?: string[] }) => void;
  isEditing?: boolean;
}

export default function ListingForm({
  defaultValues,
  onSubmit,
  isEditing = false,
}: ListingFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      category: defaultValues?.category ?? "hostel",
      price: defaultValues?.price ?? 0,
      priceUnit: defaultValues?.priceUnit ?? "month",
      address: defaultValues?.location?.address ?? "",
      city: defaultValues?.location?.city ?? "",
      lat: defaultValues?.location?.lat ?? undefined,
      lng: defaultValues?.location?.lng ?? undefined,
      contactPhone: defaultValues?.contactPhone ?? "",
      amenities: defaultValues?.amenities ?? [],
    },
  });

  const amenities = watch("amenities") ?? [];
  const amenityInput = watch("amenityInput") ?? "";
  const [imageUrls, setImageUrls] = useState<string[]>(defaultValues?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addAmenity = () => {
    const trimmed = amenityInput.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setValue("amenities", [...amenities, trimmed]);
      setValue("amenityInput", "");
    }
  };

  const removeAmenity = (item: string) => {
    setValue(
      "amenities",
      amenities.filter((a) => a !== item)
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: dataUrl }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Upload failed");
        }
        const { url } = await res.json();
        setImageUrls((prev) => [...prev, url]);
        e.target.value = "";
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploading(false);
      alert(err instanceof Error ? err.message : "Failed to upload image");
    }
  };

  const removeImage = (url: string) => {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  };

  const onFormSubmit = (data: FormData) => {
    onSubmit({ ...data, images: imageUrls });
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-6 font-body"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Title
          </label>
          <input
            {...register("title")}
            className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="e.g. Cozy PG near campus"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-secondary">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Category
          </label>
          <select
            {...register("category")}
            className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Describe your listing..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-secondary">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Price
          </label>
          <input
            type="number"
            {...register("price")}
            min={0}
            step={0.01}
            className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-secondary">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Price unit
          </label>
          <select
            {...register("priceUnit")}
            className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="month">Per month</option>
            <option value="day">Per day</option>
            <option value="item">Per item</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Address
        </label>
        <input
          {...register("address")}
          className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Street address"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            City
          </label>
          <input
            {...register("city")}
            className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="e.g. Bangalore"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-secondary">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Contact phone
          </label>
          <input
            {...register("contactPhone")}
            type="tel"
            className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            {...register("lat")}
            className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="12.9716"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            {...register("lng")}
            className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="77.5946"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Amenities
        </label>
        <div className="flex gap-2 mb-2">
          <input
            {...register("amenityInput")}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
            className="flex-1 rounded-xl border border-muted/30 bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Add amenity and press Enter"
          />
          <button
            type="button"
            onClick={addAmenity}
            className="rounded-xl bg-primary px-4 py-3 text-white hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {amenities.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm"
            >
              {a}
              <button
                type="button"
                onClick={() => removeAmenity(a)}
                className="hover:text-secondary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Images
        </label>
        <div className="rounded-xl border border-muted/30 bg-surface p-4 space-y-3">
          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {imageUrls.map((url) => (
                <div
                  key={url}
                  className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted/20 border border-muted/20"
                >
                  <Image
                    src={url}
                    alt="Listing"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-muted/40 text-muted hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading ? "Uploading…" : "Add photo"}
            </button>
            <span className="text-xs text-muted">Optional. JPEG, PNG, WebP.</span>
          </div>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/90 py-3.5 font-heading font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Saving..." : isEditing ? "Update listing" : "Create listing"}
      </motion.button>
    </form>
  );
}
