"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/LanguageContext"
import { useGamepadType } from "@/contexts/GamepadTypeContext"
import { GamepadState } from "@/hooks/useGamepadService"
import { ShieldCheck, ShieldAlert, ShieldQuestion, AlertTriangle, Check, Info } from "lucide-react"

interface GamepadAuthenticityVerifierProps {
  gamepadState: GamepadState
}

// Authentication test result
interface TestResult {
  name: string
  description: string
  passed: boolean
  warning?: boolean
  score: number
}

export function GamepadAuthenticityVerifier({ gamepadState }: GamepadAuthenticityVerifierProps) {
  const { t, direction, currentLanguage } = useLanguage()
  const { controllerType, controllerTypeLabel, controllerAuthenticity, authenticityLabel } = useGamepadType()
  
  const [verificationActive, setVerificationActive] = useState(false)
  const [verificationComplete, setVerificationComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<TestResult[]>([])
  const [score, setScore] = useState(0)
  
  // Start the verification process
  const startVerification = () => {
    if (!gamepadState.connected) return
    
    setVerificationActive(true)
    setVerificationComplete(false)
    setProgress(0)
    setResults([])
    
    // Start the progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          completeVerification()
          return 100
        }
        return prev + 2
      })
    }, 100)
  }
  
  // Complete the verification and show results
  const completeVerification = () => {
    const testResults = runTests()
    setResults(testResults)
    
    // Calculate overall score
    const totalScore = testResults.reduce((sum, test) => sum + test.score, 0)
    const maxScore = testResults.length * 100
    const percentageScore = Math.round((totalScore / maxScore) * 100)
    
    setScore(percentageScore)
    setVerificationComplete(true)
    setVerificationActive(false)
  }
  
  // Run the actual tests to verify authenticity
  const runTests = (): TestResult[] => {
    const tests: TestResult[] = []
    
    // Test 1: Check ID patterns
    const idTest = verifyIdPatterns()
    tests.push(idTest)
    
    // Test 2: Check number of buttons
    const buttonsTest = verifyButtonCount()
    tests.push(buttonsTest)
    
    // Test 3: Check for consistent button values
    const buttonValuesTest = verifyButtonValues()
    tests.push(buttonValuesTest)
    
    // Test 4: Check for consistent axis values
    const axisValuesTest = verifyAxisValues()
    tests.push(axisValuesTest)
    
    // Test 5: Check for vibration support
    const vibrationTest = verifyVibrationSupport()
    tests.push(vibrationTest)
    
    return tests
  }
  
  // Test 1: Verify ID patterns
  const verifyIdPatterns = (): TestResult => {
    const id = gamepadState.id.toLowerCase()
    
    // Known authentic patterns for different controller types
    const xboxPatterns = [
      "xbox one", 
      "microsoft", 
      "xbox wireless", 
      "xbox elite"
    ]
    
    const playstationPatterns = [
      "wireless controller", 
      "sony interactive entertainment", 
      "dualsock", 
      "dualsense"
    ]
    
    const matchingPatterns = controllerType === "xbox" 
      ? xboxPatterns 
      : controllerType === "playstation" 
        ? playstationPatterns 
        : []
    
    const suspiciousWords = ["clone", "compatible", "generic", "third party", "third-party", "fake"]
    
    // Count how many authentic patterns match
    const patternMatches = matchingPatterns.filter(pattern => id.includes(pattern)).length
    
    // Check for suspicious terms
    const hasSuspiciousTerms = suspiciousWords.some(word => id.includes(word))
    
    let passed = false
    let score = 0
    let warning = false
    
    if (controllerType === "generic") {
      // Generic controllers can't be verified this way
      passed = false
      score = 50
      warning = true
    } else if (patternMatches >= 2) {
      // Strong match with authentic patterns
      passed = true
      score = 100
    } else if (patternMatches === 1 && !hasSuspiciousTerms) {
      // Some match with authentic patterns, without suspicious terms
      passed = true
      score = 80
      warning = true
    } else if (patternMatches === 1 && hasSuspiciousTerms) {
      // Some match but has suspicious terms
      passed = false
      score = 40
      warning = true
    } else if (hasSuspiciousTerms) {
      // Has suspicious terms
      passed = false
      score = 20
    } else {
      // No matches but no suspicious terms either
      passed = false
      score = 50
      warning = true
    }
    
    return {
      name: currentLanguage === 'en' ? 'Manufacturer Verification' : 'التحقق من الشركة المصنعة',
      description: currentLanguage === 'en' 
        ? `Controller identified as: ${gamepadState.id}`
        : `وحدة التحكم المحددة: ${gamepadState.id}`,
      passed,
      warning,
      score
    }
  }
  
  // Test 2: Verify button count
  const verifyButtonCount = (): TestResult => {
    const expectedButtonCount = {
      xbox: 17,
      playstation: 17,
      generic: 12
    }
    
    const actualButtonCount = gamepadState.buttons.length
    const expected = expectedButtonCount[controllerType]
    
    let passed = false
    let score = 0
    let warning = false
    
    if (actualButtonCount === expected) {
      passed = true
      score = 100
    } else if (actualButtonCount >= expected - 2 && actualButtonCount <= expected + 2) {
      passed = true
      score = 80
      warning = true
    } else {
      passed = false
      score = 40
      warning = true
    }
    
    return {
      name: currentLanguage === 'en' ? 'Button Count Check' : 'فحص عدد الأزرار',
      description: currentLanguage === 'en'
        ? `Found ${actualButtonCount} buttons (Expected ${expected})`
        : `تم العثور على ${actualButtonCount} زر (المتوقع ${expected})`,
      passed,
      warning,
      score
    }
  }
  
  // Test 3: Verify consistent button values
  const verifyButtonValues = (): TestResult => {
    // Check if digital buttons have correct values (0 or 1)
    const digitalButtons = gamepadState.buttons.slice(0, 16)
    const valueCheck = digitalButtons.every(btn => 
      btn.value === 0 || btn.value === 1 || 
      (btn.value >= 0 && btn.value <= 1)
    )
    
    // Check if pressed state matches value
    const pressedCheck = digitalButtons.every(btn => 
      (btn.pressed && btn.value > 0) || (!btn.pressed && btn.value === 0)
    )
    
    let passed = valueCheck && pressedCheck
    let score = valueCheck ? (pressedCheck ? 100 : 70) : 40
    
    return {
      name: currentLanguage === 'en' ? 'Button Response Check' : 'فحص استجابة الأزرار',
      description: currentLanguage === 'en'
        ? 'Checking if buttons report values consistently'
        : 'التحقق مما إذا كانت الأزرار تبلغ عن القيم بشكل متسق',
      passed,
      score
    }
  }
  
  // Test 4: Verify axis values
  const verifyAxisValues = (): TestResult => {
    // Check if axes values are within expected range (-1 to 1)
    const validRangeCheck = gamepadState.axes.every(value => value >= -1 && value <= 1)
    
    // Check for precision/noise in neutral position
    const precisionCheck = gamepadState.axes.every(value => 
      Math.abs(value) < 0.01 || Math.abs(value) > 0.05
    )
    
    let passed = validRangeCheck
    let score = validRangeCheck ? (precisionCheck ? 100 : 80) : 50
    let warning = !precisionCheck
    
    return {
      name: currentLanguage === 'en' ? 'Joystick Precision Check' : 'فحص دقة عصا التحكم',
      description: currentLanguage === 'en'
        ? 'Checking analog stick sensitivity and precision'
        : 'التحقق من حساسية ودقة عصا التحكم التناظرية',
      passed,
      warning,
      score
    }
  }
  
  // Test 5: Verify vibration support
  const verifyVibrationSupport = (): TestResult => {
    const hasVibration = gamepadState.vibrationActuator != null
    
    let passed = hasVibration
    let score = hasVibration ? 100 : 50
    let warning = !hasVibration && (controllerType === "xbox" || controllerType === "playstation")
    
    return {
      name: currentLanguage === 'en' ? 'Vibration Support' : 'دعم الاهتزاز',
      description: currentLanguage === 'en'
        ? hasVibration ? 'Vibration actuators detected' : 'No vibration support detected'
        : hasVibration ? 'تم اكتشاف محركات الاهتزاز' : 'لم يتم اكتشاف دعم الاهتزاز',
      passed,
      warning,
      score
    }
  }
  
  // Get appropriate icon for authenticity result
  const getAuthenticityIcon = () => {
    if (score >= 85) {
      return <ShieldCheck className="h-6 w-6 text-green-500" />
    } else if (score >= 60) {
      return <ShieldQuestion className="h-6 w-6 text-yellow-500" />
    } else {
      return <ShieldAlert className="h-6 w-6 text-red-500" />
    }
  }
  
  // Get appropriate badge for authenticity status
  const getAuthenticityBadge = () => {
    if (score >= 85) {
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-300 gap-1">
          <Check className="h-3 w-3" />
          {currentLanguage === 'en' ? 'Original Controller' : 'وحدة تحكم أصلية'}
        </Badge>
      )
    } else if (score >= 60) {
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-300 gap-1">
          <Info className="h-3 w-3" />
          {currentLanguage === 'en' ? 'Possibly Original' : 'من المحتمل أن تكون أصلية'}
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-300 gap-1">
          <AlertTriangle className="h-3 w-3" />
          {currentLanguage === 'en' ? 'Possible Counterfeit' : 'من المحتمل أن تكون مقلدة'}
        </Badge>
      )
    }
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className={`flex items-center ${direction === 'rtl' ? 'flex-row-reverse' : ''} justify-between`}>
          <span>
            {currentLanguage === 'en' 
              ? 'Controller Authenticity Verification' 
              : 'التحقق من أصالة وحدة التحكم'}
          </span>
          {verificationComplete && getAuthenticityBadge()}
        </CardTitle>
        <CardDescription>
          {currentLanguage === 'en'
            ? 'Verify if your controller is an original or a third-party device'
            : 'تحقق مما إذا كانت وحدة التحكم الخاصة بك أصلية أو جهاز من طرف ثالث'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!gamepadState.connected ? (
          <div className="text-center p-8 text-muted-foreground border rounded-md">
            {currentLanguage === 'en'
              ? 'Please connect a gamepad to verify its authenticity'
              : 'يرجى توصيل وحدة تحكم للتحقق من أصالتها'}
          </div>
        ) : (
          <div className="space-y-6">
            {!verificationComplete && !verificationActive && (
              <Button onClick={startVerification} className="w-full">
                {currentLanguage === 'en'
                  ? 'Start Verification'
                  : 'بدء التحقق'}
              </Button>
            )}
            
            {verificationActive && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {currentLanguage === 'en'
                      ? 'Verification in progress...'
                      : 'جاري التحقق...'}
                  </span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            {verificationComplete && (
              <div className="space-y-6">
                {/* Overall result */}
                <div className="flex items-center justify-between border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    {getAuthenticityIcon()}
                    <div>
                      <h4 className="font-medium">
                        {currentLanguage === 'en'
                          ? 'Verification Score'
                          : 'نتيجة التحقق'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {controllerTypeLabel}
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{score}%</div>
                </div>
                
                {/* Individual test results */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">
                    {currentLanguage === 'en'
                      ? 'Test Results'
                      : 'نتائج الاختبار'}
                  </h4>
                  
                  {results.map((result, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {result.passed ? (
                            <Check className={`h-4 w-4 ${result.warning ? 'text-yellow-500' : 'text-green-500'}`} />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-medium">{result.name}</span>
                          {result.warning && (
                            <Badge variant="outline" className="text-xs bg-yellow-100 border-yellow-300 text-yellow-800">
                              {currentLanguage === 'en' ? 'Warning' : 'تحذير'}
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm">{result.score}/100</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{result.description}</p>
                    </div>
                  ))}
                </div>
                
                {/* Rerun test button */}
                <Button 
                  variant="outline" 
                  onClick={startVerification} 
                  className="w-full"
                >
                  {currentLanguage === 'en'
                    ? 'Run Verification Again'
                    : 'تشغيل التحقق مرة أخرى'}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 