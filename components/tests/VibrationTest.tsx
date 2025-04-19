"use client"

import { useState } from "react"
import type { GamepadState } from "@/hooks/useGamepadService"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface VibrationTestProps {
  gamepadState: GamepadState
}

export function VibrationTest({ gamepadState }: VibrationTestProps) {
  const [weakMagnitude, setWeakMagnitude] = useState(0.5)
  const [strongMagnitude, setStrongMagnitude] = useState(0.5)
  const [duration, setDuration] = useState(500)
  const [pattern, setPattern] = useState("constant")

  const hasVibration = gamepadState.connected && gamepadState.vibrationActuator

  // Play vibration effect
  const playVibration = () => {
    if (!hasVibration) return

    if (pattern === "constant") {
      gamepadState.vibrationActuator.playEffect("dual-rumble", {
        startDelay: 0,
        duration: duration,
        weakMagnitude: weakMagnitude,
        strongMagnitude: strongMagnitude,
      })
    } else if (pattern === "pulse") {
      // Play a pulsing pattern
      const pulseCount = 3
      const pulseInterval = duration / pulseCount

      for (let i = 0; i < pulseCount; i++) {
        setTimeout(() => {
          gamepadState.vibrationActuator.playEffect("dual-rumble", {
            startDelay: 0,
            duration: pulseInterval * 0.5,
            weakMagnitude: weakMagnitude,
            strongMagnitude: strongMagnitude,
          })
        }, i * pulseInterval)
      }
    } else if (pattern === "ramp") {
      // Play a ramping pattern
      const steps = 10
      const stepDuration = duration / steps

      for (let i = 0; i < steps; i++) {
        const intensity = i / (steps - 1)
        setTimeout(() => {
          gamepadState.vibrationActuator.playEffect("dual-rumble", {
            startDelay: 0,
            duration: stepDuration,
            weakMagnitude: weakMagnitude * intensity,
            strongMagnitude: strongMagnitude * intensity,
          })
        }, i * stepDuration)
      }
    }
  }

  // Stop vibration
  const stopVibration = () => {
    if (hasVibration) {
      gamepadState.vibrationActuator.playEffect("dual-rumble", {
        startDelay: 0,
        duration: 0,
        weakMagnitude: 0,
        strongMagnitude: 0,
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Vibration Test</h3>
      </div>

      {!hasVibration && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-lg font-medium text-red-500">Vibration not supported</div>
            <p className="text-sm text-muted-foreground mt-2">
              Your controller does not support vibration or is not connected.
            </p>
          </CardContent>
        </Card>
      )}

      {hasVibration && (
        <Card>
          <CardContent className="p-4 space-y-6">
            <Tabs value={pattern} onValueChange={setPattern} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="constant">Constant</TabsTrigger>
                <TabsTrigger value="pulse">Pulse</TabsTrigger>
                <TabsTrigger value="ramp">Ramp Up</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Weak Rumble</Label>
                  <span className="text-sm text-muted-foreground">{Math.round(weakMagnitude * 100)}%</span>
                </div>
                <Slider
                  value={[weakMagnitude]}
                  min={0}
                  max={1}
                  step={0.05}
                  onValueChange={(value) => setWeakMagnitude(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Strong Rumble</Label>
                  <span className="text-sm text-muted-foreground">{Math.round(strongMagnitude * 100)}%</span>
                </div>
                <Slider
                  value={[strongMagnitude]}
                  min={0}
                  max={1}
                  step={0.05}
                  onValueChange={(value) => setStrongMagnitude(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Duration</Label>
                  <span className="text-sm text-muted-foreground">{duration}ms</span>
                </div>
                <Slider
                  value={[duration]}
                  min={100}
                  max={2000}
                  step={100}
                  onValueChange={(value) => setDuration(value[0])}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={playVibration} className="flex-1">
                Test Vibration
              </Button>
              <Button variant="outline" onClick={stopVibration}>
                Stop
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-sm text-muted-foreground">
        Test your controller's vibration capabilities. Adjust the intensity and duration to find the right feedback for
        your game. The weak rumble uses high-frequency motors, while the strong rumble uses low-frequency motors.
      </div>
    </div>
  )
}
