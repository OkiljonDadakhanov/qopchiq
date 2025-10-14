"use client";

import { useRouter, usePathname } from "next/navigation";
import { Heart, Package, ShoppingBag, Menu } from "lucide-react";

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab from current path
  const activeTab = (() => {
    if (pathname.startsWith("/feed")) return "feed";
    if (pathname.startsWith("/favourites")) return "favourites";
    if (pathname.startsWith("/orders")) return "orders";
    if (pathname.startsWith("/more")) return "more";
    return "";
  })();

  const navItems = [
    { id: "feed", label: "Pick up", icon: Package, route: "/feed" },
    { id: "favourites", label: "Favourites", icon: Heart, route: "/favourites" },
    { id: "orders", label: "Orders", icon: ShoppingBag, route: "/orders" },
    { id: "more", label: "More", icon: Menu, route: "/more" },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[env(safe-area-inset-bottom,0px)]">
      <div className="pointer-events-auto mx-auto mb-3 w-full max-w-md rounded-t-3xl border border-gray-100 bg-white/95 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => router.push(item.route)}
              className={`flex flex-col items-center gap-1 rounded-2xl px-4 py-1 transition-all ${
                isActive
                  ? "text-[#00B14F]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="w-12 h-1 bg-[#00B14F] rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
      </div>
    </div>
  );
}
