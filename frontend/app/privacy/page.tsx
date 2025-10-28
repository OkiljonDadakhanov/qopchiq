export const dynamic = 'force-static'

import Link from "next/link";
import { ChevronLeft } from "lucide-react"

export default function PrivacyPage() {


  return (
    <div className="min-h-screen bg-white">
      {/* Status Bar */}
    

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
        <Link href="/" className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Privacy Policy</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-4">Last updated: January 2025</p>
          <p className="text-gray-600 leading-relaxed">
            At Qopchiq, we take your privacy seriously. This policy describes how we collect, use, and protect your
            personal information.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed mb-3">We collect information you provide directly to us:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
            <li>Account information (name, email, phone number)</li>
            <li>Location data to show nearby offers</li>
            <li>Payment information (processed securely by our payment provider)</li>
            <li>Order history and preferences</li>
            <li>Communications with customer support</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">How We Use Your Information</h2>
          <p className="text-gray-600 leading-relaxed mb-3">We use your information to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
            <li>Provide and improve our service</li>
            <li>Process your orders and payments</li>
            <li>Send you notifications about your orders</li>
            <li>Show you relevant offers based on your location</li>
            <li>Communicate with you about our service</li>
            <li>Prevent fraud and ensure security</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Information Sharing</h2>
          <p className="text-gray-600 leading-relaxed">
            We share your information only when necessary to provide our service. This includes sharing order details
            with partner businesses and payment information with our payment processor. We never sell your personal
            information.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Location Data</h2>
          <p className="text-gray-600 leading-relaxed">
            We use your location to show you nearby offers and calculate distances. You can control location permissions
            in your device settings.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Data Security</h2>
          <p className="text-gray-600 leading-relaxed">
            We implement appropriate security measures to protect your information. However, no method of transmission
            over the internet is 100% secure.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Your Rights</h2>
          <p className="text-gray-600 leading-relaxed mb-3">You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of marketing communications</li>
            <li>Export your data</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Cookies and Tracking</h2>
          <p className="text-gray-600 leading-relaxed">
            We use cookies and similar technologies to improve your experience, analyze usage, and provide personalized
            content.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Children's Privacy</h2>
          <p className="text-gray-600 leading-relaxed">
            Qopchiq is not intended for users under 16. We do not knowingly collect information from children.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Changes to This Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this privacy policy from time to time. We will notify you of significant changes through the
            app or by email.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have questions about this privacy policy or your personal information, contact us at
            privacy@qopchiq.uz
          </p>
        </div>
      </div>
    </div>
  )
}
