"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/LanguageContext"
import { Github, Twitter, Mail, ExternalLink } from "lucide-react"

export function AboutTab() {
  const { t, direction, currentLanguage } = useLanguage()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{currentLanguage === 'en' ? 'About Joystick Tools' : 'حول أدوات عصا التحكم'}</CardTitle>
          <CardDescription>
            {currentLanguage === 'en' 
              ? 'An advanced gamepad testing and calibration utility'
              : 'أداة متقدمة لاختبار ومعايرة وحدات التحكم'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">
              {currentLanguage === 'en' ? 'Features' : 'الميزات'}
            </h3>
            <ul className={`list-disc ${direction === 'rtl' ? 'mr-5' : 'ml-5'} space-y-1`}>
              <li>
                {currentLanguage === 'en' 
                  ? 'Interactive gamepad visualization'
                  : 'تصور تفاعلي لوحدة التحكم'}
              </li>
              <li>
                {currentLanguage === 'en' 
                  ? 'Button response latency testing'
                  : 'اختبار زمن استجابة الأزرار'}
              </li>
              <li>
                {currentLanguage === 'en' 
                  ? 'Analog stick calibration'
                  : 'معايرة عصا التحكم التناظرية'}
              </li>
              <li>
                {currentLanguage === 'en' 
                  ? 'Gamepad authenticity verification'
                  : 'التحقق من أصالة وحدة التحكم'}
              </li>
              <li>
                {currentLanguage === 'en' 
                  ? 'Multi-language support (English & Arabic)'
                  : 'دعم متعدد اللغات (الإنجليزية والعربية)'}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">
              {currentLanguage === 'en' ? 'Developer' : 'المطور'}
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <img 
                src="https://github.com/CODE-NAME-IN-B.png" 
                alt="Profile" 
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="font-medium">CODE-NAME-IN-B</div>
                <div className="text-sm text-muted-foreground">
                  {currentLanguage === 'en' ? 'Web & Mobile Developer' : 'مطور ويب وتطبيقات جوال'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <a 
                href="https://github.com/CODE-NAME-IN-B" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-muted hover:bg-muted/80"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a 
                href="https://lostboi.carrd.co/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-muted hover:bg-muted/80"
              >
                <ExternalLink className="h-4 w-4" />
                Website
              </a>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4 text-sm text-muted-foreground">
            <p>
              {currentLanguage === 'en' 
                ? 'This project is open source and available on GitHub.'
                : 'هذا المشروع مفتوح المصدر ومتاح على GitHub.'}
            </p>
            <p className="mt-1">
              © 2024 Joystick Tools
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 