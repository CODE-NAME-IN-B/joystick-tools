"use client"

import { useState, useEffect, useRef } from "react"
import type { GamepadState } from "@/hooks/useGamepadService"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/contexts/LanguageContext"
import { useGamepadType } from "@/contexts/GamepadTypeContext"
import Image from "next/image"

interface LatencyTestProps {
  gamepadState: GamepadState
}

export function LatencyTest({ gamepadState }: LatencyTestProps) {
  const { t, direction, currentLanguage } = useLanguage()
  const { controllerType, getButtonName, getButtonImage } = useGamepadType()

  const [testActive, setTestActive] = useState(false)
  const [testButton, setTestButton] = useState<number | null>(null)
  const [results, setResults] = useState<number[]>([])
  const [countdown, setCountdown] = useState(3)
  const [promptTime, setPromptTime] = useState<number | null>(null)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [waitingForRelease, setWaitingForRelease] = useState(false)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const prevButtonStates = useRef<boolean[]>([])

  // Button options appropriate for each controller type
  const buttonOptions = {
    xbox: [0, 1, 2, 3], // A, B, X, Y
    playstation: [0, 1, 2, 3], // ×, ○, □, △
    generic: [0, 1, 2, 3], // Face buttons
  };

  // Initialize and update previous button states when not in a test
  useEffect(() => {
    if (gamepadState.connected && !testActive) {
      prevButtonStates.current = gamepadState.buttons.map((b) => b.pressed)
    }
  }, [gamepadState, testActive])

  // Start test
  const startTest = () => {
    setTestActive(true)
    setResults([])
    setCountdown(3)
    setTestButton(null)
    setPromptTime(null)
    setResponseTime(null)
    setWaitingForRelease(false)
    
    // Make sure all buttons are released before starting the test
    if (gamepadState.connected) {
      prevButtonStates.current = gamepadState.buttons.map(b => b.pressed)
      
      // Check if any buttons are currently pressed
      const anyButtonPressed = gamepadState.buttons.some(b => b.pressed);
      if (anyButtonPressed) {
        alert(currentLanguage === 'en' 
          ? "Please release all buttons before starting the test." 
          : "يرجى تحرير جميع الأزرار قبل بدء الاختبار.");
        setTestActive(false);
        return;
      }
    }

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
    // Choose a random button to test appropriate for the controller type
    const options = buttonOptions[controllerType];
    const buttonIndex = options[Math.floor(Math.random() * options.length)];
    
    setTestButton(buttonIndex)
    setPromptTime(performance.now())
    setWaitingForRelease(false)

    console.log(`Test started for button: ${buttonIndex} (${getButtonName(buttonIndex)})`);

    // Set timeout for maximum response time (3 seconds)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      if (testActive && testButton !== null) {
        console.log("Test timed out");
        // Test timed out, move to next test or end
        handleTestCompletion()
      }
    }, 3000)
  }

  // Check for button press responses
  useEffect(() => {
    if (!testActive || testButton === null || promptTime === null || !gamepadState.connected) return
    
    // Skip checking if we're waiting for the button to be released
    if (waitingForRelease) return;
    
    const currentButtonPressed = gamepadState.buttons[testButton]?.pressed;
    
    if (currentButtonPressed) {
      const now = performance.now()
      const latency = now - promptTime
      console.log(`Button ${testButton} pressed. Latency: ${latency}ms`);
      
      setResponseTime(latency)
      setResults((prev) => [...prev, latency])
      setWaitingForRelease(true)

      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      // Schedule next test after button is released
      const checkReleaseInterval = setInterval(() => {
        if (gamepadState.connected && !gamepadState.buttons[testButton].pressed) {
          clearInterval(checkReleaseInterval);
          setTimeout(handleTestCompletion, 1000);
        }
      }, 100);
    }
  }, [gamepadState, testActive, testButton, promptTime, waitingForRelease, getButtonName])

  // Handle completion of a test iteration
  const handleTestCompletion = () => {
    setTestButton(null)
    setWaitingForRelease(false)

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

  // Function to render the button prompt based on controller type
  const renderButtonPrompt = () => {
    if (testButton === null) return null;
    
    const buttonName = getButtonName(testButton);
    
    // Attempt to use an image if available, otherwise use text
    try {
      return (
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="text-6xl font-bold mr-2">{buttonName}</div>
            <div className="relative w-16 h-16">
              <Image 
                src={`/images/buttons/${controllerType}/${buttonName.toLowerCase()}.png`}
                alt={buttonName}
                width={64}
                height={64}
                style={{ objectFit: "contain" }}
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{t.latencyTest.pressButton}</div>
        </div>
      );
    } catch (e) {
      // Fallback to just the button name
      return (
        <div className="text-center">
          <div className="text-6xl font-bold mb-4">{buttonName}</div>
          <div className="text-sm text-muted-foreground">{t.latencyTest.pressButton}</div>
        </div>
      );
    }
  };

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
              renderButtonPrompt()
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
              <Card key={index} className={responseTime === result ? "border-primary" : ""}>
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
