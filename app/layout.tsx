import type React from "react"
import ClientLayout from "./ClientLayout"
import "./globals.css"
import { Inter, Noto_Sans_Arabic } from 'next/font/google'

// Define fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-noto-sans-arabic',
  weight: ['400', '500', '700'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansArabic.variable}`}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

export const metadata = {
  generator: 'v0.dev',
  title: 'Joystick Tools',
  description: 'Advanced tools for testing and calibrating your joysticks and gamepads',
};
