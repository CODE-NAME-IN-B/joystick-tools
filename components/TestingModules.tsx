"use client"

import { useState } from "react"
import type { GamepadState, CalibrationData, GamepadProfile } from "@/hooks/useGamepadService"
import { Card, CardContent } from "@/components/ui/card"
import { LatencyTest } from "@/components/tests/LatencyTest"
import { AnalogCalibration } from "@/components/tests/AnalogCalibration"
import { TriggerPrecision } from "@/components/tests/TriggerPrecision"
import { VibrationTest } from "@/components/tests/VibrationTest"
import { CalibrationWizard } from "@/components/tests/CalibrationWizard"
import { AutoCalibration } from "@/components/tests/AutoCalibration"
import { GamepadProfileManager } from "@/components/GamepadProfileManager"
import { GamepadAuthenticityVerifier } from "@/components/GamepadAuthenticityVerifier"
import { useLanguage } from "@/contexts/LanguageContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TestingModulesProps {
  gamepadState: GamepadState
  calibrationData: CalibrationData
  setCalibrationData: (data: CalibrationData) => void
  profiles: GamepadProfile[]
  activeProfileId: string | null
  saveProfile: (name: string) => string | null
  loadProfile: (profileId: string) => boolean
  updateProfile: (profileId: string) => boolean
  deleteProfile: (profileId: string) => void
}

export function TestingModules({ 
  gamepadState, 
  calibrationData, 
  setCalibrationData,
  profiles,
  activeProfileId,
  saveProfile,
  loadProfile,
  updateProfile,
  deleteProfile
}: TestingModulesProps) {
  const [activeModule, setActiveModule] = useState<string>("latency")
  const { t, direction, currentLanguage } = useLanguage()

  return (
    <Card>
      <CardContent className="p-4">
        <Tabs defaultValue="testing" className="mb-4">
          <TabsList className="w-full">
            <TabsTrigger value="testing" className="flex-1">
              {currentLanguage === 'en' ? 'Testing Modules' : 'وحدات الاختبار'}
            </TabsTrigger>
            <TabsTrigger value="profiles" className="flex-1">
              {currentLanguage === 'en' ? 'Profiles' : 'الملفات الشخصية'}
            </TabsTrigger>
            <TabsTrigger value="authenticity" className="flex-1">
              {currentLanguage === 'en' ? 'Authenticity' : 'الأصالة'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="testing" className="mt-4">
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
              <button
                onClick={() => setActiveModule("auto-calibration")}
                className={`px-4 py-2 rounded-md mx-2 whitespace-nowrap ${
                  activeModule === "auto-calibration" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                {currentLanguage === 'en' ? 'Auto Calibration' : 'المعايرة التلقائية'}
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
                  {activeModule === "auto-calibration" && (
                    <AutoCalibration
                      gamepadState={gamepadState}
                      calibrationData={calibrationData}
                      setCalibrationData={setCalibrationData}
                    />
                  )}
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="profiles" className="mt-4">
            <GamepadProfileManager 
              gamepadConnected={gamepadState.connected}
              profiles={profiles}
              activeProfileId={activeProfileId}
              saveProfile={saveProfile}
              loadProfile={loadProfile}
              updateProfile={updateProfile}
              deleteProfile={deleteProfile}
            />
          </TabsContent>
          
          <TabsContent value="authenticity" className="mt-4">
            <GamepadAuthenticityVerifier gamepadState={gamepadState} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
