"use client"

import { useState, useEffect, useRef } from "react"
import type { GamepadState } from "@/hooks/useGamepadService"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ButtonCounterProps {
  gamepadState: GamepadState
}

interface ButtonCount {
  label: string
  count: number
  lastPressed: number | null
}

export function ButtonCounter({ gamepadState }: ButtonCounterProps) {
  const [buttonCounts, setButtonCounts] = useState<ButtonCount[]>([])
  const prevButtonStates = useRef<boolean[]>([])

  // Button labels
  const buttonLabels = [
    "A",
    "B",
    "X",
    "Y",
    "LB",
    "RB",
    "LT",
    "RT",
    "Back",
    "Start",
    "LS",
    "RS",
    "Up",
    "Down",
    "Left",
    "Right",
    "Guide",
  ]

  // Initialize button counts
  useEffect(() => {
    setButtonCounts(
      buttonLabels.map((label) => ({
        label,
        count: 0,
        lastPressed: null,
      })),
    )
  }, [])

  // Update counts when buttons are pressed
  useEffect(() => {
    if (!gamepadState.connected) return

    const now = Date.now()

    // Check button changes
    gamepadState.buttons.forEach((button, index) => {
      if (index >= buttonLabels.length) return

      const prevPressed = prevButtonStates.current[index] || false

      if (button.pressed && !prevPressed) {
        setButtonCounts((prev) => {
          const newCounts = [...prev]
          if (newCounts[index]) {
            newCounts[index] = {
              ...newCounts[index],
              count: newCounts[index].count + 1,
              lastPressed: now,
            }
          }
          return newCounts
        })
      }
    })

    // Update previous button states
    prevButtonStates.current = gamepadState.buttons.map((b) => b.pressed)
  }, [gamepadState])

  // Get the maximum count for scaling
  const maxCount = Math.max(...buttonCounts.map((b) => b.count), 1)

  // Reset all counters
  const resetCounters = () => {
    setButtonCounts((prev) =>
      prev.map((button) => ({
        ...button,
        count: 0,
        lastPressed: null,
      })),
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Button Press Counter</h3>
        <button className="text-xs text-muted-foreground hover:text-foreground" onClick={resetCounters}>
          Reset
        </button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            {buttonCounts.map((button, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{button.label}</span>
                  <span className="text-muted-foreground">{button.count}</span>
                </div>
                <Progress value={(button.count / maxCount) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
