'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ProfileSetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    nickname: '',
    dateOfBirth: '',
    email: '',
    phone: '',
  })

  const handleContinue = () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      router.push('/feed')
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
    

      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => step === 1 ? router.back() : setStep(1)} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Fill Your Profile</h1>
      </div>

      {step === 1 ? (
        <div className="flex-1 px-6 py-8">
          {/* Avatar Upload */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gray-200" />
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#00B14F] rounded-full flex items-center justify-center shadow-lg">
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="text-sm text-gray-600 mb-2 block">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="h-14 rounded-xl border-gray-200"
              />
            </div>

            <div>
              <Label htmlFor="nickname" className="text-sm text-gray-600 mb-2 block">Nickname</Label>
              <Input
                id="nickname"
                placeholder="Enter your nickname"
                value={formData.nickname}
                onChange={(e) => handleChange('nickname', e.target.value)}
                className="h-14 rounded-xl border-gray-200"
              />
            </div>

            <div>
              <Label htmlFor="dob" className="text-sm text-gray-600 mb-2 block">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                className="h-14 rounded-xl border-gray-200"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm text-gray-600 mb-2 block">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="h-14 rounded-xl border-gray-200"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm text-gray-600 mb-2 block">Phone</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="+998"
                  className="h-14 rounded-xl border-gray-200 w-24"
                  disabled
                />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="h-14 rounded-xl border-gray-200 flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Map View */}
          <div className="flex-1 relative bg-gray-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#00B14F] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
                <p className="text-sm text-gray-600">Tashkent, Uzbekistan</p>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="p-6 bg-white border-t border-gray-100">
            <h2 className="text-xl font-bold mb-2">Location</h2>
            <p className="text-gray-600 mb-6">Tashkent, Uzbekistan</p>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="p-6 border-t border-gray-100">
        <Button
          onClick={handleContinue}
          className="w-full h-14 bg-[#00B14F] hover:bg-[#009940] text-white rounded-xl text-base font-semibold"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
