"use client"

import type { GamepadState } from "@/hooks/useGamepadService"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Gamepad, GamepadIcon as GamepadOff } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useGamepadType } from "@/contexts/GamepadTypeContext"

interface StatusBarProps {
  gamepadState: GamepadState
  theme: string
  toggleTheme: () => void
}

export function StatusBar({ gamepadState, theme, toggleTheme }: StatusBarProps) {
  const { t } = useLanguage()
  const { controllerType } = useGamepadType()

  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm">
      <div className="flex items-center space-x-2">
        {gamepadState.connected ? (
          <>
            <Gamepad className="h-5 w-5 text-green-500" />
            <span className="font-medium">{t.general.connected}: </span>
            <span className="text-sm text-muted-foreground">{gamepadState.id}</span>
          </>
        ) : (
          <>
            <GamepadOff className="h-5 w-5 text-red-500" />
            <span className="text-sm text-muted-foreground">{t.general.noGamepad}</span>
          </>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {gamepadState.connected && (
          <div className="px-2 py-1 bg-muted rounded text-sm mr-2">
            <span className="font-medium">{t.gamepadType.detected} </span>
            <span className="text-muted-foreground">
              {controllerType === "xbox"
                ? t.gamepadType.xbox
                : controllerType === "playstation"
                  ? t.gamepadType.playstation
                  : t.gamepadType.generic}
            </span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  )
}
