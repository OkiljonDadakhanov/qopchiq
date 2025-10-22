"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Upload,
  Store,
  Loader2,
  MapPin,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBusinessToken, useBusinessIsHydrated } from "@/store/business-store";
import client from "@/api/client";

// Form validation schema
const businessProfileSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a complete address"),
  description: z.string().optional(),
});

type BusinessProfileForm = z.infer<typeof businessProfileSchema>;

interface Position {
  lat: number;
  lng: number;
}

interface BusinessData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  description: string;
  avatar: string | null;
  address: string;
  location: {
    type: string;
    coordinates: number[];
  };
  documents: string[];
  isVerified: boolean;
  isApproved: boolean;
}

// Yandex Maps component
function YandexMap({ position, onChange }: { position: Position; onChange: (pos: Position) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current) {
      // Load Yandex Maps API
      const script = document.createElement('script');
      const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || 'your_yandex_maps_api_key_here';
      script.src = `https://api-maps.yandex.ru/3.0/?apikey=${apiKey}&lang=en_US`;
      script.async = true;
      
      script.onload = () => {
        if ((window as any).ymaps) {
          (window as any).ymaps.ready(() => {
            if (mapRef.current) {
              mapInstanceRef.current = new (window as any).ymaps.Map(mapRef.current, {
                center: [position.lat, position.lng],
                zoom: 13,
                controls: ['zoomControl', 'fullscreenControl']
              });

              // Add marker
              markerRef.current = new (window as any).ymaps.Placemark(
                [position.lat, position.lng],
                {},
                {
                  draggable: true,
                  iconLayout: 'default#image',
                  iconImageHref: 'https://yastatic.net/s3/home/static/_/v/1.0.0-rc.1/blocks/icon/icon_pin_default.svg',
                  iconImageSize: [30, 30],
                  iconImageOffset: [-15, -15]
                }
              );

              mapInstanceRef.current.geoObjects.add(markerRef.current);

              // Handle marker drag
              markerRef.current.events.add('dragend', () => {
                const coords = markerRef.current.geometry.getCoordinates();
                onChange({ lat: coords[0], lng: coords[1] });
              });

              // Handle map click
              mapInstanceRef.current.events.add('click', (e: any) => {
                const coords = e.get('coords');
                markerRef.current.geometry.setCoordinates(coords);
                onChange({ lat: coords[0], lng: coords[1] });
              });
            }
          });
        }
      };

      script.onerror = () => {
        console.warn('Failed to load Yandex Maps API. Please check your API key.');
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full bg-gray-100 rounded-lg">
              <div class="text-center p-4">
                <MapPin class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p class="text-sm text-gray-500 font-medium">Map unavailable</p>
                <p class="text-xs text-gray-400 mt-1">Please configure Yandex Maps API key</p>
                <p class="text-xs text-gray-400 mt-1">Current coordinates: ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}</p>
              </div>
            </div>
          `;
        }
      };

      document.head.appendChild(script);

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy();
        }
        document.head.removeChild(script);
      };
    }
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setCenter([position.lat, position.lng]);
      markerRef.current.geometry.setCoordinates([position.lat, position.lng]);
    }
  }, [position]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-64 rounded-lg border border-gray-200"
      style={{ minHeight: '256px' }}
    />
  );
}

export default function BusinessProfilePage() {
  const token = useBusinessToken();
  const isHydrated = useBusinessIsHydrated();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [mainLocation, setMainLocation] = useState<Position>({
    lat: 41.2995,
    lng: 69.2401,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<BusinessProfileForm>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      description: "",
    },
  });

  // Fetch business data on mount
  useEffect(() => {
    console.log('Business profile check:', { token, hasToken: !!token, isHydrated });
    if (isHydrated) {
      if (token) {
        fetchBusinessData();
      } else {
        setError("Authentication required. Please log in.");
        setLoading(false);
      }
    }
  }, [token, isHydrated]);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching business data with token:', !!token);
      const response = await client.get('/api/business/me');
      console.log('Business data response:', response.data);
      
      if (response.data.success && response.data.business) {
        const business = response.data.business;
        
        // Set form values
        setValue('name', business.name || "");
        setValue('email', business.email || "");
        setValue('phoneNumber', business.phoneNumber || "");
        setValue('address', business.address || "");
        setValue('description', business.description || "");

        if (business.avatar) {
          setAvatarPreview(business.avatar);
        }

        // Set location if coordinates exist [lng, lat] in GeoJSON format
        if (business.location?.coordinates?.length === 2) {
          setMainLocation({
            lng: business.location.coordinates[0],
            lat: business.location.coordinates[1],
          });
        } else {
          console.log('No coordinates found in business data:', business.location);
          // Keep default coordinates (Tashkent)
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load business data");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: BusinessProfileForm) => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Update business info
      const updateData = {
        ...data,
        location: {
          type: "Point",
          coordinates: [mainLocation.lng, mainLocation.lat], // GeoJSON format [lng, lat]
        },
      };

      console.log('Sending update data:', updateData);
      await client.patch('/api/business/me', updateData);

      // Upload avatar if changed
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);

        await client.patch('/api/business/me/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 5000);
      
      // Refresh data after successful update
      await fetchBusinessData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  if (loading || !isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#00B14F] mx-auto mb-4" />
          <p className="text-gray-600">
            {!isHydrated ? "Initializing..." : "Loading business profile..."}
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Authentication required. Please log in to access your business profile.
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-center space-y-2">
              <Link href="/business/signin">
                <Button className="w-full">Go to Business Login</Button>
              </Link>
              <div className="text-xs text-gray-500">
                Debug: Token = {token ? 'Present' : 'Missing'}, Hydrated = {isHydrated ? 'Yes' : 'No'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">
            <Link href="/business/dashboard">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="font-bold text-gray-900 text-lg sm:text-xl">
              Business Profile
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Logo Section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Business Logo</Label>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Business Logo"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Store className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                      <div className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-[#00B14F] hover:bg-[#00B14F]/5 transition-all duration-200 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-[#00B14F]" />
                        <span className="font-medium text-[#00B14F]">Change Logo</span>
                      </div>
                    </label>
                    <p className="text-sm text-gray-500">
                      Recommended: 512x512px, PNG or JPG format
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold">
                    Business Name *
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    className="h-12 text-base"
                    placeholder="Enter your business name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-semibold">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="h-12 text-base"
                    placeholder="business@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-base font-semibold">
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    {...register("phoneNumber")}
                    className="h-12 text-base"
                    placeholder="+998 XX XXX XX XX"
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-base font-semibold">
                    Business Address *
                  </Label>
                  <Input
                    id="address"
                    {...register("address")}
                    className="h-12 text-base"
                    placeholder="Enter your business address"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold">
                  Business Description
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={4}
                  className="text-base resize-none"
                  placeholder="Tell customers about your business..."
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Location Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#00B14F]" />
                  <Label className="text-base font-semibold">
                    Business Location
                  </Label>
                </div>
                <p className="text-sm text-gray-600">
                  Click on the map or drag the marker to set your business location
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Coordinates: {mainLocation.lat.toFixed(6)}, {mainLocation.lng.toFixed(6)}
                  </p>
                  <YandexMap position={mainLocation} onChange={setMainLocation} />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full h-14 bg-[#00B14F] hover:bg-[#009940] text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={saving || !isDirty}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}