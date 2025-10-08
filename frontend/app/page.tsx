import Link from "next/link";
import { ArrowRight, Leaf, MapPin, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {" "}
            {/* ↑ slightly taller */}
            {/* ✅ Wrap logo + brand link for consistent left padding */}
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Qopchiq"
                width={120}
                height={120}
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                priority
              />
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#how-it-works"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                How it works
              </a>
              <a
                href="#impact"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Our impact
              </a>
              <a
                href="#about"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                About
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/onboarding"
                className="rounded-full bg-[#00B14F] px-5 py-2 text-sm font-semibold text-white hover:bg-[#009940] transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-[#00B14F] text-sm font-medium mb-6">
                <Leaf className="w-4 h-4" />
                Save food. Save money. Save the planet.
              </div>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Rescue surplus food at amazing prices
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with local restaurants and stores to buy delicious
                surplus food at up to 70% off. Fight food waste while enjoying
                great meals.
              </p>
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
              <div className="mt-12 grid grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600 mt-1">Meals saved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">200+</div>
                  <div className="text-sm text-gray-600 mt-1">Partners</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">15K</div>
                  <div className="text-sm text-gray-600 mt-1">Happy users</div>
                </div>
              </div>
            </div>
            <div className="relative flex justify-center items-center">
              {/* Background bubble effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-green-100 to-green-200 rounded-[2.5rem] blur-3xl opacity-40 animate-pulse" />

              <div className="relative bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out">
                <Image
                  src="/phone.png"
                  alt="Qopchiq App Screenshot"
                  width={300}
                  height={300}
                  className="w-3/4 sm:w-2/3 mx-auto rounded-4xl drop-shadow-2xl animate-float"
                />

                {/* Decorative emojis / stickers */}
                <div className="absolute -top-4 -left-4 text-3xl animate-bounce-slow">
                  🍎
                </div>
                <div
                  className="absolute -bottom-6 right-0 text-3xl animate-bounce-slow"
                  style={{ animationDelay: "0.6s" }}
                >
                  🥦
                </div>
                <div
                  className="absolute top-10 -right-6 text-3xl animate-bounce-slow"
                  style={{ animationDelay: "1.2s" }}
                >
                  💚
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Saving food and money is simple with Qopchiq
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-[#00B14F]" />
              </div>
              <div className="text-6xl font-bold text-gray-200 mb-4">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Discover nearby offers
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Browse surplus food from restaurants, cafes, and stores near
                you. All at discounted prices.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8 text-[#00B14F]" />
              </div>
              <div className="text-6xl font-bold text-gray-200 mb-4">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Reserve your meal
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Choose what you want and reserve it through the app. Pay
                securely and get instant confirmation.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-[#00B14F]" />
              </div>
              <div className="text-6xl font-bold text-gray-200 mb-4">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Pick up and enjoy
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Collect your food during the pickup window. Enjoy great food
                while making a positive impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Your impact in numbers
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Every meal you rescue helps reduce food waste and carbon
                emissions. Together, we're building a more sustainable future.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-6 h-6 text-[#00B14F]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Reduce food waste
                    </h3>
                    <p className="text-gray-600">
                      Help prevent perfectly good food from ending up in
                      landfills
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-6 h-6 text-[#00B14F]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Lower carbon footprint
                    </h3>
                    <p className="text-gray-600">
                      Each rescued meal saves CO₂ emissions from food production
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-6 h-6 text-[#00B14F]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Support local businesses
                    </h3>
                    <p className="text-gray-600">
                      Help restaurants and stores reduce waste while earning
                      revenue
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-12 text-center">
              <div className="mb-8">
                <Image
                  src="/logo.png"
                  alt="Impact"
                  width={200}
                  height={200}
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                25 tons
              </div>
              <div className="text-lg text-gray-600 mb-8">
                of CO₂ saved this month
              </div>
              <div className="text-sm text-gray-500">
                Based on typical food waste emissions. Every rescue makes a
                difference.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Customer CTA */}
            <div className="bg-[#00B14F] rounded-3xl p-12 text-center">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
                For customers
              </h2>
              <p className="text-lg text-green-50 mb-8">
                Save money on delicious meals while fighting food waste
              </p>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-[#00B14F] hover:bg-gray-50 transition-colors"
              >
                Get started for free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Business CTA */}
            <div className="bg-gray-900 rounded-3xl p-12 text-center">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
                For businesses
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Reduce waste, earn revenue, and attract new customers
              </p>
              <Link
                href="/business/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00B14F] px-8 py-4 text-base font-semibold text-white hover:bg-[#009940] transition-colors"
              >
                Join as partner
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="about"
        className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              
              <p className="text-sm text-gray-400">
                Fighting food waste, one meal at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a
                    href="#impact"
                    className="hover:text-white transition-colors"
                  >
                    Our impact
                  </a>
                </li>
                <li>
                  <Link
                    href="/feed"
                    className="hover:text-white transition-colors"
                  >
                    Browse offers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
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
        </div>
      </footer>
    </div>
    </div>
  );
}
