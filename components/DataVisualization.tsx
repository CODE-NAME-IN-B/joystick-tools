"use client"

import { useState } from "react"
import type { GamepadState, CalibrationData } from "@/hooks/useGamepadService"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { InputLog } from "@/components/data/InputLog"
import { ButtonCounter } from "@/components/data/ButtonCounter"
import { AxisGraph } from "@/components/data/AxisGraph"
import { DeviceInfo } from "@/components/data/DeviceInfo"
import { useLanguage } from "@/contexts/LanguageContext"

interface DataVisualizationProps {
  gamepadState: GamepadState
  calibrationData: CalibrationData
}

export function DataVisualization({ gamepadState, calibrationData }: DataVisualizationProps) {
  const [activeTab, setActiveTab] = useState("input-log")
  const { t, isRTL } = useLanguage()

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-4">{t.dataVisualization.title}</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid grid-cols-4 mb-4 ${isRTL ? "rtl-direction" : ""}`}>
            <TabsTrigger value="input-log" className={isRTL ? "order-0" : ""}>
              {t.dataVisualization.inputLog}
            </TabsTrigger>
            <TabsTrigger value="button-counter" className={isRTL ? "order-1" : ""}>
              {t.dataVisualization.buttonCounter}
            </TabsTrigger>
            <TabsTrigger value="axis-graph" className={isRTL ? "order-2" : ""}>
              {t.dataVisualization.axisGraph}
            </TabsTrigger>
            <TabsTrigger value="device-info" className={isRTL ? "order-3" : ""}>
              {t.dataVisualization.deviceInfo}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input-log" className={isRTL ? "text-right" : ""}>
            <InputLog gamepadState={gamepadState} />
          </TabsContent>

          <TabsContent value="button-counter" className={isRTL ? "text-right" : ""}>
            <ButtonCounter gamepadState={gamepadState} />
          </TabsContent>

          <TabsContent value="axis-graph" className={isRTL ? "text-right" : ""}>
            <AxisGraph gamepadState={gamepadState} calibrationData={calibrationData} />
          </TabsContent>

          <TabsContent value="device-info" className={isRTL ? "text-right" : ""}>
            <DeviceInfo gamepadState={gamepadState} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
