"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { detectControllerType, type ControllerType, getButtonLabel } from "@/lib/gamepad/controller-types"
import type { GamepadState } from "@/hooks/useGamepadService"

type GamepadTypeContextType = {
  controllerType: ControllerType
  getButtonName: (buttonIndex: number) => string
}

const GamepadTypeContext = createContext<GamepadTypeContextType | undefined>(undefined)

export function GamepadTypeProvider({
  children,
  gamepadState,
}: {
  children: ReactNode
  gamepadState: GamepadState
}) {
  const [controllerType, setControllerType] = useState<ControllerType>("generic")

  // Detect controller type when gamepad changes
  useEffect(() => {
    if (gamepadState.connected) {
      const detectedType = detectControllerType(gamepadState.id)
      setControllerType(detectedType)
    } else {
      setControllerType("generic")
    }
  }, [gamepadState.connected, gamepadState.id])

  // Function to get button name based on current controller type
  const getButtonName = (buttonIndex: number): string => {
    return getButtonLabel(buttonIndex, controllerType)
  }

  return <GamepadTypeContext.Provider value={{ controllerType, getButtonName }}>{children}</GamepadTypeContext.Provider>
}

export function useGamepadType() {
  const context = useContext(GamepadTypeContext)
  if (context === undefined) {
    throw new Error("useGamepadType must be used within a GamepadTypeProvider")
  }
  return context
}
