export type UserRole = "student" | "vendor" | "admin";

export type ServiceCategory =
  | "hostel"
  | "mess"
  | "bike"
  | "accommodation"
  | "laundry"
  | "furniture"
  | "books"
  | "other";

export type PriceUnit = "month" | "day" | "item";

export type InteractionType = "view" | "save" | "contact" | "review";

export interface LocationData {
  address?: string;
  city: string;
  lat: number;
  lng: number;
}

export interface UserPreferences {
  budget?: number;
  categories?: ServiceCategory[];
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  phone?: string;
  city?: string;
  location?: { lat: number; lng: number };
  preferences?: UserPreferences;
  savedListings?: string[];
  createdAt: Date;
}

export interface IListing {
  _id: string;
  vendorId: string;
  category: ServiceCategory;
  title: string;
  description: string;
  price: number;
  priceUnit: PriceUnit;
  images: string[];
  location: LocationData;
  amenities: string[];
  availability: boolean;
  contactPhone?: string;
  rating: number;
  reviewCount: number;
  saarthiScore: number;
  approved: boolean;
  createdAt: Date;
}

export interface IReview {
  _id: string;
  listingId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user?: { name: string };
}

export interface IVendor {
  _id: string;
  userId: string;
  businessName: string;
  verified: boolean;
  totalListings: number;
  rating: number;
}

export interface IInteraction {
  _id: string;
  userId: string;
  listingId: string;
  type: InteractionType;
  timestamp: Date;
}

export interface SaarthiScore {
  listingId: string;
  score: number;
}

export interface FilterOptions {
  category?: ServiceCategory;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  rating?: number;
  sortBy?: "saarthiScore" | "price_asc" | "price_desc" | "rating" | "distance";
  lat?: number;
  lng?: number;
  radius?: number;
  search?: string;
}

/** Package builder: food preference for mess */
export type FoodPreference = "veg" | "non-veg" | "any";

/** Request body for building packages */
export interface BuildPackageRequest {
  city: string;
  totalBudget: number;
  foodPreference?: FoodPreference;
  /** Categories to include (default: hostel, mess, laundry, bike) */
  categories?: ServiceCategory[];
}

/** One curated package (one option per category) */
export interface CuratedPackage {
  id: string;
  name: string;
  description: string;
  totalMonthlyPrice: number;
  items: { category: ServiceCategory; listing: IListing }[];
}

/** Response from package builder API */
export interface BuildPackageResponse {
  packages: CuratedPackage[];
  city: string;
  totalBudget: number;
  /** Categories the user asked for but had no listings in this city */
  skippedCategories?: ServiceCategory[];
}
