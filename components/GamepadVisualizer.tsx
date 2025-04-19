"use client"

import { useEffect, useRef } from "react"
import type { GamepadState, CalibrationData } from "@/hooks/useGamepadService"
import { drawXboxController, drawPlaystationController } from "@/utils/drawControllers"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/LanguageContext"
import { useGamepadType } from "@/contexts/GamepadTypeContext"

interface GamepadVisualizerProps {
  gamepadState: GamepadState
  calibrationData: CalibrationData
}

export function GamepadVisualizer({ gamepadState, calibrationData }: GamepadVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { t, isRTL } = useLanguage()
  const { controllerType } = useGamepadType()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply RTL transformation if needed
    if (isRTL) {
      ctx.save() // Save the current state
      ctx.translate(canvas.width, 0) // Move to right edge
      ctx.scale(-1, 1) // Flip horizontally
    }

    // Draw the controller with current state based on detected type
    if (controllerType === "playstation") {
      drawPlaystationController(ctx, gamepadState, calibrationData)
    } else {
      // Default to Xbox controller for Xbox and generic controllers
      drawXboxController(ctx, gamepadState, calibrationData)
    }

    // Restore the context if we applied RTL transformation
    if (isRTL) {
      ctx.restore()
    }
  }, [gamepadState, calibrationData, controllerType, isRTL])

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-4">{t.visualization.title}</h2>
        <div className="flex justify-center">
          <canvas 
            ref={canvasRef} 
            width={600} 
            height={400} 
            className={`border border-border rounded-md bg-card ${isRTL ? 'rtl-canvas' : ''}`} 
          />
        </div>
        {!gamepadState.connected && (
          <div className="mt-4 text-center text-muted-foreground">{t.visualization.noGamepadDetected}</div>
        )}
      </CardContent>
    </Card>
  )
}
