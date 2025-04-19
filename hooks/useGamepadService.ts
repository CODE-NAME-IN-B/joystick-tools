"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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

export type GamepadProfile = {
  id: string
  name: string
  gamepadId: string
  calibrationData: CalibrationData
  lastUsed: number
}

const STORAGE_KEY = "joystick-tools-calibration-profiles";

export const DEFAULT_CALIBRATION: CalibrationData = {
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

// Utility function to load profiles from localStorage
const loadProfiles = (): GamepadProfile[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const savedProfiles = localStorage.getItem(STORAGE_KEY);
    if (!savedProfiles) return [];
    
    const parsed = JSON.parse(savedProfiles);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error loading calibration profiles:", error);
    return [];
  }
};

// Utility function to save profiles to localStorage
const saveProfiles = (profiles: GamepadProfile[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error("Error saving calibration profiles:", error);
  }
};

export function useGamepadService() {
  const [gamepads, setGamepads] = useState<Record<string, GamepadState>>({})
  const [calibrationData, setCalibrationData] = useState<CalibrationData>(DEFAULT_CALIBRATION)
  const [profiles, setProfiles] = useState<GamepadProfile[]>([])
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null)
  const animationRef = useRef<number | null>(null)
  const isInitializedRef = useRef(false)

  // Load profiles on initialization
  useEffect(() => {
    if (isInitializedRef.current) return;
    
    const savedProfiles = loadProfiles();
    setProfiles(savedProfiles);
    isInitializedRef.current = true;
  }, []);

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

  // Try to load saved calibration data when a gamepad connects
  const handleGamepadConnected = useCallback((event: GamepadEvent) => {
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
    
    // Get all profiles from localStorage again to ensure we have the latest
    const currentProfiles = loadProfiles();
    setProfiles(currentProfiles);
    
    // Try to find a profile for this gamepad
    const savedProfile = currentProfiles.find(profile => profile.gamepadId === gamepad.id);
    if (savedProfile) {
      setCalibrationData(savedProfile.calibrationData);
      setActiveProfileId(savedProfile.id);
      
      // Update last used timestamp
      updateProfileLastUsed(savedProfile.id, currentProfiles);
    } else {
      // If no profile exists, revert to default calibration
      setCalibrationData(DEFAULT_CALIBRATION);
      setActiveProfileId(null);
    }
  }, [])

  const handleGamepadDisconnected = useCallback((event: GamepadEvent) => {
    const { gamepad } = event

    setGamepads((prev) => {
      const newState = { ...prev }
      delete newState[gamepad.index]
      return newState
    })
  }, [])

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

  // Update the last used timestamp for a profile
  const updateProfileLastUsed = useCallback((profileId: string, currentProfiles?: GamepadProfile[]) => {
    const profilesArray = currentProfiles || profiles;
    const profileIndex = profilesArray.findIndex(p => p.id === profileId);
    if (profileIndex === -1) return;
    
    const updatedProfiles = [...profilesArray];
    updatedProfiles[profileIndex] = {
      ...updatedProfiles[profileIndex],
      lastUsed: Date.now(),
    };
    
    setProfiles(updatedProfiles);
    saveProfiles(updatedProfiles);
    return updatedProfiles;
  }, [profiles]);

  // Save the current calibration data as a new profile
  const saveProfile = useCallback((name: string) => {
    const gamepadState = Object.values(gamepads)[0];
    if (!gamepadState?.connected) return null;
    
    // Get latest profiles from localStorage
    const currentProfiles = loadProfiles();
    
    const profileId = generateId();
    const newProfile: GamepadProfile = {
      id: profileId,
      name,
      gamepadId: gamepadState.id,
      calibrationData,
      lastUsed: Date.now(),
    };
    
    // Add the new profile to the list
    const updatedProfiles = [...currentProfiles, newProfile];
    setProfiles(updatedProfiles);
    setActiveProfileId(profileId);
    
    // Save to localStorage
    saveProfiles(updatedProfiles);
    
    return profileId;
  }, [gamepads, calibrationData]);
  
  // Update an existing profile with current calibration data
  const updateProfile = useCallback((profileId: string) => {
    if (!profileId) return false;
    
    // Get latest profiles from localStorage
    const currentProfiles = loadProfiles();
    const profileIndex = currentProfiles.findIndex(p => p.id === profileId);
    if (profileIndex === -1) return false;
    
    const gamepadState = Object.values(gamepads)[0];
    if (!gamepadState?.connected) return false;
    
    const updatedProfiles = [...currentProfiles];
    updatedProfiles[profileIndex] = {
      ...updatedProfiles[profileIndex],
      calibrationData,
      lastUsed: Date.now(),
    };
    
    setProfiles(updatedProfiles);
    saveProfiles(updatedProfiles);
    return true;
  }, [gamepads, calibrationData]);
  
  // Load a specific profile
  const loadProfile = useCallback((profileId: string) => {
    // Get latest profiles from localStorage
    const currentProfiles = loadProfiles();
    const profile = currentProfiles.find(p => p.id === profileId);
    if (!profile) return false;
    
    setCalibrationData(profile.calibrationData);
    setActiveProfileId(profileId);
    
    // Update last used timestamp and save
    const updatedProfiles = updateProfileLastUsed(profileId, currentProfiles);
    if (updatedProfiles) {
      setProfiles(updatedProfiles);
    }
    
    return true;
  }, [updateProfileLastUsed]);
  
  // Delete a profile
  const deleteProfile = useCallback((profileId: string) => {
    // Get latest profiles from localStorage
    const currentProfiles = loadProfiles();
    const updatedProfiles = currentProfiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    
    if (activeProfileId === profileId) {
      setActiveProfileId(null);
      setCalibrationData(DEFAULT_CALIBRATION);
    }
    
    saveProfiles(updatedProfiles);
  }, [activeProfileId]);
  
  // Create a wrapped setCalibrationData that automatically updates the active profile
  const setCalibrationDataAndUpdateProfile = useCallback((newData: CalibrationData) => {
    setCalibrationData(newData);
    
    // If there's an active profile, update it with the new calibration data
    if (activeProfileId) {
      // Get latest profiles to ensure we're working with the most recent data
      const currentProfiles = loadProfiles();
      const profileIndex = currentProfiles.findIndex(p => p.id === activeProfileId);
      
      if (profileIndex !== -1) {
        const updatedProfiles = [...currentProfiles];
        updatedProfiles[profileIndex] = {
          ...updatedProfiles[profileIndex],
          calibrationData: newData,
          lastUsed: Date.now(),
        };
        
        setProfiles(updatedProfiles);
        saveProfiles(updatedProfiles);
      }
    }
  }, [activeProfileId]);

  // Get the first connected gamepad or a default state
  const gamepadState = Object.values(gamepads)[0] || {
    connected: false,
    id: "",
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
    setCalibrationData: setCalibrationDataAndUpdateProfile,
    profiles,
    activeProfileId,
    saveProfile,
    updateProfile,
    deleteProfile,
    loadProfile,
  }
}
