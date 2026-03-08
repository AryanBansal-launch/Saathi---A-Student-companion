# 📍 Location Detection UI Guide

## Visual Walkthrough

### 1. Location Banner (First Visit)

```
┌─────────────────────────────────────────────────────────────────┐
│  📍  Enable location for better results                  [Detect Location] ✕ │
│      We'll show you services available in your area                         │
└─────────────────────────────────────────────────────────────────┘
```

**What users see:**
- Friendly banner at the top of the page
- Map pin icon (📍) on the left
- Clear message explaining the benefit
- Blue "Detect Location" button
- Dismiss button (✕) on the right

**Colors:**
- Background: Gradient from primary/secondary colors
- Border: Subtle primary color
- Button: Primary blue with hover effect

---

### 2. Location Banner (Loading State)

```
┌─────────────────────────────────────────────────────────────────┐
│  📍  Detecting your location...                           [⟳ Detecting...] ✕ │
│      Please wait while we find your city                                    │
└─────────────────────────────────────────────────────────────────┘
```

**What happens:**
- Message changes to "Detecting your location..."
- Button shows spinner icon (⟳)
- Button text changes to "Detecting..."
- Button is disabled during detection

---

### 3. Home Page Search (After Detection)

```
┌──────────────────────────────────────────────────────────────┐
│  New city. New start. We've got your back.                   │
│  Find hostels, mess, bikes, and everything you need          │
│                                                               │
│  ┌────────────────────────────────────┐                      │
│  │ 📍 Pune                        📍 │  [Explore Now →]     │
│  └────────────────────────────────────┘                      │
└──────────────────────────────────────────────────────────────┘
```

**What users see:**
- City input auto-filled with "Pune" (detected city)
- Location icon (📍) on the right side of input
- Clicking location icon re-detects location
- Placeholder shows detected city if input is empty

---

### 4. Explore Page - Filter Bar

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Browse                                                                   │
│  Explore Services                                                         │
│  Find hostels, mess, bikes, and more in your city                        │
│                                                                           │
│  ┌──────────────┬──────────────┬──────────┬──────────┬──────────────┐   │
│  │ 📍 Pune      │ Category ▾   │ Min ₹    │ Max ₹    │ ⭐⭐⭐⭐⭐   │   │
│  └──────────────┴──────────────┴──────────┴──────────┴──────────────┘   │
│                                                                           │
│  45 results found                                      [🗺️ Map View]     │
└─────────────────────────────────────────────────────────────────────────┘
```

**Filter Bar Components:**
1. **City Input** (first field)
   - Shows detected city "Pune"
   - Map pin icon (📍) on left
   - Can type to change city
   - Autocomplete with popular cities

2. **Category Dropdown**
   - Filter by service type
   - Works together with city filter

3. **Price Range**
   - Min and Max price inputs
   - Works with city filter

4. **Rating Filter**
   - Star icons for rating
   - Works with city filter

---

### 5. Mobile View - Location Banner

```
┌───────────────────────────────┐
│  📍  Enable location          │
│      for better results       │
│                               │
│  [Enable] ✕                   │
└───────────────────────────────┘
```

**Mobile Optimizations:**
- Stacked layout for small screens
- Shorter button text ("Enable" instead of "Detect Location")
- Larger touch targets
- Responsive padding

---

### 6. Error State (Permission Denied)

```
┌─────────────────────────────────────────────────────────────────┐
│  📍  Enable location for better results                  [Detect Location] ✕ │
│      We'll show you services available in your area                         │
│      ⚠️ Location access denied                                              │
└─────────────────────────────────────────────────────────────────┘
```

**What users see:**
- Red error message below description
- Button still available to retry
- User can dismiss banner
- Can still use app with manual city input

---

## Color Scheme

### Location Banner
```css
Background: gradient(primary/10%, secondary/5%, accent/10%)
Border: primary/20%
Text: foreground (dark)
Button: primary (blue)
Button Hover: primary/darker
Error: red-600
```

### Filter Bar City Input
```css
Background: surface (white/light)
Border: muted/20%
Focus Border: primary
Icon: muted (gray)
Text: foreground (dark)
Placeholder: muted (gray)
```

---

## Interactive States

### Location Button States

1. **Default**
   ```
   [Detect Location]
   - Blue background
   - White text
   - Hover: Slightly darker blue
   ```

2. **Loading**
   ```
   [⟳ Detecting...]
   - Spinner animation
   - Disabled state
   - Cursor: not-allowed
   ```

3. **Success** (banner disappears)
   ```
   - Banner fades out
   - City appears in inputs
   - No visual button needed
   ```

4. **Error**
   ```
   [Detect Location]
   - Same as default
   - Red error text below
   - Can retry
   ```

---

## Animations

### Banner Entrance
```
Initial: opacity: 0, y: -20px
Animate: opacity: 1, y: 0
Duration: 300ms
Easing: ease-out
```

### Banner Exit
```
Exit: opacity: 0, y: -20px
Duration: 200ms
Easing: ease-in
```

### Loading Spinner
```
Rotation: 360deg continuous
Duration: 1s
Easing: linear
```

---

## Accessibility

### ARIA Labels
```html
<button aria-label="Detect my location">
  Detect Location
