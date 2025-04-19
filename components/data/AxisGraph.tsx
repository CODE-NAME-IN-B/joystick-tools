"\"use client"

import { useState, useEffect, useRef } from "react"
import type { GamepadState, CalibrationData } from "@/hooks/useGamepadService"
import { Card, CardContent } from "@/components/ui/card"

interface AxisGraphProps {
  gamepadState: GamepadState
  calibrationData: CalibrationData
}

export function AxisGraph({ gamepadState, calibrationData }: AxisGraphProps) {
  const [axisValues, setAxisValues] = useState([0, 0, 0, 0])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (gamepadState.connected) {
      setAxisValues([...gamepadState.axes])
    }
  }, [gamepadState])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 3

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.strokeStyle = "#888"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw axis values
    const barWidth = width / 5

    axisValues.forEach((value, index) => {
      const barHeight = value * radius + centerY
      const x = barWidth * (index + 0.5)

      ctx.fillStyle = "#3b82f6"
      ctx.fillRect(x - barWidth / 4, centerY, barWidth / 2, -(barHeight - centerY))

      ctx.fillStyle = "#000"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`Axis ${index}`, x, height - 10)
    })
  }, [axisValues])

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Axis Value Graph</h3>
      <Card>
        <CardContent className="p-4">
          <canvas ref={canvasRef} width={400} height={200} className="border border-border rounded-md bg-card" />
        </CardContent>
      </Card>
    </div>
  )
}
