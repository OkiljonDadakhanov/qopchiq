"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Leaf, DollarSign, Store } from "lucide-react"
import { Button } from "@/components/ui/button"

const onboardingSteps = [
  {
    icon: Store,
    title: "Reduce Food Waste",
    description:
      "Restaurants and shops offer surplus food near expiration at big discounts instead of throwing it away.",
  },
  {
    icon: DollarSign,
    title: "Save Money",
    description: "Get quality food at up to 70% off. Find nearby offers and buy delicious meals at amazing prices.",
  },
  {
    icon: Leaf,
    title: "Help the Planet",
    description: "Every purchase helps reduce waste, supports local businesses, and protects our environment.",
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSkip = () => {
    setCurrentStep(onboardingSteps.length - 1)
  }

  const step = onboardingSteps[currentStep]
  const Icon = step.icon

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-6 py-3 text-sm">
      
      
      </div>

      {/* Skip Button */}
      {currentStep < onboardingSteps.length - 1 && (
        <div className="px-6 py-4 text-right">
          <button onClick={handleSkip} className="text-sm font-semibold text-gray-500 hover:text-gray-700">
            Skip
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-[#00B14F]/10">
          <Icon className="h-16 w-16 text-[#00B14F]" />
        </div>

        <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">{step.title}</h2>
        <p className="mb-8 text-center text-base leading-relaxed text-gray-600">{step.description}</p>

        {/* Progress Dots */}
        <div className="mb-8 flex gap-2">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentStep ? "w-8 bg-[#00B14F]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-6 pb-8">
        {currentStep < onboardingSteps.length - 1 ? (
          <Button
            onClick={handleNext}
            className="h-12 w-full rounded-lg bg-[#00B14F] font-semibold text-white hover:bg-[#009943]"
          >
            Next
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          <div className="space-y-3">
            <Link href="/signup" className="block">
              <Button className="h-12 w-full rounded-lg bg-[#00B14F] font-semibold text-white hover:bg-[#009943]">
                Create Account
              </Button>
            </Link>
            <Link href="/signin" className="block">
              <Button
                variant="outline"
                className="h-12 w-full rounded-lg border-2 border-[#00B14F] font-semibold text-[#00B14F] hover:bg-[#00B14F]/5 bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
