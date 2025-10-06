import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import MobileOnlyNotice from '@/components/mobile-banner'
import BottomNav from '@/components/bottom-navigation'

export const metadata: Metadata = {
  title: 'qopchiq',
  description: 'save waste, save money',
  generator: 'qopchiq',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <MobileOnlyNotice/>
        {children}
        <Analytics />
        <BottomNav/>
      </body>
    </html>
  )
}
