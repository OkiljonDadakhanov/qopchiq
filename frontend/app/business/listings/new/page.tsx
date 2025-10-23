"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Upload, X, Loader2, ChevronDown, Search } from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCustomToast } from "@/components/custom-toast"
import { createProduct } from "@/api/services/products"
import { fetchCategories } from "@/api/services/categories"
import type { Category } from "@/types/category"

// Icon mapping for categories
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase()
  if (name.includes('meal') || name.includes('food')) return "🍽️"
  if (name.includes('bakery') || name.includes('bread')) return "🥐"
  if (name.includes('grocery') || name.includes('grocery')) return "🛒"
  if (name.includes('fresh') || name.includes('produce')) return "🥬"
  if (name.includes('dairy') || name.includes('milk')) return "🥛"
  if (name.includes('meat') || name.includes('seafood')) return "🥩"
  if (name.includes('beverage') || name.includes('drink')) return "🥤"
  if (name.includes('snack')) return "🍿"
  if (name.includes('plant') || name.includes('flower')) return "🌸"
  if (name.includes('cosmetic') || name.includes('beauty')) return "💄"
  if (name.includes('health') || name.includes('wellness')) return "💊"
  if (name.includes('household')) return "🏠"
  if (name.includes('book') || name.includes('media')) return "📚"
  if (name.includes('clothing') || name.includes('accessories')) return "👕"
  if (name.includes('electronic')) return "📱"
  return "🔘"
}

const quantityUnits = [
  { label: "Pieces", value: "pcs" },
  { label: "Kilograms", value: "kg" },
  { label: "Grams", value: "g" },
  { label: "Liters", value: "l" },
  { label: "Milliliters", value: "ml" },
]

export default function NewListingPage() {
  const router = useRouter()
  const toast = useCustomToast()
  const [images, setImages] = useState<File[]>([])
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")
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

  const { data: categoriesData, isLoading: isCategoriesLoading, error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  const categories = useMemo(() => categoriesData?.categories ?? [], [categoriesData])

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories
    return categories.filter(category => 
      category.name.toLowerCase().includes(categorySearch.toLowerCase())
    )
  }, [categories, categorySearch])

  // Get selected category object
  const selectedCategory = useMemo(() => {
    return categories.find(cat => cat._id === form.category)
  }, [categories, form.category])

  // Handle click outside to close dropdown
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false)
      }
    }

    if (isCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCategoryDropdownOpen])

  const mutation = useMutation({
    mutationFn: async () => {
      const quantityAmount = Number(form.quantity || "0")
      const stockAmount = Number(form.stock || form.quantity || "0")

      if (!form.title || !form.description) {
        throw new Error("Title and description are required")
      }

      if (!quantityAmount || quantityAmount <= 0) {
        throw new Error("Quantity must be greater than zero")
      }

      const product = await createProduct({
        title: form.title,
        description: form.description,
        category: form.category || undefined,
        originalPrice: Number(form.originalPrice || "0"),
        discountPrice: Number(form.discountPrice || "0"),
        quantity: { amount: quantityAmount, unit: form.quantityUnit as any },
        stock: stockAmount,
        pickupStartTime: form.pickupStartTime || undefined,
        pickupEndTime: form.pickupEndTime || undefined,
        images,
      })

      return product
    },
    onSuccess: () => {
      toast.success("Listing created", "Your listing is now live")
      router.push("/business/listings")
    },
    onError: (error: any) => {
      toast.error("Failed to create listing", error?.message ?? "Please try again")
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
            <h1 className="font-bold text-gray-900">Add new listing</h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm space-y-6">
          <div>
            <Label>Product images</Label>
            <div className="mt-2 grid grid-cols-4 gap-4">
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
              {images.length < 10 && (
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
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-left flex items-center justify-between bg-white"
                disabled={isCategoriesLoading}
              >
                <div className="flex items-center gap-2">
                  {selectedCategory ? (
                    <>
                      <span className="text-lg">{getCategoryIcon(selectedCategory.name)}</span>
                      <span>{selectedCategory.name}</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Select category</span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCategoryDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                  <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search categories..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {isCategoriesLoading ? (
                      <div className="p-3 text-center text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                        Loading categories...
                      </div>
                    ) : categoriesError ? (
                      <div className="p-3 text-center text-red-500">
                        Failed to load categories
                      </div>
                    ) : filteredCategories.length === 0 ? (
                      <div className="p-3 text-center text-gray-500">
                        No categories found
                      </div>
                    ) : (
                      filteredCategories.map((category) => (
                        <button
                          key={category._id}
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({ ...prev, category: category._id }))
                            setIsCategoryDropdownOpen(false)
                            setCategorySearch("")
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                        >
                          <span className="text-lg">{getCategoryIcon(category.name)}</span>
                          <span>{category.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
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
              {mutation.isPending ? "Creating..." : "Create listing"}
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
