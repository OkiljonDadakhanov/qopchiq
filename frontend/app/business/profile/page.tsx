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
  Plus,
  Trash2,
  Edit2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock API client - replace with your actual client
const client = {
  get: async (url: string) => {
    // Simulated response
    return {
      data: {
        success: true,
        business: {
          name: "Demo Business",
          email: "demo@business.com",
          phoneNumber: "+998901234567",
          address: "Tashkent, Uzbekistan",
          description: "A great business",
          avatar: null,
          location: {
            type: "Point",
            coordinates: [69.2401, 41.2995]
          },
          branches: []
        }
      }
    };
  },
  patch: async (url: string, data: any) => {
    console.log("Update request:", data);
    return { data: { success: true } };
  },
  post: async (url: string, data: any) => {
    console.log("Create request:", data);
    return { data: { success: true, branch: { ...data, id: Date.now().toString() } } };
  },
  delete: async (url: string) => {
    console.log("Delete request:", url);
    return { data: { success: true } };
  }
};

// Form validation schemas
const businessProfileSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a complete address"),
  description: z.string().optional(),
});

const branchSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters"),
  address: z.string().min(5, "Please enter a complete address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
});

type BusinessProfileForm = z.infer<typeof businessProfileSchema>;
type BranchForm = z.infer<typeof branchSchema>;

interface Position {
  lat: number;
  lng: number;
}

interface Branch {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  location: {
    type: string;
    coordinates: number[];
  };
}

