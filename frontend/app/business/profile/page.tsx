// "use client";

// import "leaflet/dist/leaflet.css";
// import { useState } from "react";
// import dynamic from "next/dynamic";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   Upload,
//   Store,
//   Plus,
//   Trash2,
// } from "lucide-react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";

// // ✅ Dynamically import Leaflet components (avoids SSR crash)
// const MapContainer = dynamic(
//   () => import("react-leaflet").then((mod) => mod.MapContainer),
//   { ssr: false }
// );
// const TileLayer = dynamic(
//   () => import("react-leaflet").then((mod) => mod.TileLayer),
//   { ssr: false }
// );
// const Marker = dynamic(
//   () => import("react-leaflet").then((mod) => mod.Marker),
//   { ssr: false }
// );
// const useMapEvents = dynamic(
//   () => import("react-leaflet").then((mod) => mod.useMapEvents),
//   { ssr: false }
// ) as unknown as typeof import("react-leaflet").useMapEvents;

// function LocationPicker({
//   position,
//   onChange,
// }: {
//   position: { lat: number; lng: number };
//   onChange: (pos: { lat: number; lng: number }) => void;
// }) {
//   // @ts-ignore — dynamic import workaround
//   const map = useMapEvents({
//     click(e) {
//       onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
//     },
//   });
//   return <Marker position={position} />;
// }

// export default function BusinessProfilePage() {
//   const [formData, setFormData] = useState({
//     businessName: "Green Cafe",
//     email: "contact@greencafe.uz",
//     phone: "+998 90 123 45 67",
//     address: "Amir Temur Street 15, Tashkent",
//     description:
//       "Cozy cafe serving fresh, organic food with a focus on sustainability.",
//     openingHours: "Mon-Sun 8:00-22:00",
//     logo: null as File | null,
//   });

//   const [mainLocation, setMainLocation] = useState({
//     lat: 41.2995,
//     lng: 69.2401,
//   }); // Tashkent default
//   const [branches, setBranches] = useState<
//     { id: number; name: string; position: { lat: number; lng: number } }[]
//   >([]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Business profile saved:", {
//       ...formData,
//       mainLocation,
//       branches,
//     });
//   };

//   const handleAddBranch = () => {
//     setBranches([
//       ...branches,
//       {
//         id: Date.now(),
//         name: `Branch ${branches.length + 1}`,
//         position: mainLocation,
//       },
//     ]);
//   };

//   const handleRemoveBranch = (id: number) => {
//     setBranches(branches.filter((b) => b.id !== id));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center gap-3 h-16">
//             <Link href="/business/dashboard">
//               <Button variant="ghost" size="sm">
//                 <ArrowLeft className="w-5 h-5" />
//               </Button>
//             </Link>
//             <h1 className="font-bold text-gray-900 text-lg sm:text-xl">
//               Business Profile
//             </h1>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white rounded-xl p-6 sm:p-8 shadow-sm space-y-6"
//         >
//           {/* Logo */}
//           <div>
//             <Label>Business Logo</Label>
//             <div className="mt-2 flex items-center gap-4">
//               <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
//                 {formData.logo ? (
//                   <Image
//                     src={URL.createObjectURL(formData.logo)}
//                     alt="Logo"
//                     width={96}
//                     height={96}
//                     className="object-cover w-full h-full"
//                   />
//                 ) : (
//                   <Store className="w-8 h-8 text-gray-400" />
//                 )}
//               </div>
//               <label className="cursor-pointer">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       logo: e.target.files?.[0] || null,
//                     })
//                   }
//                 />
//                 <div className="px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors">
//                   <Upload className="w-5 h-5 inline mr-2" />
//                   Change logo
//                 </div>
//               </label>
//             </div>
//           </div>

//           {/* Basic Info */}
//           <div>
//             <Label htmlFor="businessName">Business Name</Label>
//             <Input
//               id="businessName"
//               value={formData.businessName}
//               onChange={(e) =>
//                 setFormData({ ...formData, businessName: e.target.value })
//               }
//               required
//             />
//           </div>

//           <div>
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               rows={3}
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData({ ...formData, description: e.target.value })
//               }
//             />
//           </div>

//           {/* Contact Info */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 required
//               />
//             </div>
//             <div>
//               <Label htmlFor="phone">Phone</Label>
//               <Input
//                 id="phone"
//                 type="tel"
//                 value={formData.phone}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phone: e.target.value })
//                 }
//                 required
//               />
//             </div>
//           </div>

//           {/* Address */}
//           <div>
//             <Label htmlFor="address">Address</Label>
//             <Input
//               id="address"
//               value={formData.address}
//               onChange={(e) =>
//                 setFormData({ ...formData, address: e.target.value })
//               }
//               required
//             />
//           </div>

//           {/* Opening Hours */}
//           <div>
//             <Label htmlFor="openingHours">Opening Hours</Label>
//             <Input
//               id="openingHours"
//               value={formData.openingHours}
//               onChange={(e) =>
//                 setFormData({ ...formData, openingHours: e.target.value })
//               }
//               required
//             />
//           </div>

//           {/* Main Location */}
//           <div>
//             <Label>Main Location (click on map)</Label>
//             <div className="mt-2 h-64 w-full rounded-lg overflow-hidden">
//               <MapContainer
//                 center={mainLocation}
//                 zoom={13}
//                 style={{ height: "100%", width: "100%" }}
//               >
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                 
//                 />
//                 <LocationPicker
//                   position={mainLocation}
//                   onChange={setMainLocation}
//                 />
//               </MapContainer>
//             </div>
//           </div>

//           {/* Branch Locations */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <Label>Branch Locations</Label>
//               <Button
//                 type="button"
//                 onClick={handleAddBranch}
//                 className="bg-[#00B14F] hover:bg-[#009940]"
//               >
//                 <Plus className="w-4 h-4 mr-2" /> Add Branch
//               </Button>
//             </div>

//             {branches.length === 0 ? (
//               <p className="text-sm text-gray-500">No branches added yet.</p>
//             ) : (
//               <ul className="space-y-3">
//                 {branches.map((branch) => (
//                   <li
//                     key={branch.id}
//                     className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
//                   >
//                     <div>
//                       <p className="font-medium text-gray-800">
//                         {branch.name}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         Lat: {branch.position.lat.toFixed(4)}, Lng:{" "}
//                         {branch.position.lng.toFixed(4)}
//                       </p>
//                     </div>
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => handleRemoveBranch(branch.id)}
//                     >
//                       <Trash2 className="w-4 h-4 text-red-500" />
//                     </Button>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           <Button
//             type="submit"
//             className="w-full bg-[#00B14F] hover:bg-[#009940]"
//           >
//             Save Changes
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }
