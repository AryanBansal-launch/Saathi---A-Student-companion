# Automatic Location Detection Feature

## Overview

The Saarthi platform now includes automatic location detection that helps users find services in their city without manual input. This feature uses the browser's Geolocation API and reverse geocoding to detect the user's city and automatically apply it as a filter across the platform.

## Features Implemented

### 1. **Location Context Provider** (`contexts/LocationContext.tsx`)
- Global state management for user location
- Persistent storage using localStorage
- Automatic location detection with user permission
- Manual city override capability
- Error handling for denied permissions or unsupported browsers

### 2. **Location Banner** (`components/location/LocationBanner.tsx`)
- Non-intrusive banner prompting users to enable location
- Shows loading state during detection
- Dismissible by user
- Auto-hides when location is detected or permission denied

### 3. **Home Page Integration**
- Auto-fills city input with detected location
- Quick location button in search input
- Seamless integration with existing city search
- Shows detected city in recommendations

### 4. **Explore Page Integration**
- Automatically applies detected city as filter
- Respects URL parameters (higher priority)
- Works with existing filter system
- Updates listings based on detected location

### 5. **Filter Bar Enhancement**
- Added city input field with location icon
- Shows detected city as placeholder
- Autocomplete with popular cities
- Integrates with existing filter system

## How It Works

### User Flow

1. **First Visit**
   - User lands on homepage
   - Location banner appears at top
   - User clicks "Detect Location" button
   - Browser requests location permission

2. **Permission Granted**
   - System gets GPS coordinates
   - Reverse geocoding converts coordinates to city name
   - City is saved to localStorage
   - City auto-fills in search inputs
   - Banner disappears
   - Filters automatically apply detected city

3. **Permission Denied**
   - Banner shows error message
   - User can manually enter city
   - Banner can be dismissed
   - System falls back to manual input

4. **Subsequent Visits**
   - Location loaded from localStorage
   - No banner shown (already detected)
   - City automatically applied to filters
   - User can change city manually anytime

### Technical Implementation

```typescript
// Location is stored globally via Context API
const { 
  city,           // Detected city name
  lat, lng,       // GPS coordinates
  loading,        // Detection in progress
  error,          // Error message if any
  hasPermission,  // Permission status
  requestLocation, // Trigger detection
  setCity,        // Manual override
  clearLocation   // Reset
} = useLocationContext();
```

### Data Flow

```
Browser Geolocation API
    ↓
GPS Coordinates (lat, lng)
    ↓
OpenStreetMap Nominatim API (Reverse Geocoding)
    ↓
City Name
    ↓
LocationContext (Global State)
    ↓
localStorage (Persistence)
    ↓
Components (Home, Explore, FilterBar)
    ↓
API Filters (listings?city=...)
```

## Privacy & Security

- **User Consent**: Location is only accessed after explicit user action
- **No Server Storage**: Location data stays in browser (localStorage)
- **Manual Override**: Users can change or clear location anytime
- **Graceful Degradation**: Works without location permission
- **HTTPS Only**: Geolocation API requires secure context

## API Usage

### Reverse Geocoding
- **Service**: OpenStreetMap Nominatim
- **Endpoint**: `https://nominatim.openstreetmap.org/reverse`
- **Rate Limit**: 1 request per second (handled by single user action)
- **Free**: No API key required
- **Privacy**: No tracking, open-source

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Yes  |
| Firefox | ✅ Yes  |
| Safari  | ✅ Yes  |
| Edge    | ✅ Yes  |
| Opera   | ✅ Yes  |

**Note**: Requires HTTPS in production (localhost works in development)

## User Benefits

1. **Faster Onboarding**: No need to type city name
2. **Accurate Results**: GPS-based location is more precise
3. **Personalized Experience**: Automatic filtering for relevant listings
4. **Convenience**: One-click location detection
5. **Privacy Control**: User decides if/when to share location

## Developer Notes

### Adding Location to New Pages

```typescript
import { useLocationContext } from "@/contexts/LocationContext";

function MyComponent() {
  const { city, requestLocation } = useLocationContext();
  
  return (
    <div>
      <p>Your city: {city || "Not detected"}</p>
      <button onClick={requestLocation}>Detect Location</button>
    </div>
  );
}
```

### Clearing Location (e.g., for testing)

```typescript
const { clearLocation } = useLocationContext();

// Clear stored location
clearLocation();
```

### Checking Permission Status

```typescript
const { hasPermission } = useLocationContext();

if (hasPermission === null) {
  // Not yet requested
} else if (hasPermission === true) {
  // Permission granted
} else {
  // Permission denied
}
```

## Future Enhancements

- [ ] Add "Nearby" sorting based on GPS coordinates
- [ ] Show distance from user to listings
- [ ] Map view centered on user location
- [ ] Location-based push notifications
- [ ] Multiple saved locations (home, college, etc.)
- [ ] City-specific content recommendations
- [ ] Weather integration for detected city

## Testing

### Manual Testing Checklist

- [ ] First visit shows location banner
- [ ] Clicking "Detect Location" requests permission
- [ ] Granting permission detects and saves city
- [ ] Denying permission shows error message
- [ ] Banner can be dismissed
- [ ] Detected city appears in home page input
- [ ] Explore page auto-filters by detected city
- [ ] Filter bar shows detected city
- [ ] Manual city input overrides detected city
- [ ] Location persists across page refreshes
- [ ] Location persists across browser sessions

### Browser Testing

Test in multiple browsers to ensure Geolocation API compatibility.

## Troubleshooting

### Location Not Detecting
- Check if HTTPS is enabled (required in production)
- Verify browser supports Geolocation API
- Check if location services are enabled on device
- Try clearing localStorage and requesting again

### Wrong City Detected
- GPS accuracy varies by device and environment
- Indoor locations may be less accurate
- User can manually correct the city
- Consider adding "Is this correct?" confirmation

### Banner Not Appearing
- Check if location already saved in localStorage
- Verify LocationProvider is in component tree
- Check if user previously dismissed banner

## Files Modified/Created

### New Files
- `contexts/LocationContext.tsx` - Global location state management
- `components/location/LocationBanner.tsx` - Location prompt UI
- `LOCATION_FEATURE.md` - This documentation

### Modified Files
- `app/providers.tsx` - Added LocationProvider
- `app/(student)/page.tsx` - Integrated location detection
- `app/(student)/explore/page.tsx` - Auto-apply detected city filter
- `components/listings/FilterBar.tsx` - Added city input field

## Support

For issues or questions about the location feature:
1. Check browser console for errors
2. Verify HTTPS in production
3. Test with browser location services enabled
4. Check localStorage for saved location data

---

**Last Updated**: March 8, 2026
**Version**: 1.0.0
**Author**: Saarthi Development Team