// Yandex Map Component
function YandexMap({ 
  position, 
  onChange 
}: { 
  position: Position; 
  onChange: (pos: Position) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Load Yandex Maps script once
  useEffect(() => {
    if (typeof window === 'undefined' || (window as any).ymaps) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    const apiKey = 'your_yandex_maps_api_key_here';
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=en_US`;
    script.async = true;
    
    script.onload = () => {
      console.log("✅ Yandex Maps script loaded");
      setIsScriptLoaded(true);
    };
    
    script.onerror = () => {
      console.warn('Failed to load Yandex Maps API');
      setIsScriptLoaded(false);
    };
    
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize map only once when script loads
  useEffect(() => {
    if (!isScriptLoaded || !mapRef.current || mapInstanceRef.current) return;

    const initializeMap = async () => {
      try {
        await (window as any).ymaps.ready();
        
        // Create map
        mapInstanceRef.current = new (window as any).ymaps.Map(mapRef.current, {
          center: [position.lat, position.lng],
          zoom: 13,
          controls: ['zoomControl', 'fullscreenControl']
        });

        // Create marker
        markerRef.current = new (window as any).ymaps.Placemark(
          [position.lat, position.lng],
          {},
          {
            draggable: true,
            preset: 'islands#redIcon'
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

        setIsMapReady(true);
        console.log("✅ Map initialized successfully");
      } catch (error) {
        console.error("Failed to initialize map:", error);
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
        markerRef.current = null;
        setIsMapReady(false);
      }
    };
  }, [isScriptLoaded]);

  // Update marker position when position prop changes
  useEffect(() => {
    if (isMapReady && markerRef.current) {
      const currentCoords = markerRef.current.geometry.getCoordinates();
      if (currentCoords[0] !== position.lat || currentCoords[1] !== position.lng) {
        markerRef.current.geometry.setCoordinates([position.lat, position.lng]);
        mapInstanceRef.current.setCenter([position.lat, position.lng]);
      }
    }
  }, [position, isMapReady]);

  if (!isScriptLoaded) {
    return (
      <div className="w-full h-64 rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-64 rounded-lg border border-gray-200"
      style={{ minHeight: '256px' }}
    />
  );
}

// Branch Modal Component
function BranchModal({
  isOpen,
  onClose,
  onSave,
  branch,
  mode
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BranchForm & { location: Position }) => void;
  branch?: Branch;
  mode: 'create' | 'edit';
}) {
  const [location, setLocation] = useState<Position>(
    branch ? {
      lat: branch.location.coordinates[1],
      lng: branch.location.coordinates[0]
    } : {
      lat: 41.2995,
      lng: 69.2401
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<BranchForm>({
    resolver: zodResolver(branchSchema),
    defaultValues: branch || {
      name: "",
      address: "",
      phoneNumber: ""
    }
  });

  useEffect(() => {
    if (isOpen && branch) {
      reset(branch);
      setLocation({
        lat: branch.location.coordinates[1],
        lng: branch.location.coordinates[0]
      });
    } else if (isOpen && !branch) {
      reset({
        name: "",
        address: "",
        phoneNumber: ""
      });
      setLocation({ lat: 41.2995, lng: 69.2401 });
    }
  }, [isOpen, branch, reset]);

  const handleFormSubmit = (data: BranchForm) => {
    onSave({ ...data, location });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{mode === 'create' ? 'Add New Branch' : 'Edit Branch'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="branch-name">Branch Name *</Label>
              <Input
                id="branch-name"
                {...register("name")}
                placeholder="Downtown Branch"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch-address">Address *</Label>
              <Input
                id="branch-address"
                {...register("address")}
                placeholder="123 Main Street"
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch-phone">Phone Number *</Label>
              <Input
                id="branch-phone"
                {...register("phoneNumber")}
                placeholder="+998 XX XXX XX XX"
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Branch Location *</Label>
              <p className="text-sm text-gray-600 mb-2">
                Click on the map or drag the marker to set branch location
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
                <YandexMap position={location} onChange={setLocation} />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#00B14F] hover:bg-[#009940]"
              >
                {mode === 'create' ? 'Add Branch' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Component
export default function BusinessProfilePage() {
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
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
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

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await client.get('/api/business/me');
      
      if (response.data.success && response.data.business) {
        const business = response.data.business;
        
        setValue('name', business.name || "");
        setValue('email', business.email || "");
        setValue('phoneNumber', business.phoneNumber || "");
        setValue('address', business.address || "");
        setValue('description', business.description || "");
        
        if (business.avatar) {
          setAvatarPreview(business.avatar);
        }
        
        if (business.location?.coordinates?.length === 2) {
          setMainLocation({
            lng: business.location.coordinates[0],
            lat: business.location.coordinates[1],
          });
        }

        setBranches(business.branches || []);
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
      const updateData = {
        ...data,
        location: {
          type: "Point",
          coordinates: [mainLocation.lng, mainLocation.lat],
        },
      };
      
      await client.patch('/api/business/me', updateData);
      
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        await client.patch('/api/business/me/avatar', formData);
      }
      
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 5000);
      
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

  const handleAddBranch = () => {
    setEditingBranch(undefined);
    setBranchModalOpen(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setEditingBranch(branch);
    setBranchModalOpen(true);
  };

  const handleSaveBranch = async (data: BranchForm & { location: Position }) => {
    try {
      const branchData = {
        name: data.name,
        address: data.address,
        phoneNumber: data.phoneNumber,
        location: {
          type: "Point",
          coordinates: [data.location.lng, data.location.lat]
        }
      };

      if (editingBranch) {
        await client.patch(`/api/business/branches/${editingBranch.id}`, branchData);
        setSuccessMessage("Branch updated successfully!");
      } else {
        await client.post('/api/business/branches', branchData);
        setSuccessMessage("Branch added successfully!");
      }

      await fetchBusinessData();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save branch");
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (!confirm("Are you sure you want to delete this branch?")) return;

    try {
      await client.delete(`/api/business/branches/${branchId}`);
      setSuccessMessage("Branch deleted successfully!");
      await fetchBusinessData();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete branch");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#00B14F] mx-auto mb-4" />
          <p className="text-gray-600">Loading business profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Business Info */}
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
                      <img
                        src={avatarPreview}
                        alt="Business Logo"
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

              {/* Basic Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Business Name *</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input id="phoneNumber" {...register("phoneNumber")} />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Business Address *</Label>
                  <Input id="address" {...register("address")} />
                  {errors.address && (
                    <p className="text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Main Location */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#00B14F]" />
                  <Label className="text-base font-semibold">
                    Main Business Location
                  </Label>
                </div>
                <p className="text-sm text-gray-600">
                  Click on the map or drag the marker to set your location
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Coordinates: {mainLocation.lat.toFixed(6)}, {mainLocation.lng.toFixed(6)}
                  </p>
                  <YandexMap position={mainLocation} onChange={setMainLocation} />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#00B14F] hover:bg-[#009940]"
                disabled={saving || !isDirty}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Branches Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Branch Locations
            </CardTitle>
            <Button
              onClick={handleAddBranch}
              className="bg-[#00B14F] hover:bg-[#009940]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Branch
            </Button>
          </CardHeader>
          <CardContent>
            {branches.length === 0 ? (
              <div className="text-center py-12">
                <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No branches added yet</p>
                <Button
                  onClick={handleAddBranch}
                  variant="outline"
                  className="border-[#00B14F] text-[#00B14F] hover:bg-[#00B14F]/5"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Branch
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-[#00B14F] transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{branch.name}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {branch.address}
                          </p>
                          <p>📞 {branch.phoneNumber}</p>
                          <p className="text-xs text-gray-500">
                            Coordinates: {branch.location.coordinates[1].toFixed(6)}, {branch.location.coordinates[0].toFixed(6)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBranch(branch)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBranch(branch.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Branch Modal */}
      <BranchModal
        isOpen={branchModalOpen}
        onClose={() => setBranchModalOpen(false)}
        onSave={handleSaveBranch}
        branch={editingBranch}
        mode={editingBranch ? 'edit' : 'create'}
      />
    </div>
  );
}