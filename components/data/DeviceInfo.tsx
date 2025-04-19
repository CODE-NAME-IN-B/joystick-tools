"use client"

import type { GamepadState } from "@/hooks/useGamepadService"
import { Card, CardContent } from "@/components/ui/card"

interface DeviceInfoProps {
  gamepadState: GamepadState
}

export function DeviceInfo({ gamepadState }: DeviceInfoProps) {
  if (!gamepadState.connected) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-lg font-medium text-muted-foreground">No gamepad connected</div>
          <p className="text-sm text-muted-foreground mt-2">Connect a gamepad to view device information</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">Device Information</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Device ID</div>
              <div className="text-sm text-muted-foreground">{gamepadState.id}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Index</div>
              <div className="text-sm text-muted-foreground">{gamepadState.index}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Mapping</div>
              <div className="text-sm text-muted-foreground">{gamepadState.mapping}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Connected</div>
              <div className="text-sm text-muted-foreground">Yes</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Buttons</div>
              <div className="text-sm text-muted-foreground">{gamepadState.buttons.length}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Axes</div>
              <div className="text-sm text-muted-foreground">{gamepadState.axes.length}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Vibration</div>
              <div className="text-sm text-muted-foreground">
                {gamepadState.vibrationActuator ? "Supported" : "Not supported"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">Raw Input Values</h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Buttons</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {gamepadState.buttons.map((button, index) => (
                  <div key={index} className="text-sm p-2 border rounded-md">
                    <div className="font-medium">Button {index}</div>
                    <div className="text-xs text-muted-foreground">Pressed: {button.pressed ? "Yes" : "No"}</div>
                    <div className="text-xs text-muted-foreground">Value: {button.value.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Axes</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {gamepadState.axes.map((value, index) => (
                  <div key={index} className="text-sm p-2 border rounded-md">
                    <div className="font-medium">Axis {index}</div>
                    <div className="text-xs text-muted-foreground">Value: {value.toFixed(4)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
