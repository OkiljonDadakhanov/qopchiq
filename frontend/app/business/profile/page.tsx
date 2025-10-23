"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Upload, Plus, Trash2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCustomToast } from "@/components/custom-toast"
import { useBusinessProfile } from "@/hooks/business-auth"
import { useBusinessStore } from "@/store/business-store"
import {
  updateBusinessProfile,
  uploadBusinessLogo,
  createBranch,
  deleteBranch,
} from "@/api/services/business-profile"
import type { BusinessBranch } from "@/types/business"

export default function BusinessProfilePage() {
  const toast = useCustomToast()
  const queryClient = useQueryClient()
  const setBusiness = useBusinessStore((state) => state.setBusiness)
  const token = useBusinessStore((state) => state.token)
  const { data, isLoading } = useBusinessProfile()
  const business = data?.business

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    description: "",
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [branchForm, setBranchForm] = useState({
    name: "",
    address: "",
    phoneNumber: "",
  })
  const [branches, setBranches] = useState<BusinessBranch[]>([])

  useEffect(() => {
    if (!business) return
    setProfileForm({
      name: business.name ?? "",
      email: business.email ?? "",
      phoneNumber: business.phoneNumber ?? "",
      address: business.address ?? "",
      description: business.description ?? "",
    })
    setAvatarPreview(business.avatar?.url ?? null)
    setBranches(business.branches ?? [])
  }, [business])

  const profileMutation = useMutation({
    mutationFn: updateBusinessProfile,
    onSuccess: (updatedBusiness) => {
      setBusiness({ business: updatedBusiness })
      queryClient.setQueryData(["business-profile", token], {
        success: true,
        business: updatedBusiness,
      })
      toast.success("Profile updated", "Your business profile has been saved")
    },
    onError: (error: any) => {
      toast.error("Update failed", error?.message ?? "Please try again")
    },
  })

  const logoMutation = useMutation({
    mutationFn: uploadBusinessLogo,
    onSuccess: (updatedBusiness) => {
      setBusiness({ business: updatedBusiness })
      setAvatarPreview(updatedBusiness.avatar?.url ?? null)
      queryClient.setQueryData(["business-profile", token], {
        success: true,
        business: updatedBusiness,
      })
      toast.success("Logo updated", "Your business logo has been uploaded")
    },
    onError: (error: any) => {
      toast.error("Upload failed", error?.message ?? "Please try again")
    },
  })

  const branchMutation = useMutation({
    mutationFn: createBranch,
    onSuccess: (updatedBusiness) => {
      setBusiness({ business: updatedBusiness })
      setBranches(updatedBusiness.branches ?? [])
      setBranchForm({ name: "", address: "", phoneNumber: "" })
      queryClient.setQueryData(["business-profile", token], {
        success: true,
        business: updatedBusiness,
      })
      toast.success("Branch added", "A new branch has been added")
    },
    onError: (error: any) => {
      toast.error("Unable to add branch", error?.message ?? "Please try again")
    },
  })

  const deleteBranchMutation = useMutation({
    mutationFn: deleteBranch,
    onSuccess: (updatedBusiness) => {
      setBusiness({ business: updatedBusiness })
      setBranches(updatedBusiness.branches ?? [])
      queryClient.setQueryData(["business-profile", token], {
        success: true,
        business: updatedBusiness,
      })
      toast.success("Branch removed", "The branch has been deleted")
    },
    onError: (error: any) => {
      toast.error("Unable to remove branch", error?.message ?? "Please try again")
    },
  })

  const handleProfileSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    profileMutation.mutate(profileForm)
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    logoMutation.mutate(file)
  }

  const handleBranchSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!branchForm.name.trim() || !branchForm.address.trim() || !branchForm.phoneNumber.trim()) {
      toast.error("Missing information", "Please fill in all branch details")
      return
    }
    branchMutation.mutate(branchForm)
  }

  if (isLoading || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-sm flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading business profile…
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Link href="/business/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Business profile</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative w-32 h-32 rounded-full bg-gray-100 overflow-hidden">
              {avatarPreview ? (
                <Image src={avatarPreview} alt={business.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">
                  {business.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="logo-upload" className="block text-sm font-medium text-gray-700">
                Business logo
              </Label>
              <div className="mt-2 flex items-center gap-3">
                <Button asChild variant="outline" className="flex items-center gap-2">
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Upload logo
                  </label>
                </Button>
                {logoMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin text-gray-500" /> : null}
              </div>
              <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              <p className="text-xs text-gray-500 mt-2">Upload a square image in JPG or PNG format (max 5MB).</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Business name</Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone number</Label>
                <Input
                  id="phoneNumber"
                  value={profileForm.phoneNumber}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={profileForm.description}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" className="bg-[#00B14F] hover:bg-[#009940]" disabled={profileMutation.isPending}>
                  {profileMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {profileMutation.isPending ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleBranchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch-name">Branch name</Label>
                <Input
                  id="branch-name"
                  value={branchForm.name}
                  onChange={(e) => setBranchForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Downtown"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch-address">Address</Label>
                <Input
                  id="branch-address"
                  value={branchForm.address}
                  onChange={(e) => setBranchForm((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main Street"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch-phone">Phone number</Label>
                <Input
                  id="branch-phone"
                  value={branchForm.phoneNumber}
                  onChange={(e) => setBranchForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="+998 90 123 45 67"
                  required
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <Button type="submit" className="flex items-center gap-2" disabled={branchMutation.isPending}>
                  {branchMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add branch
                </Button>
              </div>
            </form>

            <div className="space-y-3">
              {branches.length === 0 ? (
                <p className="text-sm text-gray-500">No branches added yet.</p>
              ) : (
                branches.map((branch) => (
                  <div key={branch.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border rounded-xl p-4">
                    <div>
                      <p className="font-semibold text-gray-900">{branch.name}</p>
                      <p className="text-sm text-gray-600">{branch.address}</p>
                      <p className="text-sm text-gray-500">{branch.phoneNumber}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => deleteBranchMutation.mutate(branch.id)}
                      disabled={deleteBranchMutation.isPending}
                    >
                      {deleteBranchMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
