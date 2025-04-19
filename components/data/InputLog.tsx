"use client"

import { useState, useEffect, useRef } from "react"
import type { GamepadState } from "@/hooks/useGamepadService"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/contexts/LanguageContext"
import { useGamepadType } from "@/contexts/GamepadTypeContext"

interface InputLogProps {
  gamepadState: GamepadState
}

interface LogEntry {
  id: string
  timestamp: number
  type: "button" | "axis"
  index: number
  value: number | boolean
  label: string
}

export function InputLog({ gamepadState }: InputLogProps) {
  const { t, direction } = useLanguage()
  const { getButtonName } = useGamepadType()

  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const prevButtonStates = useRef<boolean[]>([])
  const prevAxisValues = useRef<number[]>([])
  const logId = useRef(0)

  // Axis labels
  const axisLabels = ["Left Stick X", "Left Stick Y", "Right Stick X", "Right Stick Y"]

  // Check for input changes
  useEffect(() => {
    if (!gamepadState.connected) return

    const newEntries: LogEntry[] = []

    // Check button changes
    gamepadState.buttons.forEach((button, index) => {
      const prevPressed = prevButtonStates.current[index] || false

      if (button.pressed !== prevPressed) {
        newEntries.push({
          id: `btn-${logId.current++}`,
          timestamp: Date.now(),
          type: "button",
          index,
          value: button.pressed,
          label: getButtonName(index),
        })
      }
    })

    // Update previous button states
    prevButtonStates.current = gamepadState.buttons.map((b) => b.pressed)

    // Check axis change (with threshold to reduce noise)
    const threshold = 0.05
    gamepadState.axes.forEach((value, index) => {
      const prevValue = prevAxisValues.current[index] || 0

      if (Math.abs(value - prevValue) > threshold) {
        newEntries.push({
          id: `axis-${logId.current++}`,
          timestamp: Date.now(),
          type: "axis",
          index,
          value,
          label: axisLabels[index] || `Axis ${index}`,
        })
      }
    })

    // Update previous axis values
    prevAxisValues.current = [...gamepadState.axes]

    // Add new entries to log (limit to last 50)
    if (newEntries.length > 0) {
      setLogEntries((prev) => {
        const combined = [...newEntries, ...prev]
        return combined.slice(0, 50)
      })
    }
  }, [gamepadState, getButtonName])

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}.${date.getMilliseconds().toString().padStart(3, "0")}`
  }

  return (
    <div className="space-y-2">
      <div className={`flex justify-between items-center ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
        <h3 className="text-sm font-medium">{t.dataVisualization.inputLog}</h3>
        <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => setLogEntries([])}>
          {t.dataVisualization.clear}
        </button>
      </div>

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px] w-full">
            {logEntries.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">{t.dataVisualization.noInputEvents}</div>
            ) : (
              <div className="divide-y divide-border">
                {logEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-2 text-sm flex items-center ${direction === "rtl" ? "flex-row-reverse" : ""}`}
                  >
                    <div className="w-32 text-xs text-muted-foreground">{formatTime(entry.timestamp)}</div>
                    <div className="w-24 font-medium">{entry.label}</div>
                    <div className="flex-1">
                      {entry.type === "button" ? (
                        <span className={entry.value ? "text-green-500" : "text-red-500"}>
                          {entry.value ? t.dataVisualization.pressed : t.dataVisualization.released}
                        </span>
                      ) : (
                        <span>{typeof entry.value === "number" ? entry.value.toFixed(2) : entry.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
