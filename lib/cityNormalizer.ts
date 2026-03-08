/**
 * Normalizes city names for consistent filtering
 * Removes common suffixes like "District", "Metropolitan City", etc.
 */
export function normalizeCity(city: string | null | undefined): string {
  if (!city) return "";
  
  return city
    .trim()
    // Remove common administrative suffixes
    .replace(/\s+District$/i, "")
    .replace(/\s+Metropolitan\s+City$/i, "")
    .replace(/\s+Municipal\s+Corporation$/i, "")
    .replace(/\s+Urban\s+Agglomeration$/i, "")
    .replace(/\s+City$/i, "")
    // Normalize spacing
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Creates a regex pattern for flexible city matching
 * Matches "Pune", "Pune District", "pune", etc.
 */
export function createCityRegex(city: string | null | undefined): RegExp | null {
  if (!city) return null;
  
  const normalized = normalizeCity(city);
  if (!normalized) return null;
  
  // Escape special regex characters
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  
  // Match the city name with optional suffixes
  return new RegExp(`^${escaped}(\\s+(District|Metropolitan\\s+City|Municipal\\s+Corporation|City))?$`, "i");
}
