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
    description:
      "Get quality food at up to 70% off. Find nearby offers and buy delicious meals at amazing prices.",
  },
  {
    icon: Leaf,
    title: "Help the Planet",
    description:
      "Every purchase helps reduce waste, supports local businesses, and protects our environment.",
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSkip = () => setCurrentStep(onboardingSteps.length - 1)

  const step = onboardingSteps[currentStep]
  const Icon = step.icon

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-white px-6 py-10">
      {/* Skip button */}
      {currentStep < onboardingSteps.length - 1 && (
        <button
          onClick={handleSkip}
          className="absolute right-6 top-6 text-sm font-semibold text-gray-500 hover:text-gray-700"
        >
          Skip
        </button>
      )}

      {/* Icon and text */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-8 flex h-36 w-36 items-center justify-center rounded-full bg-[#00B14F]/10 shadow-sm">
          <Icon className="h-20 w-20 text-[#00B14F]" />
        </div>

        <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
          {step.title}
        </h2>
        <p className="max-w-xs text-base leading-relaxed text-gray-600 sm:max-w-sm">
          {step.description}
        </p>

        {/* Progress dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-8 bg-[#00B14F]"
                  : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="w-full max-w-sm space-y-3">
        {currentStep < onboardingSteps.length - 1 ? (
          <Button
            onClick={handleNext}
            className="h-12 w-full rounded-lg bg-[#00B14F] text-base font-semibold text-white hover:bg-[#009943]"
          >
            Next
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          <>
            <Link href="/signup" className="block">
              <Button className="h-12 w-full rounded-lg bg-[#00B14F] text-base font-semibold text-white hover:bg-[#009943]">
                Create Account
              </Button>
            </Link>
            <Link href="/signin" className="block">
              <Button
                variant="outline"
                className="h-12 w-full rounded-lg border-2 border-[#00B14F] text-base font-semibold text-[#00B14F] hover:bg-[#00B14F]/5"
              >
                Sign In
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