</button>

<button aria-label="Dismiss location banner">
  ✕
</button>

<input 
  aria-label="Enter your city" 
  placeholder="Pune"
/>
```

### Keyboard Navigation
- Banner buttons: Tab to focus, Enter/Space to activate
- City input: Tab to focus, Type to edit
- Dismiss button: Tab to focus, Enter/Space to dismiss

### Screen Reader Support
- Banner announces: "Enable location for better results"
- Loading announces: "Detecting your location"
- Success announces: "Location detected: Pune"
- Error announces: "Location access denied"

---

## Responsive Breakpoints

### Desktop (≥768px)
```
Banner: Full width, horizontal layout
City Input: 200px min-width
Button: Full text "Detect Location"
```

### Tablet (640px - 767px)
```
Banner: Full width, horizontal layout
City Input: Flexible width
Button: Full text
```

### Mobile (<640px)
```
Banner: Full width, vertical stack
City Input: Full width
Button: Short text "Enable"
Filter Bar: Vertical stack
```

---

## Example Screens

### Complete Home Page Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  📍  Enable location for better results          [Detect Location] ✕ │
│      We'll show you services available in your area                   │
└─────────────────────────────────────────────────────────────────┘

                    New city. New start.
                We've got your back.

        Find hostels, mess, bikes, and everything
                    you need

        ┌────────────────────┐  ┌──────────────┐
        │ 📍 Enter city...  │  │ Explore Now →│
        └────────────────────┘  └──────────────┘

                ⬇ User clicks "Detect Location"

┌─────────────────────────────────────────────────────────────────┐
│  📍  Detecting your location...                   [⟳ Detecting...] ✕ │
│      Please wait while we find your city                              │
└─────────────────────────────────────────────────────────────────┘

                    New city. New start.
                We've got your back.

        ┌────────────────────┐  ┌──────────────┐
        │ 📍 Detecting...    │  │ Explore Now →│
        └────────────────────┘  └──────────────┘

                ⬇ Location detected (2-3 seconds)

                    New city. New start.
                We've got your back.

        ┌────────────────────┐  ┌──────────────┐
        │ 📍 Pune        📍  │  │ Explore Now →│
        └────────────────────┘  └──────────────┘

        [Banner disappears, city auto-filled]
```

---

## Tips for Users

### ✅ Best Practices
- Allow location access for best experience
- Location is saved for future visits
- Can change city manually anytime
- Dismiss banner if you prefer manual input

### 🔒 Privacy
- Location stays in your browser
- Not shared with server
- Can clear anytime
- Works without location too

### 🛠️ Troubleshooting
- **Not detecting?** Check browser location settings
- **Wrong city?** Manually type correct city
- **Banner stuck?** Dismiss and use manual input
- **HTTPS required** in production (works on localhost)

---

## Developer Notes

### Customizing Colors
Edit in `tailwind.config.js`:
```js
colors: {
  primary: '#your-color',
  secondary: '#your-color',
  accent: '#your-color',
}
```

### Customizing Text
Edit in component files:
- Banner: `components/location/LocationBanner.tsx`
- Home: `app/(student)/page.tsx`
- Filter: `components/listings/FilterBar.tsx`

### Disabling Feature
Remove `<LocationBanner />` from home page to hide banner.
Location context still works for manual detection.

---

**Last Updated**: March 8, 2026  
**Version**: 1.0.0
