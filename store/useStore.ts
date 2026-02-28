import { create } from "zustand";
import { IListing, FilterOptions, ServiceCategory } from "@/types";

interface AppState {
  listings: IListing[];
  filteredListings: IListing[];
  filters: FilterOptions;
  selectedCity: string;
  isMapView: boolean;
  searchQuery: string;
  isLoading: boolean;

  setListings: (listings: IListing[]) => void;
  setFilteredListings: (listings: IListing[]) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  setSelectedCity: (city: string) => void;
  toggleMapView: () => void;
  setSearchQuery: (query: string) => void;
  setIsLoading: (loading: boolean) => void;
}

const defaultFilters: FilterOptions = {
  sortBy: "saarthiScore",
};

export const useStore = create<AppState>((set) => ({
  listings: [],
  filteredListings: [],
  filters: defaultFilters,
  selectedCity: "",
  isMapView: false,
  searchQuery: "",
  isLoading: false,

  setListings: (listings) => set({ listings, filteredListings: listings }),
  setFilteredListings: (filteredListings) => set({ filteredListings }),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
  setSelectedCity: (city) => set({ selectedCity: city }),
  toggleMapView: () => set((state) => ({ isMapView: !state.isMapView })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
