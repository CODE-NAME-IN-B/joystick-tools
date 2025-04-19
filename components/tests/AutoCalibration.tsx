"use client"

import { useState, useEffect, useRef } from "react"
import type { GamepadState, CalibrationData } from "@/hooks/useGamepadService"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/contexts/LanguageContext"
import { Wand2, Loader2, Check, AlertTriangle } from "lucide-react"

interface AutoCalibrationProps {
  gamepadState: GamepadState
  calibrationData: CalibrationData
  setCalibrationData: (data: CalibrationData) => void
}

export function AutoCalibration({ 
  gamepadState, 
  calibrationData, 
  setCalibrationData 
}: AutoCalibrationProps) {
  const { t, direction, currentLanguage } = useLanguage()
  const [isCalibrating, setIsCalibrating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [calibrationComplete, setCalibrationComplete] = useState(false)
  const [calibrationSuccess, setCalibrationSuccess] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  
  // Reference values for calibration
  const sampleDataRef = useRef<{
    leftStick: number[][],
    rightStick: number[][],
    leftTrigger: number[],
    rightTrigger: number[],
  }>({
    leftStick: [],
    rightStick: [],
    leftTrigger: [],
    rightTrigger: [],
  })
  
  const calibrationSteps = [
    {
      title: currentLanguage === 'en' ? 'Preparing' : 'جاري التحضير',
      description: currentLanguage === 'en' 
        ? 'Preparing for calibration...'
        : 'جاري التحضير للمعايرة...',
      duration: 2000,
    },
    {
      title: currentLanguage === 'en' ? 'Center Position' : 'وضع المركز',
      description: currentLanguage === 'en'
        ? 'Keep joysticks in neutral position and don\'t press any buttons'
        : 'إبقاء عصي التحكم في الوضع المحايد وعدم الضغط على أي أزرار',
      duration: 3000,
    },
    {
      title: currentLanguage === 'en' ? 'Left Stick' : 'عصا التحكم اليسرى',
      description: currentLanguage === 'en'
        ? 'Move the left stick to all extreme positions (up, down, left, right, diagonals)'
        : 'حرك عصا التحكم اليسرى إلى جميع المواضع القصوى (أعلى، أسفل، يسار، يمين، قطري)',
      duration: 5000,
    },
    {
      title: currentLanguage === 'en' ? 'Right Stick' : 'عصا التحكم اليمنى',
      description: currentLanguage === 'en'
        ? 'Move the right stick to all extreme positions (up, down, left, right, diagonals)'
        : 'حرك عصا التحكم اليمنى إلى جميع المواضع القصوى (أعلى، أسفل، يسار، يمين، قطري)',
      duration: 5000,
    },
    {
      title: currentLanguage === 'en' ? 'Triggers' : 'أزرار الضغط',
      description: currentLanguage === 'en'
        ? 'Press and release both triggers several times'
        : 'اضغط وحرر كلا زري الضغط عدة مرات',
      duration: 5000,
    },
    {
      title: currentLanguage === 'en' ? 'Processing' : 'جاري المعالجة',
      description: currentLanguage === 'en'
        ? 'Calculating optimal calibration values...'
        : 'حساب قيم المعايرة المثلى...',
      duration: 2000,
    },
  ]
  
  // Start the auto-calibration process
  const startCalibration = () => {
    if (!gamepadState.connected) return
    
    // Reset values
    sampleDataRef.current = {
      leftStick: [],
      rightStick: [],
      leftTrigger: [],
      rightTrigger: [],
    }
    
    setIsCalibrating(true)
    setCurrentStep(0)
    setProgress(0)
    setCalibrationComplete(false)
    setCalibrationSuccess(false)
    setMessage(null)
    
    // Start the first step
    processStep(0)
  }
  
  // Process each calibration step
  const processStep = (step: number) => {
    if (step >= calibrationSteps.length) {
      // All steps complete, process the data
      processCalibrationData()
      return
    }
    
    setCurrentStep(step)
    const duration = calibrationSteps[step].duration
    const startTime = Date.now()
    const interval = 100 // Update interval in ms
    
    // Create interval to update progress and collect samples
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const stepProgress = Math.min(100, (elapsed / duration) * 100)
      setProgress(stepProgress)
      
      // Collect samples during specific steps
      if (step >= 1 && gamepadState.connected) {
        collectSamples(step)
      }
      
      if (elapsed >= duration) {
        clearInterval(progressInterval)
        // Move to next step
        processStep(step + 1)
      }
    }, interval)
  }
  
  // Collect samples during calibration
  const collectSamples = (step: number) => {
    if (!gamepadState.connected) return
    
    // Step 1: Center position
    if (step === 1) {
      // Record neutral position
      sampleDataRef.current.leftStick.push([gamepadState.axes[0], gamepadState.axes[1]])
      sampleDataRef.current.rightStick.push([gamepadState.axes[2], gamepadState.axes[3]])
    }
    // Step 2: Left stick movement
    else if (step === 2) {
      sampleDataRef.current.leftStick.push([gamepadState.axes[0], gamepadState.axes[1]])
    }
    // Step 3: Right stick movement
    else if (step === 3) {
      sampleDataRef.current.rightStick.push([gamepadState.axes[2], gamepadState.axes[3]])
    }
    // Step 4: Triggers
    else if (step === 4) {
      // For most gamepads, triggers are buttons 6 and 7
      sampleDataRef.current.leftTrigger.push(gamepadState.buttons[6]?.value || 0)
      sampleDataRef.current.rightTrigger.push(gamepadState.buttons[7]?.value || 0)
    }
  }
  
  // Process the collected calibration data
  const processCalibrationData = () => {
    try {
      // Check if we have enough samples
      if (
        sampleDataRef.current.leftStick.length < 10 ||
        sampleDataRef.current.rightStick.length < 10
      ) {
        throw new Error(currentLanguage === 'en' 
          ? 'Not enough movement data collected. Please try again.'
          : 'لم يتم جمع بيانات كافية للحركة. يرجى المحاولة مرة أخرى.');
      }
      
      // Calculate deadzone values based on neutral position variations
      const neutralLeftStick = sampleDataRef.current.leftStick.slice(0, 10)
      const neutralRightStick = sampleDataRef.current.rightStick.slice(0, 10)
      
      // Calculate average neutral position
      const avgLeftX = neutralLeftStick.reduce((sum, val) => sum + val[0], 0) / neutralLeftStick.length
      const avgLeftY = neutralLeftStick.reduce((sum, val) => sum + val[1], 0) / neutralLeftStick.length
      const avgRightX = neutralRightStick.reduce((sum, val) => sum + val[0], 0) / neutralRightStick.length
      const avgRightY = neutralRightStick.reduce((sum, val) => sum + val[1], 0) / neutralRightStick.length
      
      // Calculate max deviation from neutral position
      const leftStickDeviations = neutralLeftStick.map(val => 
        Math.max(Math.abs(val[0] - avgLeftX), Math.abs(val[1] - avgLeftY))
      )
      const rightStickDeviations = neutralRightStick.map(val => 
        Math.max(Math.abs(val[0] - avgRightX), Math.abs(val[1] - avgRightY))
      )
      
      // Calculate deadzone based on maximum deviation plus safety margin
      const leftStickDeadzone = Math.min(0.25, Math.max(0.05, 
        Math.max(...leftStickDeviations) * 2.5
      ))
      const rightStickDeadzone = Math.min(0.25, Math.max(0.05, 
        Math.max(...rightStickDeviations) * 2.5
      ))
      
      // Calculate trigger deadzone
      const triggerDeadzone = sampleDataRef.current.leftTrigger.length > 0 || 
        sampleDataRef.current.rightTrigger.length > 0
        ? 0.05 // Default value if triggers were tested
        : calibrationData.deadZones.triggers // Keep existing value if not tested
      
      // Calculate sensitivity (inverse of range of motion)
      const leftStickRange = sampleDataRef.current.leftStick
        .slice(10) // Skip neutral positions
        .map(val => Math.max(Math.abs(val[0]), Math.abs(val[1])))
      
      const rightStickRange = sampleDataRef.current.rightStick
        .slice(10) // Skip neutral positions
        .map(val => Math.max(Math.abs(val[0]), Math.abs(val[1])))
      
      const leftStickMaxRange = leftStickRange.length > 0 
        ? Math.max(...leftStickRange) 
        : 0.8
      
      const rightStickMaxRange = rightStickRange.length > 0 
        ? Math.max(...rightStickRange) 
        : 0.8
      
      // Calculate sensitivity as an adjustment factor
      const leftStickSensitivity = leftStickMaxRange > 0.2 
        ? Math.min(1.5, Math.max(0.8, 1 / leftStickMaxRange)) 
        : 1.0
      
      const rightStickSensitivity = rightStickMaxRange > 0.2 
        ? Math.min(1.5, Math.max(0.8, 1 / rightStickMaxRange)) 
        : 1.0
      
      // Keep the invert settings unchanged
      const newCalibrationData: CalibrationData = {
        deadZones: {
          leftStick: leftStickDeadzone,
          rightStick: rightStickDeadzone,
          triggers: triggerDeadzone,
        },
        sensitivity: {
          leftStick: leftStickSensitivity,
          rightStick: rightStickSensitivity,
          triggers: calibrationData.sensitivity.triggers, // Keep existing value
        },
        invert: {
          ...calibrationData.invert, // Keep existing invert settings
        },
      }
      
      // Apply the new calibration
      setCalibrationData(newCalibrationData)
      setCalibrationSuccess(true)
      setMessage(currentLanguage === 'en'
        ? 'Calibration completed successfully!'
        : 'تمت المعايرة بنجاح!')
    } catch (error) {
      console.error("Calibration error:", error)
      setCalibrationSuccess(false)
      setMessage(error instanceof Error ? error.message : currentLanguage === 'en' 
        ? 'An error occurred during calibration.'
        : 'حدث خطأ أثناء المعايرة.')
    } finally {
      setIsCalibrating(false)
      setCalibrationComplete(true)
    }
  }
  
  return (
    <div className="space-y-4">
      <div className={`flex justify-between items-center ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
        <h3 className="text-lg font-medium">
          {currentLanguage === 'en' ? 'Auto Calibration' : 'المعايرة التلقائية'}
        </h3>
        
        <Button 
          onClick={startCalibration} 
          disabled={!gamepadState.connected || isCalibrating}
          variant="default"
          className="gap-1"
        >
          {isCalibrating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          {currentLanguage === 'en' ? 'Start Auto Calibration' : 'بدء المعايرة التلقائية'}
        </Button>
      </div>

      {isCalibrating && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="text-center">
              <h4 className="text-lg font-medium">{calibrationSteps[currentStep].title}</h4>
              <p className="text-sm text-muted-foreground">
                {calibrationSteps[currentStep].description}
              </p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>
                  {currentLanguage === 'en' ? 'Step' : 'الخطوة'} {currentStep + 1}/{calibrationSteps.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}
      
      {calibrationComplete && !isCalibrating && message && (
        <Alert variant={calibrationSuccess ? "default" : "destructive"}>
          <div className="flex items-center gap-2">
            {calibrationSuccess ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertDescription>{message}</AlertDescription>
          </div>
        </Alert>
      )}
      
      <div className="text-sm text-muted-foreground">
        {currentLanguage === 'en' 
          ? 'Auto calibration will optimize deadzone and sensitivity settings for your controller.'
          : 'ستعمل المعايرة التلقائية على تحسين إعدادات المنطقة الميتة والحساسية لوحدة التحكم الخاصة بك.'}
      </div>
    </div>
  )
} 