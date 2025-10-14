"use client";

import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";

export default function MobileOnlyNotice() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null); // null = unknown during SSR

  useEffect(() => {
    // Detect on mount only (prevents flicker)
    const checkWidth = () => setIsMobile(window.innerWidth < 768);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  if (isMobile !== false) return null;

  return (
    <div className="mobile-warning pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4">
      <div className="pointer-events-auto mt-4 flex w-full max-w-md items-center gap-3 rounded-full bg-emerald-600/95 px-4 py-2 text-sm text-white shadow-lg ring-1 ring-white/40 md:max-w-lg">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
          <Smartphone className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-0">
          <p className="font-semibold leading-tight">Mobile-sized experience</p>
          <p className="text-xs leading-tight text-emerald-100">
            You're viewing Qopchiq in its mobile layout. Resize the window or continue using the touch-optimised UI.
          </p>
        </div>
      </div>
    </div>
  );
}
