import type { ServiceCategory } from "@/types";

/**
 * Get relevant fallback image from Unsplash based on listing category
 * These are high-quality, relevant images that match each service type
 */
export function getFallbackImage(category: ServiceCategory): string {
  const fallbackImages: Record<ServiceCategory, string> = {
    hostel: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80", // Modern hostel room
    accommodation: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", // Cozy apartment
    mess: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", // Indian food
    bike: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80", // Bike/scooter
    laundry: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&q=80", // Laundry service
    furniture: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80", // Modern furniture
    books: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80", // Books
    other: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80", // General services
  };

  return fallbackImages[category];
}

/**
 * Get the first image from listing or fallback to category-relevant image
 */
export function getListingImage(
  images: string[] | undefined,
  category: ServiceCategory
): string | null {
  if (images && images.length > 0) {
    return images[0];
  }
  return getFallbackImage(category);
}
