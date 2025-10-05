"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const faqs = [
  {
    question: "What is Qopchiq?",
    answer:
      "Qopchiq is a food waste reduction app that connects you with local restaurants, cafes, and stores selling surplus food at discounted prices. Help save the planet while saving money!",
  },
  {
    question: "How does it work?",
    answer:
      "Browse available food packages near you, reserve what you want, pay through the app, and pick it up during the specified time window. It's that simple!",
  },
  {
    question: "What's in a surprise package?",
    answer:
      "Surprise packages contain surplus food that would otherwise go to waste. The exact contents vary, but you'll always get great value - typically worth 2-3x what you pay!",
  },
  {
    question: "Can I choose what's in my package?",
    answer:
      "Most packages are surprises, but you can see the type of food (bakery, meals, groceries, etc.) and any dietary information before purchasing.",
  },
  {
    question: "What if I can't pick up my order?",
    answer:
      "Please cancel at least 2 hours before your pickup time to avoid charges. Last-minute cancellations may result in fees to support our partner businesses.",
  },
  {
    question: "How do I pay?",
    answer:
      "We accept all major credit and debit cards through our secure payment system. Payment is processed when you reserve your package.",
  },
  {
    question: "Is the food safe to eat?",
    answer:
      "All food meets safety standards and is perfectly good to eat. It's simply surplus that businesses can't sell at full price.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Refunds are available if you cancel before the cancellation deadline or if there's an issue with your order. Contact support for assistance.",
  },
]

export default function FAQPage() {
  const router = useRouter()
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Status Bar */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-gray-100">
        <span className="text-sm font-medium">9:19</span>
      </div>

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">FAQ</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <p className="text-gray-600 mb-6">Find answers to commonly asked questions about Qopchiq.</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Collapsible key={index} open={openItems.includes(index)} onOpenChange={() => toggleItem(index)}>
              <CollapsibleTrigger className="w-full flex items-center justify-between py-4 border-b border-gray-100">
                <span className="text-base font-semibold text-left">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    openItems.includes(index) ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3 pb-4">
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  )
}
