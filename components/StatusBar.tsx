"use client"

import { useState } from "react"
import type { GamepadState } from "@/hooks/useGamepadService"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Gamepad, GamepadIcon as GamepadOff, Info, ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useGamepadType } from "@/contexts/GamepadTypeContext"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface StatusBarProps {
  gamepadState: GamepadState
  theme: string
  toggleTheme: () => void
}

export function StatusBar({ gamepadState, theme, toggleTheme }: StatusBarProps) {
  const { t, direction, currentLanguage } = useLanguage()
  const { controllerType, controllerTypeLabel, controllerAuthenticity, authenticityLabel } = useGamepadType()
  const [dialogOpen, setDialogOpen] = useState(false)

  // Get authenticity icon
  const getAuthenticityIcon = () => {
    switch (controllerAuthenticity) {
      case "original":
        return <ShieldCheck className="h-4 w-4 text-green-500" />;
      case "counterfeit":
        return <ShieldAlert className="h-4 w-4 text-red-500" />;
      default:
        return <ShieldQuestion className="h-4 w-4 text-yellow-500" />;
    }
  };

  // Get authenticity badge
  const getAuthenticityBadge = () => {
    switch (controllerAuthenticity) {
      case "original":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-300">
            {currentLanguage === 'en' ? 'Original' : 'أصلية'}
          </Badge>
        );
      case "counterfeit":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-300">
            {currentLanguage === 'en' ? 'Counterfeit' : 'مقلدة'}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-300">
            {currentLanguage === 'en' ? 'Unknown' : 'غير معروفة'}
          </Badge>
        );
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 bg-card rounded-lg shadow-sm ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
      <div className={`flex items-center ${direction === "rtl" ? "space-x-reverse space-x-2" : "space-x-2"}`}>
        {gamepadState.connected ? (
          <>
            <Gamepad className="h-5 w-5 text-green-500" />
            <span className="font-medium">{t.general.connected}</span>
          </>
        ) : (
          <>
            <GamepadOff className="h-5 w-5 text-red-500" />
            <span className="text-sm text-muted-foreground">{t.general.noGamepad}</span>
          </>
        )}
      </div>

      <div className={`flex items-center ${direction === "rtl" ? "space-x-reverse space-x-2" : "space-x-2"}`}>
        {gamepadState.connected && (
          <>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <span>{controllerTypeLabel}</span>
                  {getAuthenticityIcon()}
                  <Info className="h-4 w-4 ml-1" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{currentLanguage === 'en' ? 'Gamepad Information' : 'معلومات وحدة التحكم'}</DialogTitle>
                  <DialogDescription>
                    {currentLanguage === 'en' 
                      ? 'Details about your connected controller'
                      : 'تفاصيل حول وحدة التحكم المتصلة'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">
                        {currentLanguage === 'en' ? 'Controller Type' : 'نوع وحدة التحكم'}
                      </h3>
                      <p className="text-sm">{controllerTypeLabel}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">
                        {currentLanguage === 'en' ? 'Authenticity' : 'الأصالة'}
                      </h3>
                      <div className="flex items-center gap-2">
                        {getAuthenticityBadge()}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">
                      {currentLanguage === 'en' ? 'Device ID' : 'معرف الجهاز'}
                    </h3>
                    <p className="text-sm text-muted-foreground break-all">{gamepadState.id}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">
                        {currentLanguage === 'en' ? 'Mapping' : 'نوع التعيين'}
                      </h3>
                      <p className="text-sm">{gamepadState.mapping || 'unknown'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">
                        {currentLanguage === 'en' ? 'Index' : 'الفهرس'}
                      </h3>
                      <p className="text-sm">{gamepadState.index}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">
                      {currentLanguage === 'en' ? 'Features' : 'الميزات'}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant={gamepadState.vibrationActuator ? "default" : "outline"}>
                        {currentLanguage === 'en' ? 'Vibration' : 'الاهتزاز'}
                      </Badge>
                      <Badge variant={gamepadState.buttons.length >= 16 ? "default" : "outline"}>
                        {currentLanguage === 'en' ? 'Standard Buttons' : 'أزرار قياسية'}
                      </Badge>
                      <Badge variant={gamepadState.axes.length >= 4 ? "default" : "outline"}>
                        {currentLanguage === 'en' ? 'Analog Sticks' : 'عصا تناظرية'}
                      </Badge>
                    </div>
                  </div>
          </div>
              </DialogContent>
            </Dialog>
          </>
        )}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  )
}
