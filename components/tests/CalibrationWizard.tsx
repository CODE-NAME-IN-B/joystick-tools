"use client"

import { useState, useEffect, useRef } from "react"
import type { GamepadState, CalibrationData } from "@/hooks/useGamepadService"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface CalibrationWizardProps {
  gamepadState: GamepadState
  calibrationData: CalibrationData
  setCalibrationData: (data: CalibrationData) => void
}

export function CalibrationWizard({ gamepadState, calibrationData, setCalibrationData }: CalibrationWizardProps) {
  const [step, setStep] = useState(0)
  const [collecting, setCollecting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [leftStickSamples, setLeftStickSamples] = useState<[number, number][]>([])
  const [rightStickSamples, setRightStickSamples] = useState<[number, number][]>([])
  const [triggerSamples, setTriggerSamples] = useState<[number, number][]>([])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Steps in the calibration wizard
  const steps = [
    {
      title: "Introduction",
      description: "This wizard will help you calibrate your controller for optimal performance.",
    },
    { title: "Left Stick", description: "Move the left stick in a full circle, reaching the edges of its range." },
    { title: "Right Stick", description: "Move the right stick in a full circle, reaching the edges of its range." },
    { title: "Triggers", description: "Press and release both triggers several times, fully pressing them each time." },
    {
      title: "Complete",
      description: "Calibration complete! Your controller is now optimized for better performance.",
    },
  ]

  // Start collecting samples for the current step
  const startCollecting = () => {
    setCollecting(true)
    setProgress(0)

    // Reset samples for the current step
    if (step === 1) setLeftStickSamples([])
    if (step === 2) setRightStickSamples([])
    if (step === 3) setTriggerSamples([])

    // Set a timer to automatically complete after 5 seconds
    timerRef.current = setTimeout(() => {
      finishCollecting()
    }, 5000)
  }

  // Update progress during collection
  useEffect(() => {
    if (collecting) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 2
          if (newProgress >= 100) {
            clearInterval(interval)
            return 100
          }
          return newProgress
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [collecting])

  // Collect samples during the collection phase
  useEffect(() => {
    if (!collecting || !gamepadState.connected) return

    const interval = setInterval(() => {
      if (step === 1) {
        // Collect left stick samples
        setLeftStickSamples((prev) => [...prev, [gamepadState.axes[0], gamepadState.axes[1]]])
      } else if (step === 2) {
        // Collect right stick samples
        setRightStickSamples((prev) => [...prev, [gamepadState.axes[2], gamepadState.axes[3]]])
      } else if (step === 3) {
        // Collect trigger samples
        setTriggerSamples((prev) => [...prev, [gamepadState.buttons[6].value, gamepadState.buttons[7].value]])
      }
    }, 100)

    return () => clearInterval(interval)
  }, [collecting, step, gamepadState])

  // Finish collecting samples and calculate calibration
  const finishCollecting = () => {
    setCollecting(false)
    setProgress(100)

    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    // Calculate new calibration values based on samples
    if (step === 1 && leftStickSamples.length > 0) {
      // Calculate left stick dead zone
      const leftStickMagnitudes = leftStickSamples.map(([x, y]) => Math.sqrt(x * x + y * y))
      const minMagnitude = Math.min(...leftStickMagnitudes.filter((m) => m > 0))
      const newLeftDeadZone = Math.max(0.05, Math.min(0.3, minMagnitude * 0.8))

      setCalibrationData((prev) => ({
        ...prev,
        deadZones: {
          ...prev.deadZones,
          leftStick: newLeftDeadZone,
        },
      }))
    } else if (step === 2 && rightStickSamples.length > 0) {
      // Calculate right stick dead zone
      const rightStickMagnitudes = rightStickSamples.map(([x, y]) => Math.sqrt(x * x + y * y))
      const minMagnitude = Math.min(...rightStickMagnitudes.filter((m) => m > 0))
      const newRightDeadZone = Math.max(0.05, Math.min(0.3, minMagnitude * 0.8))

      setCalibrationData((prev) => ({
        ...prev,
        deadZones: {
          ...prev.deadZones,
          rightStick: newRightDeadZone,
        },
      }))
    } else if (step === 3 && triggerSamples.length > 0) {
      // Calculate trigger dead zone
      const allTriggerValues = triggerSamples.flat()
      const minValue = Math.min(...allTriggerValues.filter((v) => v > 0))
      const newTriggerDeadZone = Math.max(0.05, Math.min(0.2, minValue * 0.8))

      setCalibrationData((prev) => ({
        ...prev,
        deadZones: {
          ...prev.deadZones,
          triggers: newTriggerDeadZone,
        },
      }))
    }
  }

  // Draw the visualization for the current step
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

    if (step === 1 || step === 2) {
      // Draw stick visualization

      // Draw outer circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = "#888"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw crosshairs
      ctx.beginPath()
      ctx.moveTo(centerX - radius, centerY)
      ctx.lineTo(centerX + radius, centerY)
      ctx.moveTo(centerX, centerY - radius)
      ctx.lineTo(centerX, centerY + radius)
      ctx.strokeStyle = "#888"
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw samples
      const samples = step === 1 ? leftStickSamples : rightStickSamples

      if (samples.length > 0) {
        ctx.beginPath()
        samples.forEach(([x, y], index) => {
          const pointX = centerX + x * radius
          const pointY = centerY + y * radius

          if (index === 0) {
            ctx.moveTo(pointX, pointY)
          } else {
            ctx.lineTo(pointX, pointY)
          }
        })
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Draw current position
      if (gamepadState.connected) {
        let x, y

        if (step === 1) {
          x = gamepadState.axes[0]
          y = gamepadState.axes[1]
        } else {
          x = gamepadState.axes[2]
          y = gamepadState.axes[3]
        }

        const stickX = centerX + x * radius
        const stickY = centerY + y * radius

        ctx.beginPath()
        ctx.arc(stickX, stickY, 8, 0, Math.PI * 2)
        ctx.fillStyle = "#3b82f6"
        ctx.fill()
      }
    } else if (step === 3) {
      // Draw trigger visualization

      const barWidth = width / 3
      const barHeight = height * 0.6
      const leftX = width / 4 - barWidth / 2
      const rightX = (width * 3) / 4 - barWidth / 2
      const barY = height / 2 - barHeight / 2

      // Draw left trigger bar
      ctx.fillStyle = "#f0f0f0"
      ctx.fillRect(leftX, barY, barWidth, barHeight)

      // Draw right trigger bar
      ctx.fillStyle = "#f0f0f0"
      ctx.fillRect(rightX, barY, barWidth, barHeight)

      if (gamepadState.connected) {
        const leftValue = gamepadState.buttons[6].value
        const rightValue = gamepadState.buttons[7].value

        // Fill left trigger bar
        ctx.fillStyle = "#3b82f6"
        ctx.fillRect(leftX, barY + barHeight * (1 - leftValue), barWidth, barHeight * leftValue)

        // Fill right trigger bar
        ctx.fillStyle = "#3b82f6"
        ctx.fillRect(rightX, barY + barHeight * (1 - rightValue), barWidth, barHeight * rightValue)

        // Draw labels
        ctx.fillStyle = "#000"
        ctx.font = "14px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("LT", leftX + barWidth / 2, barY + barHeight + 20)
        ctx.fillText("RT", rightX + barWidth / 2, barY + barHeight + 20)
        ctx.fillText(`${Math.round(leftValue * 100)}%`, leftX + barWidth / 2, barY - 10)
        ctx.fillText(`${Math.round(rightValue * 100)}%`, rightX + barWidth / 2, barY - 10)
      }
    }
  }, [step, gamepadState, leftStickSamples, rightStickSamples, triggerSamples])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  // Go to next step
  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  // Go to previous step
  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Calibration Wizard</h3>
        <div className="text-sm text-muted-foreground">
          Step {step + 1} of {steps.length}
        </div>
      </div>

      <Progress value={(step / (steps.length - 1)) * 100} className="h-2" />

      <Card>
        <CardContent className="p-6">
          <h4 className="text-xl font-medium mb-2">{steps[step].title}</h4>
          <p className="text-muted-foreground mb-4">{steps[step].description}</p>

          {step > 0 && step < 4 && (
            <div className="mb-6">
              <canvas
                ref={canvasRef}
                width={300}
                height={200}
                className="border border-border rounded-md bg-card mx-auto"
              />

              {collecting && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Collecting data...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={step === 0}>
              Previous
            </Button>

            {step > 0 && step < 4 && !collecting && (
              <Button onClick={startCollecting} disabled={!gamepadState.connected}>
                {progress === 0 ? "Start Collecting" : "Collect Again"}
              </Button>
            )}

            <Button onClick={nextStep} disabled={(step > 0 && step < 4 && progress < 100) || step === steps.length - 1}>
              {step === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {!gamepadState.connected && (
        <div className="text-center text-red-500 text-sm">
          Please connect a controller to use the calibration wizard.
        </div>
      )}
    </div>
  )
}
