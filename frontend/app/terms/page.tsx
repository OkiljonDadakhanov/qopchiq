"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

export default function TermsPage() {
  const router = useRouter()

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
        <h1 className="text-2xl font-bold">Terms and Conditions</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-4">Last updated: January 2025</p>
          <p className="text-gray-600 leading-relaxed">
            Welcome to Qopchiq. By using our service, you agree to these terms. Please read them carefully.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            By accessing and using Qopchiq, you accept and agree to be bound by the terms and provision of this
            agreement. If you do not agree to these terms, please do not use our service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">2. Use of Service</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Qopchiq provides a platform connecting users with local businesses offering surplus food at discounted
            prices. You agree to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
            <li>Provide accurate information when creating an account</li>
            <li>Pick up reserved packages during the specified time window</li>
            <li>Treat partner businesses and their staff with respect</li>
            <li>Not resell food purchased through Qopchiq</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">3. Orders and Payments</h2>
          <p className="text-gray-600 leading-relaxed">
            All orders are subject to availability. Payment is processed when you reserve a package. Cancellations must
            be made at least 2 hours before pickup time to receive a refund.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">4. Surprise Packages</h2>
          <p className="text-gray-600 leading-relaxed">
            The contents of surprise packages may vary. While we provide general information about package types, the
            exact items are determined by available surplus at partner locations.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">5. Liability</h2>
          <p className="text-gray-600 leading-relaxed">
            Qopchiq acts as a platform connecting users with businesses. We are not responsible for the quality or
            safety of food provided by partner businesses, though all partners must meet food safety standards.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">6. Account Termination</h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent
            activity.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">7. Changes to Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            We may update these terms from time to time. Continued use of Qopchiq after changes constitutes acceptance
            of the new terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">8. Contact</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have questions about these terms, please contact us through the app or email support@qopchiq.uz
          </p>
        </div>
      </div>
    </div>
  )
}
