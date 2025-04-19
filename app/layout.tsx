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
      <body className={`${inter.variable} ${notoSansArabic.variable} font-sans bg-background`}>
        <ClientLayout>
          {children}
          <footer className="text-center text-sm text-muted-foreground p-4 mt-8 border-t">
            <div className="container mx-auto">
              <p>
                © 2024 Joystick Tools. تم التطوير بواسطة{" "}
                <a 
                  href="https://github.com/CODE-NAME-IN-B" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  CODE-NAME-IN-B
                </a>
              </p>
            </div>
          </footer>
        </ClientLayout>
      </body>
    </html>
  )
}

export const metadata = {
  generator: 'v0.dev',
  title: 'Joystick Tools',
  description: 'Advanced tools for testing and calibrating your joysticks and gamepads',
};
