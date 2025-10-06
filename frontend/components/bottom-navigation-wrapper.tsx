"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./bottom-navigation";

export default function BottomNavWrapper() {
  const pathname = usePathname();

  // ❌ Hide BottomNav on the main landing page "/"
  if (pathname === "/") return null;

  // ✅ Show on all other routes
  return <BottomNav />;
}
