"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCustomToast } from "@/components/custom-toast"
import { fetchProduct, updateProduct } from "@/api/services/products"
import client from "@/api/client"

interface Category {
  _id: string
  name: string
}

const quantityUnits = [
  { label: "Pieces", value: "pcs" },
  { label: "Kilograms", value: "kg" },
  { label: "Grams", value: "g" },
  { label: "Liters", value: "l" },
  { label: "Milliliters", value: "ml" },
]

export default function EditListingPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const toast = useCustomToast()
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    originalPrice: "",
    discountPrice: "",
    quantity: "",
    quantityUnit: "pcs",
    stock: "",
    pickupStartTime: "",
    pickupEndTime: "",
  })

  const { data: productData, isLoading } = useQuery({
    queryKey: ["product", params.id],
    queryFn: async () => fetchProduct(params.id),
    enabled: !!params.id,
  })

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await client.get<{ success: boolean; categories: Category[] }>("/api/categories")
      return data.categories ?? []
    },
  })

  useEffect(() => {
    if (!productData) return
    setForm({
      title: productData.title,
      description: productData.description,
      category: productData.category?._id ?? "",
      originalPrice: String(productData.originalPrice ?? ""),
      discountPrice: String(productData.discountPrice ?? ""),
      quantity: String(productData.quantity?.amount ?? ""),
      quantityUnit: productData.quantity?.unit ?? "pcs",
      stock: String(productData.stock ?? productData.quantity?.amount ?? ""),
      pickupStartTime: productData.pickupStartTime ?? "",
      pickupEndTime: productData.pickupEndTime ?? "",
    })
    setExistingImages(productData.images ?? [])
    setImages([])
  }, [productData])

  const categories = useMemo(() => categoriesData ?? [], [categoriesData])

  const mutation = useMutation({
    mutationFn: async () => {
      if (!productData) {
        throw new Error("Product not found")
      }

      const quantityAmount = Number(form.quantity || "0")
      const stockAmount = Number(form.stock || form.quantity || "0")

      if (!form.title || !form.description) {
        throw new Error("Title and description are required")
      }

      if (!quantityAmount || quantityAmount <= 0) {
        throw new Error("Quantity must be greater than zero")
      }

      const payloadImages = [...existingImages, ...images]

      await updateProduct(productData._id, {
        title: form.title,
        description: form.description,
        category: form.category || undefined,
        originalPrice: Number(form.originalPrice || "0"),
        discountPrice: Number(form.discountPrice || "0"),
        quantity: { amount: quantityAmount, unit: form.quantityUnit as any },
        stock: stockAmount,
        pickupStartTime: form.pickupStartTime || undefined,
        pickupEndTime: form.pickupEndTime || undefined,
        images: payloadImages,
        existingImages,
      })
    },
    onSuccess: () => {
      toast.success("Listing updated", "Your changes have been saved")
      router.push("/business/listings")
    },
    onError: (error: any) => {
      toast.error("Failed to update listing", error?.message ?? "Please try again")
    },
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return
    const next = [...images, ...files].slice(0, 10)
    setImages(next)
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index))
  }

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    mutation.mutate()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">
            <Link href="/business/listings">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="font-bold text-gray-900">Edit listing</h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading || !productData ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
            Loading listing…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm space-y-6">
            <div>
              <Label>Product images</Label>
              <div className="mt-2 grid grid-cols-4 gap-4">
                {existingImages.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image src={image} alt={`Image ${index + 1}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {images.map((image, index) => (
                  <div key={`${image.name}-${index}`} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image src={URL.createObjectURL(image)} alt={`Upload ${index + 1}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {existingImages.length + images.length < 10 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500">Upload</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="title">Listing name</Label>
              <Input
                id="title"
                placeholder="e.g., Surprise breakfast bag"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what's included..."
                rows={3}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountPrice">Sale price (UZS)</Label>
                <Input
                  id="discountPrice"
                  type="number"
                  min="0"
                  placeholder="15000"
                  value={form.discountPrice}
                  onChange={(e) => setForm((prev) => ({ ...prev, discountPrice: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="originalPrice">Original price (UZS)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  min="0"
                  placeholder="45000"
                  value={form.originalPrice}
                  onChange={(e) => setForm((prev) => ({ ...prev, originalPrice: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Available quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="5"
                  value={form.quantity}
                  onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="quantityUnit">Unit</Label>
                <select
                  id="quantityUnit"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  value={form.quantityUnit}
                  onChange={(e) => setForm((prev) => ({ ...prev, quantityUnit: e.target.value }))}
                >
                  {quantityUnits.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="stock">Stock left</Label>
              <Input
                id="stock"
                type="number"
                min="1"
                placeholder="5"
                value={form.stock}
                onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickupStartTime">Pickup start time</Label>
                <Input
                  id="pickupStartTime"
                  type="time"
                  value={form.pickupStartTime}
                  onChange={(e) => setForm((prev) => ({ ...prev, pickupStartTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="pickupEndTime">Pickup end time</Label>
                <Input
                  id="pickupEndTime"
                  type="time"
                  value={form.pickupEndTime}
                  onChange={(e) => setForm((prev) => ({ ...prev, pickupEndTime: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1 bg-[#00B14F] hover:bg-[#009940]" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {mutation.isPending ? "Saving..." : "Save changes"}
              </Button>
              <Link href="/business/listings" className="flex-1">
                <Button type="button" variant="outline" className="w-full bg-transparent">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
