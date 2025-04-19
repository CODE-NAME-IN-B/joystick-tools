"use client"

import { useState, useEffect, useRef } from "react"
import { generateId } from "@/utils/crypto"

export type GamepadState = {
  connected: boolean
  id: string
  index: number
  timestamp: number
  buttons: {
    pressed: boolean
    touched: boolean
    value: number
  }[]
  axes: number[]
  mapping: string
  vibrationActuator: any
}

export type CalibrationData = {
  deadZones: {
    leftStick: number
    rightStick: number
    triggers: number
  }
  sensitivity: {
    leftStick: number
    rightStick: number
    triggers: number
  }
  invert: {
    leftStickX: boolean
    leftStickY: boolean
    rightStickX: boolean
    rightStickY: boolean
  }
}

const DEFAULT_CALIBRATION: CalibrationData = {
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
}

export function useGamepadService() {
  const [gamepads, setGamepads] = useState<Record<string, GamepadState>>({})
  const [calibrationData, setCalibrationData] = useState<CalibrationData>(DEFAULT_CALIBRATION)
  const animationRef = useRef<number | null>(null)

  // Initialize gamepad event listeners
  useEffect(() => {
    window.addEventListener("gamepadconnected", handleGamepadConnected)
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnected)

    // Start the update loop
    animationRef.current = requestAnimationFrame(updateGamepads)

    return () => {
      window.removeEventListener("gamepadconnected", handleGamepadConnected)
      window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected)

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const handleGamepadConnected = (event: GamepadEvent) => {
    const { gamepad } = event

    setGamepads((prev) => ({
      ...prev,
      [gamepad.index]: {
        connected: true,
        id: gamepad.id,
        index: gamepad.index,
        timestamp: gamepad.timestamp,
        buttons: gamepad.buttons.map((button) => ({
          pressed: button.pressed,
          touched: button.touched,
          value: button.value,
        })),
        axes: [...gamepad.axes],
        mapping: gamepad.mapping,
        vibrationActuator: gamepad.vibrationActuator,
      },
    }))
  }

  const handleGamepadDisconnected = (event: GamepadEvent) => {
    const { gamepad } = event

    setGamepads((prev) => {
      const newState = { ...prev }
      delete newState[gamepad.index]
      return newState
    })
  }

  const updateGamepads = () => {
    const gamepadsArray = navigator.getGamepads()

    for (const gamepad of gamepadsArray) {
      if (gamepad) {
        setGamepads((prev) => ({
          ...prev,
          [gamepad.index]: {
            connected: true,
            id: gamepad.id,
            index: gamepad.index,
            timestamp: gamepad.timestamp,
            buttons: gamepad.buttons.map((button) => ({
              pressed: button.pressed,
              touched: button.touched,
              value: button.value,
            })),
            axes: [...gamepad.axes],
            mapping: gamepad.mapping,
            vibrationActuator: gamepad.vibrationActuator,
          },
        }))
      }
    }

    animationRef.current = requestAnimationFrame(updateGamepads)
  }

  // Get the first connected gamepad or a default state
  const gamepadState = Object.values(gamepads)[0] || {
    connected: false,
    id: generateId(),
    index: -1,
    timestamp: 0,
    buttons: Array(20).fill({ pressed: false, touched: false, value: 0 }),
    axes: Array(4).fill(0),
    mapping: "standard",
    vibrationActuator: null,
  }

  return {
    gamepadState,
    calibrationData,
    setCalibrationData,
  }
}
