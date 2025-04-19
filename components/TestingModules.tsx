"use client"

import { useState, useEffect } from "react"
import type { GamepadState, CalibrationData } from "@/hooks/useGamepadService"
import { Card, CardContent } from "@/components/ui/card"
import { LatencyTest } from "@/components/tests/LatencyTest"
import { AnalogCalibration } from "@/components/tests/AnalogCalibration"
import { TriggerPrecision } from "@/components/tests/TriggerPrecision"
import { VibrationTest } from "@/components/tests/VibrationTest"
import { CalibrationWizard } from "@/components/tests/CalibrationWizard"
import { useLanguage } from "@/contexts/LanguageContext"

interface TestingModulesProps {
  gamepadState: GamepadState
  calibrationData: CalibrationData
  setCalibrationData: (data: CalibrationData) => void
}

export function TestingModules({ gamepadState, calibrationData, setCalibrationData }: TestingModulesProps) {
  const [activeModule, setActiveModule] = useState<string>("latency")
  const { t, direction } = useLanguage()

  // Save calibration data to localStorage when it changes
  useEffect(() => {
    if (gamepadState.connected) {
      localStorage.setItem(`gamepad-calibration-${gamepadState.id}`, JSON.stringify(calibrationData))
    }
  }, [calibrationData, gamepadState])

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-4">{t.testing.title}</h2>

        <div className={`flex mb-4 overflow-x-auto pb-2 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
          <button
            onClick={() => setActiveModule("latency")}
            className={`px-4 py-2 rounded-md mx-2 whitespace-nowrap ${
              activeModule === "latency" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            {t.testing.latency}
          </button>
          <button
            onClick={() => setActiveModule("analog")}
            className={`px-4 py-2 rounded-md mx-2 whitespace-nowrap ${
              activeModule === "analog" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            {t.testing.analog}
          </button>
          <button
            onClick={() => setActiveModule("trigger")}
            className={`px-4 py-2 rounded-md mx-2 whitespace-nowrap ${
              activeModule === "trigger" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            {t.testing.triggers}
          </button>
          <button
            onClick={() => setActiveModule("vibration")}
            className={`px-4 py-2 rounded-md mx-2 whitespace-nowrap ${
              activeModule === "vibration" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            {t.testing.vibration}
          </button>
          <button
            onClick={() => setActiveModule("calibration")}
            className={`px-4 py-2 rounded-md mx-2 whitespace-nowrap ${
              activeModule === "calibration" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            {t.testing.wizard}
          </button>
        </div>

        <div className="rounded-md p-4 bg-muted/50">
          {!gamepadState.connected ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">{t.testing.connectGamepad}</p>
            </div>
          ) : (
            <>
              {activeModule === "latency" && <LatencyTest gamepadState={gamepadState} />}
              {activeModule === "analog" && (
                <AnalogCalibration
                  gamepadState={gamepadState}
                  calibrationData={calibrationData}
                  setCalibrationData={setCalibrationData}
                />
              )}
              {activeModule === "trigger" && (
                <TriggerPrecision gamepadState={gamepadState} calibrationData={calibrationData} />
              )}
              {activeModule === "vibration" && <VibrationTest gamepadState={gamepadState} />}
              {activeModule === "calibration" && (
                <CalibrationWizard
                  gamepadState={gamepadState}
                  calibrationData={calibrationData}
                  setCalibrationData={setCalibrationData}
                />
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
