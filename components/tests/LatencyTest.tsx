"use client"

import { useState, useEffect, useRef } from "react"
import type { GamepadState } from "@/hooks/useGamepadService"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/contexts/LanguageContext"
import { useGamepadType } from "@/contexts/GamepadTypeContext"

interface LatencyTestProps {
  gamepadState: GamepadState
}

export function LatencyTest({ gamepadState }: LatencyTestProps) {
  const { t, direction } = useLanguage()
  const { getButtonName } = useGamepadType()

  const [testActive, setTestActive] = useState(false)
  const [testButton, setTestButton] = useState<number | null>(null)
  const [results, setResults] = useState<number[]>([])
  const [countdown, setCountdown] = useState(3)
  const [promptTime, setPromptTime] = useState<number | null>(null)
  const [responseTime, setResponseTime] = useState<number | null>(null)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const buttonStates = useRef<boolean[]>([])

  // Store current button states for comparison
  useEffect(() => {
    if (gamepadState.connected) {
      buttonStates.current = gamepadState.buttons.map((b) => b.pressed)
    }
  }, [gamepadState])

  // Start test
  const startTest = () => {
    setTestActive(true)
    setResults([])
    setCountdown(3)
    setTestButton(null)
    setPromptTime(null)
    setResponseTime(null)

    // Start countdown
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          runTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Run a single test iteration
  const runTest = () => {
    // Choose a random button to test (A, B, X, Y buttons are indices 0-3)
    const buttonIndex = Math.floor(Math.random() * 4)
    setTestButton(buttonIndex)
    setPromptTime(performance.now())

    // Set timeout for maximum response time (3 seconds)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      if (testActive && testButton !== null) {
        // Test timed out, move to next test or end
        handleTestCompletion()
      }
    }, 3000)
  }

  // Check for button press responses
  useEffect(() => {
    if (!testActive || testButton === null || promptTime === null) return

    // Check if the test button was just pressed
    if (gamepadState.connected && gamepadState.buttons[testButton]?.pressed && !buttonStates.current[testButton]) {
      const now = performance.now()
      const latency = now - promptTime
      setResponseTime(latency)
      setResults((prev) => [...prev, latency])

      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Schedule next test
      setTimeout(handleTestCompletion, 1500)
    }
  }, [gamepadState, testActive, testButton, promptTime])

  // Handle completion of a test iteration
  const handleTestCompletion = () => {
    setTestButton(null)

    // If we've done 5 tests, end the test
    if (results.length >= 4) {
      setTestActive(false)
    } else {
      // Otherwise, run another test after a delay
      setTimeout(runTest, 1000)
    }
  }

  // Calculate average latency
  const averageLatency = results.length > 0 ? results.reduce((sum, val) => sum + val, 0) / results.length : null

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className={`flex justify-between items-center ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
        <h3 className="text-lg font-medium">{t.latencyTest.title}</h3>
        {!testActive && (
          <Button onClick={startTest} disabled={!gamepadState.connected}>
            {t.latencyTest.startTest}
          </Button>
        )}
      </div>

      {testActive && countdown > 0 && (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold">{countdown}</div>
            <div className="text-sm text-muted-foreground mt-2">{t.latencyTest.getReady}</div>
          </CardContent>
        </Card>
      )}

      {testActive && countdown === 0 && (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            {testButton !== null ? (
              <div className="text-center">
                <div className="text-6xl font-bold mb-4">{getButtonName(testButton)}</div>
                <div className="text-sm text-muted-foreground">{t.latencyTest.pressButton}</div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-xl font-medium mb-2">{t.latencyTest.nextButton}</div>
                <Progress value={100} className="w-64" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">{t.latencyTest.results}</h4>
          <div className={`grid grid-cols-5 gap-2 ${direction === "rtl" ? "flex flex-row-reverse" : ""}`}>
            {results.map((result, index) => (
              <Card key={index}>
                <CardContent className="p-3 text-center">
                  <div className="text-xs text-muted-foreground">
                    {t.latencyTest.test} {index + 1}
                  </div>
                  <div className="text-lg font-medium">{Math.round(result)}ms</div>
                </CardContent>
              </Card>
            ))}
            {averageLatency !== null && (
              <Card className="bg-primary/10">
                <CardContent className="p-3 text-center">
                  <div className="text-xs text-muted-foreground">{t.latencyTest.average}</div>
                  <div className="text-lg font-medium">{Math.round(averageLatency)}ms</div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      <div className="text-sm text-muted-foreground">{t.latencyTest.description}</div>
    </div>
  )
}
