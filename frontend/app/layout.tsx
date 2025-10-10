import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import MobileOnlyNotice from "@/components/mobile-banner";
import BottomNavWrapper from "@/components/bottom-navigation-wrapper";
import { Toaster } from "@/components/ui/toaster"
import Providers from './providers'

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
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} min-h-screen bg-white`}>
        <MobileOnlyNotice />
        <Providers>
          {children}
          <Toaster />
          <Analytics />
          {/* ✅ Wrapper decides when to show the BottomNav */}
          <BottomNavWrapper />
        </Providers>
      </body>
    </html>
  );
}
