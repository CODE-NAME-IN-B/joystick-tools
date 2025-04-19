"use client"

import { useState, useEffect } from "react"
import type { GamepadState, CalibrationData } from "@/hooks/useGamepadService"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

interface TriggerPrecisionProps {
  gamepadState: GamepadState
  calibrationData: CalibrationData
}

export function TriggerPrecision({ gamepadState, calibrationData }: TriggerPrecisionProps) {
  const [activeTrigger, setActiveTrigger] = useState("left")
  const [targetValue, setTargetValue] = useState(0.5)
  const [triggerHistory, setTriggerHistory] = useState<number[]>([])
  const historyLimit = 30

  // Get current trigger value
  const currentValue =
    activeTrigger === "left" ? gamepadState.buttons[6]?.value || 0 : gamepadState.buttons[7]?.value || 0

  // Update history when trigger value changes
  useEffect(() => {
    if (gamepadState.connected) {
      setTriggerHistory((prev) => {
        const newHistory = [...prev, currentValue]
        if (newHistory.length > historyLimit) {
          return newHistory.slice(newHistory.length - historyLimit)
        }
        return newHistory
      })
    }
  }, [gamepadState, currentValue])

  // Calculate precision score
  const calculatePrecision = () => {
    if (triggerHistory.length < 5) return null

    // Only consider the last 5 values for stability
    const recentValues = triggerHistory.slice(-5)
    const avgValue = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length

    // Calculate distance from target (0 is perfect)
    const distance = Math.abs(avgValue - targetValue)

    // Convert to a percentage score (100% is perfect)
    const score = Math.max(0, 100 - distance * 200)

    return Math.round(score)
  }

  const precision = calculatePrecision()

  // Get color based on precision
  const getPrecisionColor = () => {
    if (precision === null) return "bg-muted"
    if (precision >= 90) return "bg-green-500"
    if (precision >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Trigger Precision Test</h3>
      </div>

      <Tabs value={activeTrigger} onValueChange={setActiveTrigger} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="left">Left Trigger (LT)</TabsTrigger>
          <TabsTrigger value="right">Right Trigger (RT)</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-4 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Target Value</span>
              <span className="text-sm text-muted-foreground">{Math.round(targetValue * 100)}%</span>
            </div>
            <Slider
              value={[targetValue]}
              min={0.1}
              max={0.9}
              step={0.05}
              onValueChange={(value) => setTargetValue(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Current Value</span>
              <span className="text-sm text-muted-foreground">{Math.round(currentValue * 100)}%</span>
            </div>
            <Progress value={currentValue * 100} className="h-8" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Target</span>
              <span className="text-sm text-muted-foreground">{Math.round(targetValue * 100)}%</span>
            </div>
            <div className="relative h-8 bg-muted rounded-md overflow-hidden">
              <div
                className="absolute top-0 bottom-0 bg-primary/30 border-l-2 border-r-2 border-primary"
                style={{
                  left: `${Math.max(0, (targetValue - 0.05) * 100)}%`,
                  right: `${Math.max(0, 100 - (targetValue + 0.05) * 100)}%`,
                }}
              />
              <div className="absolute top-0 bottom-0 w-0.5 bg-primary" style={{ left: `${targetValue * 100}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Precision Score</span>
              <span className="text-sm text-muted-foreground">
                {precision !== null ? `${precision}%` : "Pull and hold trigger"}
              </span>
            </div>
            <div className="h-8 rounded-md overflow-hidden bg-muted flex items-center justify-center">
              {precision !== null && (
                <div className={`h-full ${getPrecisionColor()}`} style={{ width: `${precision}%` }} />
              )}
              {precision !== null && <span className="absolute text-sm font-medium">{precision}%</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        This test measures how precisely you can hold a trigger at a specific position. Try to hold the trigger at
        exactly the target value for the highest precision score.
      </div>
    </div>
  )
}
