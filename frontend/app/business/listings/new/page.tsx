"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function NewListingPage() {
  const router = useRouter()
  const [images, setImages] = useState<File[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    quantity: "",
    pickupStart: "",
    pickupEnd: "",
    category: "",
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/business/listings")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">
            <Link href="/business/listings">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="font-bold text-gray-900">Add new listing</h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm space-y-6">
          {/* Images */}
          <div>
            <Label>Product images</Label>
            <div className="mt-2 grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={URL.createObjectURL(image) || "/placeholder.svg"}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500">Upload</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div>
            <Label htmlFor="name">Listing name</Label>
            <Input
              id="name"
              placeholder="e.g., Surprise breakfast bag"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what's included..."
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select category</option>
              <option value="meals">Meals</option>
              <option value="bakery">Bakery</option>
              <option value="groceries">Groceries</option>
              <option value="flowers">Flowers</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Sale price (UZS)</Label>
              <Input
                id="price"
                type="number"
                placeholder="15000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="originalPrice">Original price (UZS)</Label>
              <Input
                id="originalPrice"
                type="number"
                placeholder="45000"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <Label htmlFor="quantity">Available quantity</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="5"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>

          {/* Pickup Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pickupStart">Pickup start time</Label>
              <Input
                id="pickupStart"
                type="time"
                value={formData.pickupStart}
                onChange={(e) => setFormData({ ...formData, pickupStart: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="pickupEnd">Pickup end time</Label>
              <Input
                id="pickupEnd"
                type="time"
                value={formData.pickupEnd}
                onChange={(e) => setFormData({ ...formData, pickupEnd: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1 bg-[#00B14F] hover:bg-[#009940]">
              Create listing
            </Button>
            <Link href="/business/listings" className="flex-1">
              <Button type="button" variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
