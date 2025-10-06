"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function MobileOnlyNotice() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(true);

  // All mobile-only routes
  const mobileOnlyRoutes = [
    "/feed",
    "/profile",
    "/restaurant",
    "/profile-setup",
    "/settings/location",
    "/settings/marketing",
    "/settings/notifications",
    "/onboarding",
    "/signin",
    "/signup",
    "/licences",
    "/ad-address",
    "/filter",
    "/forgot-password",
    "/orders",
  ];

  const shouldShow = mobileOnlyRoutes.some((r) => pathname.startsWith(r));

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 768);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  if (!shouldShow || isMobile) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white text-center px-6">
      {/* Background food emojis / images */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-20 text-6xl">
        <div className="absolute top-6 left-10 animate-bounce">🍕</div>
        <div className="absolute top-20 right-16 animate-pulse">🥗</div>
        <div className="absolute bottom-10 left-12 animate-bounce">🍔</div>
        <div className="absolute bottom-16 right-14 animate-pulse">🍩</div>
      </div>

      {/* Text Section */}
      <div className="relative z-10 mb-6">
        <h1 className="text-3xl font-bold mb-3 drop-shadow-lg">
          Mobile View Only 📱
        </h1>
        <p className="text-gray-100 max-w-md leading-relaxed">
          The <span className="font-semibold">Qopchiq</span> app is crafted for
          mobile experience. <br /> Please open it on your phone or resize your
          browser window below <span className="font-semibold">768px</span>.
        </p>
      </div>

      {/* Screenshot Mockup */}
      <div className="relative z-10 mt-4">
        <div className="rounded-[2.5rem] border-[6px] border-white shadow-2xl overflow-hidden w-[280px] h-[580px] bg-gray-900">
          <Image
            src="/phone.png"
            alt="Qopchiq mobile preview"
            width={280}
            height={580}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </div>

      {/* Subtext */}
      <p className="mt-6 text-sm text-gray-200 relative z-10">
        Experience the best of{" "}
        <span className="font-bold text-yellow-300">food-saving</span> and{" "}
        <span className="font-bold text-yellow-300">discount offers</span> on
        your phone!
      </p>
    </div>
  );
}
