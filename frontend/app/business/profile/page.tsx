"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, Store } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function BusinessProfilePage() {
  const [formData, setFormData] = useState({
    businessName: "Green Cafe",
    email: "contact@greencafe.uz",
    phone: "+998 90 123 45 67",
    address: "Amir Temur Street 15, Tashkent",
    description: "Cozy cafe serving fresh, organic food with a focus on sustainability.",
    openingHours: "Mon-Sun 8:00-22:00",
    logo: null as File | null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle profile update
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">
            <Link href="/business/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="font-bold text-gray-900">Business profile</h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm space-y-6">
          {/* Logo */}
          <div>
            <Label>Business logo</Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center">
                {formData.logo ? (
                  <Image
                    src={URL.createObjectURL(formData.logo) || "/placeholder.svg"}
                    alt="Logo"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Store className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFormData({ ...formData, logo: e.target.files?.[0] || null })}
                />
                <div className="px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors">
                  <Upload className="w-5 h-5 inline mr-2" />
                  Change logo
                </div>
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div>
            <Label htmlFor="businessName">Business name</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          {/* Hours */}
          <div>
            <Label htmlFor="openingHours">Opening hours</Label>
            <Input
              id="openingHours"
              value={formData.openingHours}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-[#00B14F] hover:bg-[#009940]">
            Save changes
          </Button>
        </form>
      </div>
    </div>
  )
}
