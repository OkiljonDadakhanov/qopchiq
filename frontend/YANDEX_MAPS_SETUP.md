# Yandex Maps API Key Setup Instructions

## Getting Your API Key

1. Visit [Yandex Developer Console](https://developer.tech.yandex.ru/services/)
2. Sign in with your Yandex account
3. Create a new project or select an existing one
4. Enable the "Maps JavaScript API" service
5. Generate an API key

## Configuration

Create a `.env.local` file in the frontend directory with:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://qopchiq-backend.vercel.app

# Yandex Maps API Key
NEXT_PUBLIC_YANDEX_MAPS_API_KEY=your_actual_api_key_here
```

## Testing the Maps

1. Set your API key in `.env.local`
2. Restart your development server
3. Navigate to `/business/profile`
4. The map should load with Yandex Maps tiles
5. You can click on the map or drag the marker to set location
6. Save the form to update the business location

## Fallback

If no API key is provided, the map will show a placeholder with instructions to configure the API key.

## Location Data Format

The location is stored in GeoJSON format:
```json
{
  "type": "Point",
  "coordinates": [longitude, latitude]
}
```

Example for Tashkent:
```json
{
  "type": "Point", 
  "coordinates": [69.2401, 41.2995]
}
```
