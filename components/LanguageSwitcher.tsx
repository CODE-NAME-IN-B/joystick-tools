"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import type { SupportedLanguage } from "@/lib/i18n/translations"
import { Languages } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange("en")} className={language === "en" ? "bg-accent" : ""}>
          {t.language.english}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("ar")} className={language === "ar" ? "bg-accent" : ""}>
          {t.language.arabic}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
