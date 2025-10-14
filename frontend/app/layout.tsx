import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import MobileOnlyNotice from "@/components/mobile-banner";
import BottomNavWrapper from "@/components/bottom-navigation-wrapper";
import { Toaster } from "@/components/ui/toaster";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "qopchiq",
  description: "save waste, save money",
  generator: "qopchiq",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} min-h-screen bg-neutral-100 text-foreground`}
      >
        <MobileOnlyNotice />
        <Providers>
          <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-white shadow-none md:my-6 md:max-w-lg md:rounded-3xl md:border md:border-gray-200 md:shadow-2xl">
            <main className="flex-1 overflow-x-hidden pb-24" data-testid="app-shell">
              {children}
            </main>
            <Toaster />
            <Analytics />
            {/* ✅ Wrapper decides when to show the BottomNav */}
            <BottomNavWrapper />
          </div>
        </Providers>
      </body>
    </html>
  );
}
