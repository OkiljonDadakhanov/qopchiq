// components/MobileOnlyNotice.tsx
"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function MobileOnlyNotice() {
    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState(true);

    // list of routes that are mobile-only
    const mobileOnlyRoutes = ["/feed", "/profile",
        "/restaurant", "/profile-setup", "/settings/location", 
        "/settings/marketing", "/settings/notifications", 
        "/onboarding", 
        "/signin", "/signup", "/licences", "/ad-address", "/filter", 
        "/forgot-password",
        "/orders"]; // add others

    const shouldShow = mobileOnlyRoutes.some((r) => pathname.startsWith(r));

    useEffect(() => {
        const checkWidth = () => setIsMobile(window.innerWidth < 768);
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    // if not on a mobile-only route, do nothing
    if (!shouldShow) return null;
    // if user is already on mobile, do nothing
    if (isMobile) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 text-white text-center px-4">
            <h1 className="text-2xl font-semibold mb-2">Mobile View Only 📱</h1>
            <p className="text-gray-300 max-w-md">
                Qopchiq is designed for mobile screens.
                Please reduce your browser width or open it on your phone.
            </p>
        </div>
    );
}
