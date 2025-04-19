"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type SupportedLanguage, type Translation } from "@/lib/i18n/translations"

type LanguageContextType = {
  language: SupportedLanguage
  currentLanguage: SupportedLanguage
  t: Translation
  setLanguage: (lang: SupportedLanguage) => void
  direction: "ltr" | "rtl"
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SupportedLanguage>("en")
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr")
  const [isRTL, setIsRTL] = useState<boolean>(false)

  // Load saved language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as SupportedLanguage
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Update direction when language changes
  useEffect(() => {
    // Save language preference
    localStorage.setItem("language", language)

    // Update direction
    const newDirection = translations[language].direction
    setDirection(newDirection)
    setIsRTL(newDirection === "rtl")

    // Update document direction
    document.documentElement.dir = newDirection

    // Add language class to document for specific styling
    document.documentElement.lang = language
    document.documentElement.classList.remove("lang-en", "lang-ar")
    document.documentElement.classList.add(`lang-${language}`)

    // Update body class for RTL/LTR specific styling
    if (newDirection === "rtl") {
      document.body.classList.add("rtl-active")
      // Apply RTL-specific font family
      document.body.style.fontFamily = 'var(--font-noto-sans-arabic), Arial, sans-serif'
    } else {
      document.body.classList.remove("rtl-active")
      // Restore default font family
      document.body.style.fontFamily = 'var(--font-inter), ui-sans-serif, system-ui, sans-serif'
    }
  }, [language])

  // Get current translations
  const t = translations[language]

  return <LanguageContext.Provider value={{ language, currentLanguage: language, t, setLanguage, direction, isRTL }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
