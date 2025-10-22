# Business Profile Page - Setup Instructions

## Yandex Maps Integration

The business profile page now includes Yandex Maps integration for location selection. To enable the maps functionality, you need to:

### 1. Get Yandex Maps API Key

1. Visit [Yandex Developer Console](https://developer.tech.yandex.ru/services/)
2. Create a new project or select an existing one
3. Enable the "Maps JavaScript API" service
4. Generate an API key

### 2. Configure Environment Variables

Create a `.env.local` file in the frontend directory with:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Yandex Maps API Key
NEXT_PUBLIC_YANDEX_MAPS_API_KEY=your_actual_api_key_here
```

### 3. Features

- **Interactive Map**: Click anywhere on the map to set business location
- **Draggable Marker**: Drag the marker to fine-tune the location
- **Coordinate Display**: Real-time coordinate display
- **Fallback UI**: Shows a placeholder when API key is not configured

### 4. Token-Based Authentication

The page now uses Zustand store for token management instead of localStorage:

- ✅ Secure token storage
- ✅ Automatic token refresh
- ✅ Proper error handling
- ✅ Authentication state management

### 5. Form Validation

Enhanced form validation with react-hook-form and Zod:

- ✅ Real-time validation
- ✅ Error messages
- ✅ Required field indicators
- ✅ Type-safe form handling

### 6. UI Improvements

- ✅ Modern gradient backgrounds
- ✅ Improved responsive design
- ✅ Better loading states
- ✅ Enhanced error handling
- ✅ Professional card-based layout

## Usage

1. Ensure you're logged in with a valid business account
2. Navigate to `/business/profile`
3. Fill in your business information
4. Use the map to set your business location
5. Upload a business logo
6. Save your changes

The page will automatically validate your input and provide helpful error messages if needed.
