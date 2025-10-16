"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ArrowRight, Leaf, MapPin, ShoppingBag, Menu, X } from "lucide-react"

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Qopchiq"
                width={120}
                height={120}
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                priority
              />
            
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900">
                How it works
              </a>
              <a href="#impact" className="text-sm text-gray-600 hover:text-gray-900">
                Our impact
              </a>
              <a href="#about" className="text-sm text-gray-600 hover:text-gray-900">
                About
              </a>
            </nav>

            {/* Desktop Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/signin"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign in
              </Link>
              <Link
                href="/onboarding"
                className="rounded-full bg-[#00B14F] px-5 py-2 text-sm font-semibold text-white hover:bg-[#009940]"
              >
                Get started
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu Drawer */}
          {menuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 py-4 space-y-3">
              <a href="#how-it-works" className="block text-gray-700 px-4 py-2 hover:bg-gray-50">
                How it works
              </a>
              <a href="#impact" className="block text-gray-700 px-4 py-2 hover:bg-gray-50">
                Our impact
              </a>
              <a href="#about" className="block text-gray-700 px-4 py-2 hover:bg-gray-50">
                About
              </a>
              <div className="px-4 pt-2 flex flex-col gap-2">
                <Link
                  href="/signin"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign in
                </Link>
                <Link
                  href="/onboarding"
                  className="rounded-full bg-[#00B14F] px-5 py-2 text-sm font-semibold text-white hover:bg-[#009940] text-center"
                >
                  Get started
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-[#00B14F] text-sm font-medium mb-5 sm:mb-6">
              <Leaf className="w-4 h-4" />
              Save food. Save money. Save the planet.
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-5 leading-tight">
              Rescue surplus food at amazing prices
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with local restaurants and stores to buy delicious surplus
              food at up to 70% off. Fight food waste while enjoying great meals.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00B14F] px-8 py-4 text-base font-semibold text-white hover:bg-[#009940] transition-colors"
              >
                Start saving now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/business/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#00B14F] px-8 py-4 text-base font-semibold text-[#00B14F] hover:bg-green-50 transition-colors"
              >
                Join as business
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 sm:gap-8 text-center sm:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600 mt-1">Meals saved</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">200+</div>
                <div className="text-sm text-gray-600 mt-1">Partners</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">15K</div>
                <div className="text-sm text-gray-600 mt-1">Happy users</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="order-1 lg:order-2 relative flex justify-center items-center">
            <div className="relative inline-block max-w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-green-100 to-green-200 rounded-[2.5rem] blur-3xl opacity-40 scale-110" />
              <div className="relative bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all">
                <Image
                  src="/phone.png"
                  alt="Qopchiq App Screenshot"
                  width={600}
                  height={600}
                  className="w-full max-w-[350px] sm:max-w-[400px] lg:max-w-[500px] mx-auto rounded-3xl drop-shadow-2xl"
                  priority
                />
              </div>
              <div className="absolute -top-4 -left-4 text-2xl sm:text-3xl animate-bounce">🍎</div>
              <div className="absolute -bottom-6 -right-2 sm:right-0 text-2xl sm:text-3xl animate-bounce" style={{ animationDelay: "0.6s" }}>🥦</div>
              <div className="absolute top-8 sm:top-10 -right-4 sm:-right-6 text-2xl sm:text-3xl animate-bounce" style={{ animationDelay: "1.2s" }}>💚</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How it works</h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Saving food and money is simple with Qopchiq
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: "Discover nearby offers", text: "Browse surplus food from restaurants and stores near you." },
              { icon: ShoppingBag, title: "Reserve your meal", text: "Choose and reserve meals easily through the app." },
              { icon: Leaf, title: "Pick up and enjoy", text: "Collect your food and make a positive impact." },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-7 h-7 text-[#00B14F]" />
                </div>
                <div className="text-5xl font-bold text-gray-200 mb-4">{i + 1}</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Your impact in numbers
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              Every meal you rescue helps reduce food waste and carbon emissions.
            </p>
            <div className="space-y-6">
              {["Reduce food waste", "Lower carbon footprint", "Support local businesses"].map((title, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-6 h-6 text-[#00B14F]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                    <p className="text-gray-600">
                      {i === 0
                        ? "Help prevent perfectly good food from ending up in landfills."
                        : i === 1
                        ? "Each rescued meal saves CO₂ emissions from food production."
                        : "Help restaurants and stores reduce waste while earning revenue."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-10 sm:p-12 text-center hover:shadow-lg transition-shadow">
            <Image src="/logo.png" alt="Impact" width={200} height={200} className="w-32 sm:w-48 mx-auto mb-6" />
            <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">25 tons</div>
            <div className="text-lg text-gray-600 mb-8">of CO₂ saved this month</div>
            <p className="text-sm text-gray-500">
              Based on typical food waste emissions. Every rescue makes a difference.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            {
              title: "For customers",
              text: "Save money on delicious meals while fighting food waste",
              href: "/onboarding",
              bg: "bg-[#00B14F]",
              textColor: "text-white",
              btnBg: "bg-white",
              btnText: "text-[#00B14F]",
            },
            {
              title: "For businesses",
              text: "Reduce waste, earn revenue, and attract new customers",
              href: "/business/signup",
              bg: "bg-gray-900",
              textColor: "text-white",
              btnBg: "bg-[#00B14F]",
              btnText: "text-white",
            },
          ].map((cta, i) => (
            <div key={i} className={`${cta.bg} rounded-3xl p-10 sm:p-12 text-center hover:scale-[1.02] transition-transform`}>
              <h2 className={`font-serif text-3xl sm:text-4xl font-bold ${cta.textColor} mb-4`}>
                {cta.title}
              </h2>
              <p className={`text-lg opacity-90 mb-8 ${cta.textColor}`}>{cta.text}</p>
              <Link
                href={cta.href}
                className={`inline-flex items-center justify-center gap-2 rounded-full ${cta.btnBg} px-8 py-4 text-base font-semibold ${cta.btnText} hover:opacity-90 transition-colors`}
              >
                {i === 0 ? "Get started for free" : "Join as partner"}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <p className="text-sm text-gray-400">Fighting food waste, one meal at a time.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
              <li><a href="#impact" className="hover:text-white transition-colors">Our impact</a></li>
              <li><Link href="/feed" className="hover:text-white transition-colors">Browse offers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>support@qopchiq.uz</li>
              <li>Tashkent, Uzbekistan</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          © 2025 Qopchiq. All rights reserved.
        </div>
      </footer>
    </div>
  )
}