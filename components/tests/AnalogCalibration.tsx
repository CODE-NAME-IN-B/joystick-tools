"use client"

import { useState, useEffect, useRef } from "react"
import type { GamepadState, CalibrationData } from "@/hooks/useGamepadService"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface AnalogCalibrationProps {
  gamepadState: GamepadState
  calibrationData: CalibrationData
  setCalibrationData: (data: CalibrationData) => void
}

export function AnalogCalibration({ gamepadState, calibrationData, setCalibrationData }: AnalogCalibrationProps) {
  const [activeStick, setActiveStick] = useState("left")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Draw the analog stick visualization
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

    // Draw outer circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = "#888"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw deadzone circle
    const deadZoneValue =
      activeStick === "left" ? calibrationData.deadZones.leftStick : calibrationData.deadZones.rightStick

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * deadZoneValue, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(200, 200, 200, 0.2)"
    ctx.fill()

    // Draw crosshairs
    ctx.beginPath()
    ctx.moveTo(centerX - radius, centerY)
    ctx.lineTo(centerX + radius, centerY)
    ctx.moveTo(centerX, centerY - radius)
    ctx.lineTo(centerX, centerY + radius)
    ctx.strokeStyle = "#888"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw stick position
    if (gamepadState.connected) {
      let x, y

      if (activeStick === "left") {
        x = gamepadState.axes[0]
        y = gamepadState.axes[1]
      } else {
        x = gamepadState.axes[2]
        y = gamepadState.axes[3]
      }

      // Apply inversion if needed
      if (activeStick === "left") {
        if (calibrationData.invert.leftStickX) x = -x
        if (calibrationData.invert.leftStickY) y = -y
      } else {
        if (calibrationData.invert.rightStickX) x = -x
        if (calibrationData.invert.rightStickY) y = -y
      }

      // Apply sensitivity
      const sensitivity =
        activeStick === "left" ? calibrationData.sensitivity.leftStick : calibrationData.sensitivity.rightStick

      x = x * sensitivity
      y = y * sensitivity

      // Clamp values to -1 to 1
      x = Math.max(-1, Math.min(1, x))
      y = Math.max(-1, Math.min(1, y))

      // Draw stick position
      const stickX = centerX + x * radius
      const stickY = centerY + y * radius

      ctx.beginPath()
      ctx.arc(stickX, stickY, 10, 0, Math.PI * 2)
      ctx.fillStyle = "#3b82f6"
      ctx.fill()
      ctx.strokeStyle = "#1d4ed8"
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }, [gamepadState, calibrationData, activeStick])

  // Update deadzone
  const updateDeadZone = (value: number[]) => {
    setCalibrationData({
      ...calibrationData,
      deadZones: {
        ...calibrationData.deadZones,
        [activeStick === "left" ? "leftStick" : "rightStick"]: value[0],
      },
    })
  }

  // Update sensitivity
  const updateSensitivity = (value: number[]) => {
    setCalibrationData({
      ...calibrationData,
      sensitivity: {
        ...calibrationData.sensitivity,
        [activeStick === "left" ? "leftStick" : "rightStick"]: value[0],
      },
    })
  }

  // Toggle inversion
  const toggleInvert = (axis: "X" | "Y") => {
    setCalibrationData({
      ...calibrationData,
      invert: {
        ...calibrationData.invert,
        [`${activeStick}Stick${axis}`]:
          !calibrationData.invert[`${activeStick}Stick${axis}` as keyof typeof calibrationData.invert],
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Analog Stick Calibration</h3>
      </div>

      <Tabs value={activeStick} onValueChange={setActiveStick} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="left">Left Stick</TabsTrigger>
          <TabsTrigger value="right">Right Stick</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex justify-center">
            <canvas ref={canvasRef} width={200} height={200} className="border border-border rounded-md bg-card" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Dead Zone</Label>
                <span className="text-sm text-muted-foreground">
                  {(activeStick === "left"
                    ? calibrationData.deadZones.leftStick
                    : calibrationData.deadZones.rightStick
                  ).toFixed(2)}
                </span>
              </div>
              <Slider
                value={[
                  activeStick === "left" ? calibrationData.deadZones.leftStick : calibrationData.deadZones.rightStick,
                ]}
                min={0}
                max={0.5}
                step={0.01}
                onValueChange={updateDeadZone}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Sensitivity</Label>
                <span className="text-sm text-muted-foreground">
                  {(activeStick === "left"
                    ? calibrationData.sensitivity.leftStick
                    : calibrationData.sensitivity.rightStick
                  ).toFixed(2)}
                </span>
              </div>
              <Slider
                value={[
                  activeStick === "left"
                    ? calibrationData.sensitivity.leftStick
                    : calibrationData.sensitivity.rightStick,
                ]}
                min={0.5}
                max={2}
                step={0.05}
                onValueChange={updateSensitivity}
              />
            </div>

            <div className="space-y-2">
              <Label>Invert Axes</Label>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={
                      activeStick === "left" ? calibrationData.invert.leftStickX : calibrationData.invert.rightStickX
                    }
                    onCheckedChange={() => toggleInvert("X")}
                  />
                  <Label>Invert X-Axis</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={
                      activeStick === "left" ? calibrationData.invert.leftStickY : calibrationData.invert.rightStickY
                    }
                    onCheckedChange={() => toggleInvert("Y")}
                  />
                  <Label>Invert Y-Axis</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-muted-foreground">
        Move the analog stick to see its position. Adjust the dead zone to eliminate drift when the stick is at rest.
        Increase sensitivity for more responsive control or decrease it for more precision.
      </div>
    </div>
  )
}
