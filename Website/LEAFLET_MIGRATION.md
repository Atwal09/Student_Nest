# OpenStreetMap + Leaflet.js Migration

## ✅ Migration Complete!

We've successfully migrated from Google Maps to OpenStreetMap using Leaflet.js. This eliminates the need for Google Maps API keys and provides a free, open-source mapping solution.

## 🎯 What Changed

### Before (Google Maps)
- ❌ Required Google Maps API key
- ❌ Required billing enabled
- ❌ API restrictions and rate limits
- ❌ Cost for high usage

### After (Leaflet + OpenStreetMap)
- ✅ **No API key needed**
- ✅ **Completely free**
- ✅ **No billing required**
- ✅ **Open source**
- ✅ **No rate limits** (reasonable use)

## 📦 New Dependencies Added

```bash
npm install leaflet react-leaflet @types/leaflet
```

## 🗺️ Components Updated

### 1. LeafletLocationSelector
**File:** `src/components/map/LeafletLocationSelector.tsx`

Features:
- ✅ Click on map to select location
- ✅ Search for locations
- ✅ Get current location
- ✅ Reverse geocoding (coordinates → address)
- ✅ Forward geocoding (address → coordinates)
- ✅ Uses Nominatim (OpenStreetMap's geocoding service)

### 2. Export Index
**File:** `src/components/map/index.ts`

The index file now exports `LeafletLocationSelector` as `LocationSelector`, making it a drop-in replacement.

```typescript
// Import works the same way
import { LocationSelector } from '@/components/map';
```

## 🔧 How It Works

### Geocoding Service
We use **Nominatim** (OpenStreetMap's free geocoding service):

#### Reverse Geocoding (Coordinates → Address)
```javascript
const response = await fetch(
  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
);
```

#### Forward Geocoding (Address → Coordinates)
```javascript
const response = await fetch(
  `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
);
```

### Map Tiles
We use OpenStreetMap's free tile servers:
```
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

## ⚙️ Usage Example

```typescript
import { LocationSelector } from '@/components/map';

function MyComponent() {
  const handleLocationSelect = (location: {
    address: string;
    city: string;
    coordinates: { lat: number; lng: number };
  }) => {
    console.log('Selected:', location);
  };

  return (
    <LocationSelector
      onLocationSelect={handleLocationSelect}
      initialLocation={{ lat: 28.6139, lng: 77.2090 }}
      height="400px"
    />
  );
}
```

## 🌐 API Services Used

### Nominatim (Geocoding)
- **Service:** OpenStreetMap Nominatim
- **Endpoint:** `https://nominatim.openstreetmap.org`
- **Cost:** Free
- **Rate Limit:** 1 request/second (polite use)
- **Documentation:** https://nominatim.org/release-docs/latest/api/Overview/

### Map Tiles
- **Service:** OpenStreetMap
- **Tiles:** `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Cost:** Free
- **License:** Open Database License
- **Attribution:** Required (automatically included)

## 🚀 Next Steps

### Optional: Use Alternative Tile Providers

You can customize the map style by using other tile providers:

#### 1. **Mapbox** (requires API key, but has free tier)
```typescript
<TileLayer
  url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
  id="mapbox/streets-v11"
  accessToken="YOUR_MAPBOX_TOKEN"
/>
```

#### 2. **CartoDB** (free, no API key)
```typescript
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
/>
```

#### 3. **Stamen Terrain** (free, no API key)
```typescript
<TileLayer
  url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png"
/>
```

### Other Map Components to Migrate

The following components still use Google Maps and should be migrated:

1. ❌ `RoomsMapView.tsx` - Shows multiple room markers
2. ❌ `RoomLocationMap.tsx` - Shows single room location
3. ✅ `LocationSelector.tsx` - **Already migrated to Leaflet**

## 📝 Important Notes

### Nominatim Usage Policy
- Maximum 1 request per second
- Include a valid User-Agent or Referer header
- Be reasonable with request volume
- Consider self-hosting Nominatim for high-volume needs

### SSR Considerations
Leaflet requires browser APIs, so we use Next.js dynamic imports with `ssr: false`:

```typescript
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
```

### Styling
Leaflet CSS is imported globally in `globals.css`:
```css
@import "leaflet/dist/leaflet.css";
```

## 🎉 Benefits

1. **No API Key Issues** - No more `InvalidKeyMapError`
2. **No Billing Required** - Completely free
3. **Open Source** - Full control and transparency
4. **Privacy Friendly** - No tracking from Google
5. **Offline Capable** - Can cache tiles for offline use
6. **Customizable** - Easy to change tile providers and styles

## 🔄 Reverting to Google Maps

If you need to revert to Google Maps:

1. Update `src/components/map/index.ts`:
```typescript
// Comment out Leaflet
// export { LeafletLocationSelector as LocationSelector } from './LeafletLocationSelector';

// Uncomment Google Maps
export { LocationSelector } from './LocationSelector';
```

2. Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in `.env`

3. Both implementations have the same API interface, so no code changes needed!
