"use client"

import type { GamepadState, CalibrationData } from "@/hooks/useGamepadService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gamepad, BarChart2, RotateCcw, Vibrate, Info } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { AboutTab } from "@/components/AboutTab"

interface ControlPanelProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  gamepadState: GamepadState
  calibrationData: CalibrationData
  setCalibrationData: (data: CalibrationData) => void
}

export function ControlPanel({
  activeTab,
  setActiveTab,
  gamepadState,
  calibrationData,
  setCalibrationData,
}: ControlPanelProps) {
  const { t, direction, isRTL } = useLanguage()

  const resetCalibration = () => {
    setCalibrationData({
      deadZones: {
        leftStick: 0.1,
        rightStick: 0.1,
        triggers: 0.05,
      },
      sensitivity: {
        leftStick: 1.0,
        rightStick: 1.0,
        triggers: 1.0,
      },
      invert: {
        leftStickX: false,
        leftStickY: false,
        rightStickX: false,
        rightStickY: false,
      },
    })
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle>{t.controlPanel.title}</CardTitle>
        <CardDescription>{isRTL ? "تحكم في الإعدادات واختبار وحدة التحكم" : "Control settings and test your gamepad"}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-t">
          <div className={`p-2 flex ${direction === "rtl" ? "flex-row-reverse" : ""} border-b`}>
            <Button
              variant={activeTab === "visualization" ? "default" : "ghost"}
              className={`flex-1 ${isRTL ? "ml-1" : "mr-1"} justify-start`}
              onClick={() => setActiveTab("visualization")}
            >
              <Gamepad className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              {isRTL ? "عرض" : "Visualize"}
            </Button>
            <Button
              variant={activeTab === "testing" ? "default" : "ghost"}
              className="flex-1 justify-start"
              onClick={() => setActiveTab("testing")}
            >
              <BarChart2 className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              {isRTL ? "اختبار" : "Test"}
            </Button>
            <Button
              variant={activeTab === "about" ? "default" : "ghost"}
              className="flex-1 justify-start"
              onClick={() => setActiveTab("about")}
            >
              <Info className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              {isRTL ? "حول" : "About"}
            </Button>
          </div>

          {activeTab === "about" ? (
            <div className="p-4">
              <AboutTab />
            </div>
          ) : (
            <div className="space-y-4 p-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">{t.controlPanel.calibration}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={resetCalibration}>
                    <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <RotateCcw className={`h-3.5 w-3.5 ${isRTL ? 'mr-0 ml-2' : 'ml-0 mr-2'}`} />
                      <span>{t.controlPanel.resetCalibration}</span>
                    </div>
                  </Button>

                  {gamepadState.vibrationActuator && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (gamepadState.vibrationActuator) {
                          gamepadState.vibrationActuator.playEffect("dual-rumble", {
                            startDelay: 0,
                            duration: 200,
                            weakMagnitude: 0.5,
                            strongMagnitude: 0.5,
                          })
                        }
                      }}
                    >
                      <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                        <Vibrate className={`h-3.5 w-3.5 ${isRTL ? 'mr-0 ml-2' : 'ml-0 mr-2'}`} />
                        <span>{t.controlPanel.testVibration}</span>
                      </div>
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">{t.controlPanel.connectionStatus}</h3>
                <div className="text-sm p-2 rounded bg-muted">
                  {gamepadState.connected ? (
                    <div className={`flex flex-col ${isRTL ? 'items-end text-right' : 'items-start text-left'}`}>
                      <span className="text-green-500 font-medium">{t.general.connected}</span>
                      <span className="text-xs text-muted-foreground">{gamepadState.id}</span>
                      <span className="text-xs text-muted-foreground">Index: {gamepadState.index}</span>
                      <span className="text-xs text-muted-foreground">Mapping: {gamepadState.mapping}</span>
                    </div>
                  ) : (
                    <span className="text-red-500">{t.general.noGamepad}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
