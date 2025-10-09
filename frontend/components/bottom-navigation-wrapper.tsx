"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./bottom-navigation";

export default function BottomNavWrapper() {
  const pathname = usePathname();

  // ❌ Hide BottomNav on the main landing page "/"
  if (pathname === "/") return null;
  if (pathname === "/onboarding") return null;
  if (pathname === "/signup") return null;
  if (pathname === "/signin") return null;
  if (pathname === "/forgot-password") return null;
  if (pathname == "/terms") return null;
  if (pathname == "/faq") return null;
  if (pathname == "/privacy") return null;
  if (pathname == "/business/signin") return null;
  if (pathname == "/business/listings") return null;
  if (pathname == "/business/signup") return null;
  if (pathname == "/business/orders") return null;
  if (pathname == "/business/dashboard") return null;
  if (pathname == "/business/listings/new") return null;
  if (pathname == "/business/profile") return null;
  if (pathname == "/verify") return null;
  if (pathname == "/check-email") return null;
  if (pathname == "/profile") return null;
  if (pathname == "/profile/edit") return null;


  // ✅ Show on all other routes
  return <BottomNav />;
}
