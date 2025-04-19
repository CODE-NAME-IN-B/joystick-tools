"use client"

import { GamepadVisualizer } from "@/components/GamepadVisualizer"
import { ControlPanel } from "@/components/ControlPanel"
import { StatusBar } from "@/components/StatusBar"
import { TestingModules } from "@/components/TestingModules"
import { DataVisualization } from "@/components/DataVisualization"
import { useGamepadService } from "@/hooks/useGamepadService"
import { useTheme } from "@/hooks/useTheme"
import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { GamepadTypeProvider } from "@/contexts/GamepadTypeContext"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { AboutTab } from "@/components/AboutTab"

export default function Home() {
  const { 
    gamepadState, 
    calibrationData, 
    setCalibrationData,
    profiles,
    activeProfileId,
    saveProfile,
    updateProfile,
    deleteProfile,
    loadProfile
  } = useGamepadService()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("visualization")
  const { t, direction, isRTL } = useLanguage()

  return (
    <GamepadTypeProvider gamepadState={gamepadState}>
      <main className={`min-h-screen p-4 md:p-8 bg-background text-foreground ${isRTL ? "rtl" : "ltr"}`}>
        <div className="container mx-auto space-y-6">
          <div className={`flex ${isRTL ? "flex-row-reverse" : "flex-row"} justify-between items-center`}>
            <StatusBar gamepadState={gamepadState} theme={theme} toggleTheme={toggleTheme} />
            <LanguageSwitcher />
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${isRTL ? "lg:rtl-grid" : ""}`}>
            <div className={`lg:col-span-1 ${isRTL ? "lg:order-last" : ""}`}>
              <ControlPanel
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                gamepadState={gamepadState}
                calibrationData={calibrationData}
                setCalibrationData={setCalibrationData}
              />
            </div>

            <div className={`lg:col-span-2 ${isRTL ? "lg:order-first" : ""}`}>
              {activeTab === "visualization" && (
                <div className="space-y-6">
                  <GamepadVisualizer gamepadState={gamepadState} calibrationData={calibrationData} />
                  <DataVisualization gamepadState={gamepadState} calibrationData={calibrationData} />
                </div>
              )}

              {activeTab === "testing" && (
                <TestingModules
                  gamepadState={gamepadState}
                  calibrationData={calibrationData}
                  setCalibrationData={setCalibrationData}
                  profiles={profiles}
                  activeProfileId={activeProfileId}
                  saveProfile={saveProfile}
                  loadProfile={loadProfile}
                  updateProfile={updateProfile}
                  deleteProfile={deleteProfile}
                />
              )}

              {activeTab === "about" && (
                <div className="space-y-6">
                  <AboutTab />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </GamepadTypeProvider>
  )
}
