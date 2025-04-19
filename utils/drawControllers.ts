import type { GamepadState, CalibrationData } from "@/hooks/useGamepadService"
import { applyStickCalibration } from "./calibration"

// Remove the import line that's causing the error:
// export { drawXboxController } from "./drawXboxController"

// Instead, include the Xbox controller drawing function directly in this file:
// Draw an Xbox controller with the current state
export function drawXboxController(
  ctx: CanvasRenderingContext2D,
  gamepadState: GamepadState,
  calibrationData: CalibrationData,
) {
  const { width, height } = ctx.canvas
  const scale = Math.min(width / 600, height / 400)

  // Center the controller
  const centerX = width / 2
  const centerY = height / 2

  // Base controller dimensions
  const controllerWidth = 400 * scale
  const controllerHeight = 280 * scale // Increased height for better spacing

  // Draw controller body
  ctx.save()
  ctx.translate(centerX - controllerWidth / 2, centerY - controllerHeight / 2)

  // Draw controller base
  ctx.beginPath()
  ctx.moveTo(100 * scale, 70 * scale) // Adjusted y-coordinate for better top spacing
  ctx.bezierCurveTo(50 * scale, 70 * scale, 20 * scale, 120 * scale, 20 * scale, 145 * scale)
  ctx.lineTo(20 * scale, 195 * scale)
  ctx.bezierCurveTo(20 * scale, 220 * scale, 50 * scale, 270 * scale, 100 * scale, 270 * scale)
  ctx.lineTo(300 * scale, 270 * scale)
  ctx.bezierCurveTo(350 * scale, 270 * scale, 380 * scale, 220 * scale, 380 * scale, 195 * scale)
  ctx.lineTo(380 * scale, 145 * scale)
  ctx.bezierCurveTo(380 * scale, 120 * scale, 350 * scale, 70 * scale, 300 * scale, 70 * scale)
  ctx.closePath()

  // Fill controller body
  ctx.fillStyle = gamepadState.connected ? "#333" : "#666"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Draw left analog stick
  const leftStickX = 100 * scale
  const leftStickY = 140 * scale // Adjusted position
  const stickRadius = 20 * scale
  const stickBaseRadius = stickRadius + 5 * scale

  // Draw stick base
  ctx.beginPath()
  ctx.arc(leftStickX, leftStickY, stickBaseRadius, 0, Math.PI * 2)
  ctx.fillStyle = "#222"
  ctx.fill()

  // Draw stick position
  if (gamepadState.connected) {
    const [calibratedX, calibratedY] = applyStickCalibration(
      gamepadState.axes[0],
      gamepadState.axes[1],
      calibrationData.deadZones.leftStick,
      calibrationData.sensitivity.leftStick,
      calibrationData.invert.leftStickX,
      calibrationData.invert.leftStickY,
    )

    const stickX = leftStickX + calibratedX * stickRadius
    const stickY = leftStickY + calibratedY * stickRadius

    ctx.beginPath()
    ctx.arc(stickX, stickY, stickRadius, 0, Math.PI * 2)
    ctx.fillStyle = gamepadState.buttons[10]?.pressed ? "#3b82f6" : "#555"
    ctx.fill()
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 2 * scale
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.arc(leftStickX, leftStickY, stickRadius, 0, Math.PI * 2)
    ctx.fillStyle = "#555"
    ctx.fill()
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 2 * scale
    ctx.stroke()
  }

  // Draw right analog stick
  const rightStickX = 300 * scale
  const rightStickY = 220 * scale // Moved further down so A button is above

  // Draw stick base
  ctx.beginPath()
  ctx.arc(rightStickX, rightStickY, stickBaseRadius, 0, Math.PI * 2)
  ctx.fillStyle = "#222"
  ctx.fill()

  // Draw stick position
  if (gamepadState.connected) {
    const [calibratedX, calibratedY] = applyStickCalibration(
      gamepadState.axes[2],
      gamepadState.axes[3],
      calibrationData.deadZones.rightStick,
      calibrationData.sensitivity.rightStick,
      calibrationData.invert.rightStickX,
      calibrationData.invert.rightStickY,
    )

    const stickX = rightStickX + calibratedX * stickRadius
    const stickY = rightStickY + calibratedY * stickRadius

    ctx.beginPath()
    ctx.arc(stickX, stickY, stickRadius, 0, Math.PI * 2)
    ctx.fillStyle = gamepadState.buttons[11]?.pressed ? "#3b82f6" : "#555"
    ctx.fill()
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 2 * scale
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.arc(rightStickX, rightStickY, stickRadius, 0, Math.PI * 2)
    ctx.fillStyle = "#555"
    ctx.fill()
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 2 * scale
    ctx.stroke()
  }

  // Draw D-pad
  const dpadX = 100 * scale
  const dpadY = 210 * scale // Adjusted for better vertical alignment
  const dpadSize = 15 * scale
  const dpadBaseRadius = dpadSize + 10 * scale

  // D-pad base
  ctx.beginPath()
  ctx.arc(dpadX, dpadY, dpadBaseRadius, 0, Math.PI * 2)
  ctx.fillStyle = "#222"
  ctx.fill()

  // D-pad up
  ctx.beginPath()
  ctx.moveTo(dpadX, dpadY - dpadSize)
  ctx.lineTo(dpadX - dpadSize, dpadY - dpadSize)
  ctx.lineTo(dpadX - dpadSize, dpadY - dpadSize * 2)
  ctx.lineTo(dpadX + dpadSize, dpadY - dpadSize * 2)
  ctx.lineTo(dpadX + dpadSize, dpadY - dpadSize)
  ctx.lineTo(dpadX, dpadY - dpadSize)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[12]?.pressed ? "#3b82f6" : "#555"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 1 * scale
  ctx.stroke()

  // D-pad right
  ctx.beginPath()
  ctx.moveTo(dpadX + dpadSize, dpadY)
  ctx.lineTo(dpadX + dpadSize, dpadY - dpadSize)
  ctx.lineTo(dpadX + dpadSize * 2, dpadY - dpadSize)
  ctx.lineTo(dpadX + dpadSize * 2, dpadY + dpadSize)
  ctx.lineTo(dpadX + dpadSize, dpadY + dpadSize)
  ctx.lineTo(dpadX + dpadSize, dpadY)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[15]?.pressed ? "#3b82f6" : "#555"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 1 * scale
  ctx.stroke()

  // D-pad down
  ctx.beginPath()
  ctx.moveTo(dpadX, dpadY + dpadSize)
  ctx.lineTo(dpadX - dpadSize, dpadY + dpadSize)
  ctx.lineTo(dpadX - dpadSize, dpadY + dpadSize * 2)
  ctx.lineTo(dpadX + dpadSize, dpadY + dpadSize * 2)
  ctx.lineTo(dpadX + dpadSize, dpadY + dpadSize)
  ctx.lineTo(dpadX, dpadY + dpadSize)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[13]?.pressed ? "#3b82f6" : "#555"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 1 * scale
  ctx.stroke()

  // D-pad left
  ctx.beginPath()
  ctx.moveTo(dpadX - dpadSize, dpadY)
  ctx.lineTo(dpadX - dpadSize, dpadY - dpadSize)
  ctx.lineTo(dpadX - dpadSize * 2, dpadY - dpadSize)
  ctx.lineTo(dpadX - dpadSize * 2, dpadY + dpadSize)
  ctx.lineTo(dpadX - dpadSize, dpadY + dpadSize)
  ctx.lineTo(dpadX - dpadSize, dpadY)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[14]?.pressed ? "#3b82f6" : "#555"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 1 * scale
  ctx.stroke()

  // Draw face buttons (A, B, X, Y) in a diamond pattern
  const faceButtonRadius = 15 * scale
  const faceButtonCenterX = 300 * scale
  const faceButtonCenterY = 140 * scale // Adjusted position
  const faceButtonOffset = 30 * scale // Increased offset for better spacing

  // A button (bottom)
  ctx.beginPath()
  ctx.arc(faceButtonCenterX, faceButtonCenterY + faceButtonOffset, faceButtonRadius, 0, Math.PI * 2)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[0]?.pressed ? "#3b82f6" : "#0f0"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()
  
  // Draw "A" letter
  ctx.fillStyle = "#111"
  ctx.font = `${12 * scale}px Arial`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("A", faceButtonCenterX, faceButtonCenterY + faceButtonOffset)

  // B button (right)
  ctx.beginPath()
  ctx.arc(faceButtonCenterX + faceButtonOffset, faceButtonCenterY, faceButtonRadius, 0, Math.PI * 2)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[1]?.pressed ? "#3b82f6" : "#f00"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()
  
  // Draw "B" letter
  ctx.fillStyle = "#111"
  ctx.fillText("B", faceButtonCenterX + faceButtonOffset, faceButtonCenterY)

  // X button (left)
  ctx.beginPath()
  ctx.arc(faceButtonCenterX - faceButtonOffset, faceButtonCenterY, faceButtonRadius, 0, Math.PI * 2)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[2]?.pressed ? "#3b82f6" : "#00f"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()
  
  // Draw "X" letter
  ctx.fillStyle = "#fff"
  ctx.fillText("X", faceButtonCenterX - faceButtonOffset, faceButtonCenterY)

  // Y button (top)
  ctx.beginPath()
  ctx.arc(faceButtonCenterX, faceButtonCenterY - faceButtonOffset, faceButtonRadius, 0, Math.PI * 2)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[3]?.pressed ? "#3b82f6" : "#ff0"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Draw "Y" letter
  ctx.fillStyle = "#111"
  ctx.fillText("Y", faceButtonCenterX, faceButtonCenterY - faceButtonOffset)

  // Draw bumpers and triggers with better spacing
  const bumperWidth = 60 * scale
  const bumperHeight = 20 * scale
  const triggerWidth = 40 * scale
  const triggerHeight = 25 * scale
  const bumperY = 40 * scale // Adjusted for better spacing
  const triggerY = 15 * scale // Adjusted for better spacing

  // Left bumper (LB)
  ctx.beginPath()
  ctx.rect(50 * scale, bumperY, bumperWidth, bumperHeight)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[4]?.pressed ? "#3b82f6" : "#555"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Draw "LB" text
  ctx.fillStyle = "#fff"
  ctx.font = `${10 * scale}px Arial`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("LB", (50 + bumperWidth / 2) * scale, (bumperY + bumperHeight / 2))

  // Right bumper (RB)
  ctx.beginPath()
  ctx.rect(290 * scale, bumperY, bumperWidth, bumperHeight)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[5]?.pressed ? "#3b82f6" : "#555"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()
  
  // Draw "RB" text
  ctx.fillStyle = "#fff"
  ctx.fillText("RB", (290 + bumperWidth / 2) * scale, (bumperY + bumperHeight / 2))

  // Left trigger (LT)
  ctx.beginPath()
  ctx.rect(60 * scale, triggerY, triggerWidth, triggerHeight)
  
  if (gamepadState.connected) {
    // Apply trigger calibration
    const leftTriggerValue = gamepadState.buttons[6]?.value || 0
    let calibratedTrigger = leftTriggerValue
    if (leftTriggerValue > calibrationData.deadZones.triggers) {
      calibratedTrigger = 
        (leftTriggerValue - calibrationData.deadZones.triggers) / 
        (1 - calibrationData.deadZones.triggers) * 
        calibrationData.sensitivity.triggers
    } else {
      calibratedTrigger = 0
    }
    
    // Create gradient based on trigger pressure
    const gradient = ctx.createLinearGradient(
      60 * scale,
      triggerY,
      (60 + triggerWidth) * scale,
      triggerY
    )
    gradient.addColorStop(0, "#555")
    gradient.addColorStop(calibratedTrigger, "#3b82f6")
    gradient.addColorStop(calibratedTrigger, "#555")
    gradient.addColorStop(1, "#555")
    ctx.fillStyle = gradient
  } else {
    ctx.fillStyle = "#555"
  }
  
    ctx.fill()
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 2 * scale
    ctx.stroke()
  
  // Draw "LT" text
  ctx.fillStyle = "#fff"
  ctx.fillText("LT", (60 + triggerWidth / 2) * scale, (triggerY + triggerHeight / 2))

  // Right trigger (RT)
  ctx.beginPath()
  ctx.rect(300 * scale, triggerY, triggerWidth, triggerHeight)
  
  if (gamepadState.connected) {
    // Apply trigger calibration
    const rightTriggerValue = gamepadState.buttons[7]?.value || 0
    let calibratedTrigger = rightTriggerValue
    if (rightTriggerValue > calibrationData.deadZones.triggers) {
      calibratedTrigger = 
        (rightTriggerValue - calibrationData.deadZones.triggers) / 
        (1 - calibrationData.deadZones.triggers) * 
        calibrationData.sensitivity.triggers
    } else {
      calibratedTrigger = 0
    }
    
    // Create gradient based on trigger pressure
    const gradient = ctx.createLinearGradient(
      300 * scale,
      triggerY,
      (300 + triggerWidth) * scale,
      triggerY
    )
    gradient.addColorStop(0, "#555")
    gradient.addColorStop(calibratedTrigger, "#3b82f6")
    gradient.addColorStop(calibratedTrigger, "#555")
    gradient.addColorStop(1, "#555")
    ctx.fillStyle = gradient
  } else {
    ctx.fillStyle = "#555"
  }
  
    ctx.fill()
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 2 * scale
    ctx.stroke()
  
  // Draw "RT" text
  ctx.fillStyle = "#fff"
  ctx.fillText("RT", (300 + triggerWidth / 2) * scale, (triggerY + triggerHeight / 2))

  // Draw center buttons (Start, Back, Xbox)
  const centerButtonWidth = 30 * scale
  const centerButtonHeight = 15 * scale
  const centerButtonY = 140 * scale // Adjusted position
  const centerButtonSpacing = 12 * scale

  // Back button (left)
  ctx.beginPath()
  ctx.ellipse(
    200 * scale - centerButtonSpacing - centerButtonWidth / 2,
    centerButtonY,
    centerButtonWidth / 2,
    centerButtonHeight / 2,
    0,
    0,
    Math.PI * 2
  )
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[8]?.pressed ? "#3b82f6" : "#555"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Start button (right)
  ctx.beginPath()
  ctx.ellipse(
    200 * scale + centerButtonSpacing + centerButtonWidth / 2,
    centerButtonY,
    centerButtonWidth / 2,
    centerButtonHeight / 2,
    0,
    0,
    Math.PI * 2
  )
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[9]?.pressed ? "#3b82f6" : "#555"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Xbox button (center)
  ctx.beginPath()
  ctx.arc(200 * scale, centerButtonY, 15 * scale, 0, Math.PI * 2)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[16]?.pressed ? "#3b82f6" : "#222"
  ctx.fill()
  ctx.strokeStyle = "#111"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Draw Xbox logo in the center button
  ctx.beginPath()
  ctx.arc(200 * scale, centerButtonY, 10 * scale, 0, Math.PI * 2)
  ctx.fillStyle = "#0f0"
  ctx.fill()
  ctx.strokeStyle = "#111"
  ctx.lineWidth = 1 * scale
  ctx.stroke()

  ctx.restore()
}

// Draw a PlayStation controller with the current state
export function drawPlaystationController(
  ctx: CanvasRenderingContext2D,
  gamepadState: GamepadState,
  calibrationData: CalibrationData,
) {
  const { width, height } = ctx.canvas
  const scale = Math.min(width / 600, height / 400)

  // Center the controller
  const centerX = width / 2
  const centerY = height / 2

  // Base controller dimensions
  const controllerWidth = 400 * scale
  const controllerHeight = 280 * scale // Increased height for better spacing

  // Draw controller body
  ctx.save()
  ctx.translate(centerX - controllerWidth / 2, centerY - controllerHeight / 2)

  // Draw controller base (more rounded for PlayStation)
  ctx.beginPath()
  ctx.moveTo(100 * scale, 70 * scale) // Adjusted y-coordinate for better top spacing
  ctx.bezierCurveTo(50 * scale, 70 * scale, 20 * scale, 120 * scale, 20 * scale, 145 * scale)
  ctx.lineTo(20 * scale, 195 * scale)
  ctx.bezierCurveTo(20 * scale, 220 * scale, 50 * scale, 270 * scale, 100 * scale, 270 * scale)
  ctx.lineTo(300 * scale, 270 * scale)
  ctx.bezierCurveTo(350 * scale, 270 * scale, 380 * scale, 220 * scale, 380 * scale, 195 * scale)
  ctx.lineTo(380 * scale, 145 * scale)
  ctx.bezierCurveTo(380 * scale, 120 * scale, 350 * scale, 70 * scale, 300 * scale, 70 * scale)
  ctx.closePath()

  // Fill controller body
  ctx.fillStyle = gamepadState.connected ? "#303030" : "#666"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Draw D-pad on the left (PlayStation has D-pad in the primary position)
  const dpadX = 100 * scale
  const dpadY = 140 * scale // Adjusted position
  const dpadSize = 15 * scale
  const dpadBaseRadius = dpadSize + 10 * scale

  // D-pad base
  ctx.beginPath()
  ctx.arc(dpadX, dpadY, dpadBaseRadius, 0, Math.PI * 2)
  ctx.fillStyle = "#222"
  ctx.fill()

  // D-pad up
  ctx.beginPath()
  ctx.moveTo(dpadX, dpadY - dpadSize)
  ctx.lineTo(dpadX - dpadSize, dpadY - dpadSize)
  ctx.lineTo(dpadX - dpadSize, dpadY - dpadSize * 2)
  ctx.lineTo(dpadX + dpadSize, dpadY - dpadSize * 2)
  ctx.lineTo(dpadX + dpadSize, dpadY - dpadSize)
  ctx.lineTo(dpadX, dpadY - dpadSize)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[12]?.pressed ? "#3b82f6" : "#444"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 1 * scale
  ctx.stroke()

  // D-pad right
  ctx.beginPath()
  ctx.moveTo(dpadX + dpadSize, dpadY)
  ctx.lineTo(dpadX + dpadSize, dpadY - dpadSize)
  ctx.lineTo(dpadX + dpadSize * 2, dpadY - dpadSize)
  ctx.lineTo(dpadX + dpadSize * 2, dpadY + dpadSize)
  ctx.lineTo(dpadX + dpadSize, dpadY + dpadSize)
  ctx.lineTo(dpadX + dpadSize, dpadY)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[15]?.pressed ? "#3b82f6" : "#444"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 1 * scale
  ctx.stroke()

  // D-pad down
  ctx.beginPath()
  ctx.moveTo(dpadX, dpadY + dpadSize)
  ctx.lineTo(dpadX - dpadSize, dpadY + dpadSize)
  ctx.lineTo(dpadX - dpadSize, dpadY + dpadSize * 2)
  ctx.lineTo(dpadX + dpadSize, dpadY + dpadSize * 2)
  ctx.lineTo(dpadX + dpadSize, dpadY + dpadSize)
  ctx.lineTo(dpadX, dpadY + dpadSize)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[13]?.pressed ? "#3b82f6" : "#444"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 1 * scale
  ctx.stroke()

  // D-pad left
  ctx.beginPath()
  ctx.moveTo(dpadX - dpadSize, dpadY)
  ctx.lineTo(dpadX - dpadSize, dpadY - dpadSize)
  ctx.lineTo(dpadX - dpadSize * 2, dpadY - dpadSize)
  ctx.lineTo(dpadX - dpadSize * 2, dpadY + dpadSize)
  ctx.lineTo(dpadX - dpadSize, dpadY + dpadSize)
  ctx.lineTo(dpadX - dpadSize, dpadY)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[14]?.pressed ? "#3b82f6" : "#444"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 1 * scale
  ctx.stroke()

  // Draw left analog stick
  const leftStickX = 100 * scale
  const leftStickY = 210 * scale // Adjusted position
  const stickRadius = 20 * scale
  const stickBaseRadius = stickRadius + 5 * scale

  // Draw stick base
  ctx.beginPath()
  ctx.arc(leftStickX, leftStickY, stickBaseRadius, 0, Math.PI * 2)
  ctx.fillStyle = "#222"
  ctx.fill()

  // Draw stick position
  if (gamepadState.connected) {
    const [calibratedX, calibratedY] = applyStickCalibration(
      gamepadState.axes[0],
      gamepadState.axes[1],
      calibrationData.deadZones.leftStick,
      calibrationData.sensitivity.leftStick,
      calibrationData.invert.leftStickX,
      calibrationData.invert.leftStickY,
    )

    const stickX = leftStickX + calibratedX * stickRadius
    const stickY = leftStickY + calibratedY * stickRadius

    ctx.beginPath()
    ctx.arc(stickX, stickY, stickRadius, 0, Math.PI * 2)
    ctx.fillStyle = gamepadState.buttons[10]?.pressed ? "#3b82f6" : "#444"
    ctx.fill()
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 2 * scale
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.arc(leftStickX, leftStickY, stickRadius, 0, Math.PI * 2)
    ctx.fillStyle = "#444"
    ctx.fill()
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 2 * scale
    ctx.stroke()
  }

  // Draw right analog stick
  const rightStickX = 300 * scale
  const rightStickY = 250 * scale // Moved further down so Cross button is above

  // Draw stick base
  ctx.beginPath()
  ctx.arc(rightStickX, rightStickY, stickBaseRadius, 0, Math.PI * 2)
  ctx.fillStyle = "#222"
  ctx.fill()

  // Draw stick position
  if (gamepadState.connected) {
    const [calibratedX, calibratedY] = applyStickCalibration(
      gamepadState.axes[2],
      gamepadState.axes[3],
      calibrationData.deadZones.rightStick,
      calibrationData.sensitivity.rightStick,
      calibrationData.invert.rightStickX,
      calibrationData.invert.rightStickY,
    )

    const stickX = rightStickX + calibratedX * stickRadius
    const stickY = rightStickY + calibratedY * stickRadius

    ctx.beginPath()
    ctx.arc(stickX, stickY, stickRadius, 0, Math.PI * 2)
    ctx.fillStyle = gamepadState.buttons[11]?.pressed ? "#3b82f6" : "#444"
    ctx.fill()
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 2 * scale
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.arc(rightStickX, rightStickY, stickRadius, 0, Math.PI * 2)
    ctx.fillStyle = "#444"
    ctx.fill()
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 2 * scale
    ctx.stroke()
  }

  // Draw face buttons (Cross, Circle, Square, Triangle)
  const faceButtonRadius = 15 * scale
  const faceButtonCenterX = 300 * scale
  const faceButtonCenterY = 140 * scale // Adjusted position
  const faceButtonOffset = 30 * scale // Increased for better spacing

  // Cross button (bottom) - equivalent to A/X
  ctx.beginPath()
  ctx.arc(faceButtonCenterX, faceButtonCenterY + faceButtonOffset, faceButtonRadius, 0, Math.PI * 2)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[0]?.pressed ? "#3b82f6" : "#5c9ade"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Draw cross symbol
  ctx.beginPath()
  ctx.moveTo(faceButtonCenterX - 8 * scale, faceButtonCenterY + faceButtonOffset - 8 * scale)
  ctx.lineTo(faceButtonCenterX + 8 * scale, faceButtonCenterY + faceButtonOffset + 8 * scale)
  ctx.moveTo(faceButtonCenterX + 8 * scale, faceButtonCenterY + faceButtonOffset - 8 * scale)
  ctx.lineTo(faceButtonCenterX - 8 * scale, faceButtonCenterY + faceButtonOffset + 8 * scale)
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Circle button (right) - equivalent to B/Circle
  ctx.beginPath()
  ctx.arc(faceButtonCenterX + faceButtonOffset, faceButtonCenterY, faceButtonRadius, 0, Math.PI * 2)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[1]?.pressed ? "#3b82f6" : "#e94444"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Draw circle symbol
  ctx.beginPath()
  ctx.arc(faceButtonCenterX + faceButtonOffset, faceButtonCenterY, 8 * scale, 0, Math.PI * 2)
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Square button (left) - equivalent to X/Square
  ctx.beginPath()
  ctx.arc(faceButtonCenterX - faceButtonOffset, faceButtonCenterY, faceButtonRadius, 0, Math.PI * 2)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[2]?.pressed ? "#3b82f6" : "#9c44e9"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Draw square symbol
  ctx.beginPath()
  ctx.rect(faceButtonCenterX - faceButtonOffset - 7 * scale, faceButtonCenterY - 7 * scale, 14 * scale, 14 * scale)
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Triangle button (top) - equivalent to Y/Triangle
  ctx.beginPath()
  ctx.arc(faceButtonCenterX, faceButtonCenterY - faceButtonOffset, faceButtonRadius, 0, Math.PI * 2)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[3]?.pressed ? "#3b82f6" : "#4fe944"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Draw triangle symbol
  ctx.beginPath()
  ctx.moveTo(faceButtonCenterX, faceButtonCenterY - faceButtonOffset - 7 * scale)
  ctx.lineTo(faceButtonCenterX + 8 * scale, faceButtonCenterY - faceButtonOffset + 5 * scale)
  ctx.lineTo(faceButtonCenterX - 8 * scale, faceButtonCenterY - faceButtonOffset + 5 * scale)
  ctx.closePath()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Draw bumpers and triggers with better spacing
  const bumperWidth = 60 * scale
  const bumperHeight = 20 * scale
  const triggerWidth = 40 * scale
  const triggerHeight = 25 * scale
  const bumperY = 40 * scale
  const triggerY = 15 * scale

  // Left bumper (L1)
  ctx.beginPath()
  ctx.rect(50 * scale, bumperY, bumperWidth, bumperHeight)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[4]?.pressed ? "#3b82f6" : "#444"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Draw "L1" text
  ctx.fillStyle = "#fff"
  ctx.font = `${10 * scale}px Arial`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("L1", (50 + bumperWidth / 2) * scale, (bumperY + bumperHeight / 2))

  // Right bumper (R1)
  ctx.beginPath()
  ctx.rect(290 * scale, bumperY, bumperWidth, bumperHeight)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[5]?.pressed ? "#3b82f6" : "#444"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Draw "R1" text
  ctx.fillStyle = "#fff"
  ctx.fillText("R1", (290 + bumperWidth / 2) * scale, (bumperY + bumperHeight / 2))

  // Left trigger (L2)
  ctx.beginPath()
  ctx.rect(60 * scale, triggerY, triggerWidth, triggerHeight)
  
  if (gamepadState.connected) {
    // Apply trigger calibration
    const leftTriggerValue = gamepadState.buttons[6]?.value || 0
    let calibratedTrigger = leftTriggerValue
    if (leftTriggerValue > calibrationData.deadZones.triggers) {
      calibratedTrigger = 
        (leftTriggerValue - calibrationData.deadZones.triggers) / 
        (1 - calibrationData.deadZones.triggers) * 
        calibrationData.sensitivity.triggers
    } else {
      calibratedTrigger = 0
    }
    
    // Create gradient based on trigger pressure
    const gradient = ctx.createLinearGradient(
      60 * scale,
      triggerY,
      (60 + triggerWidth) * scale,
      triggerY
    )
    gradient.addColorStop(0, "#444")
    gradient.addColorStop(calibratedTrigger, "#3b82f6")
    gradient.addColorStop(calibratedTrigger, "#444")
    gradient.addColorStop(1, "#444")
    ctx.fillStyle = gradient
  } else {
    ctx.fillStyle = "#444"
  }
  
    ctx.fill()
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 2 * scale
    ctx.stroke()
  
  // Draw "L2" text
  ctx.fillStyle = "#fff"
  ctx.fillText("L2", (60 + triggerWidth / 2) * scale, (triggerY + triggerHeight / 2))

  // Right trigger (R2)
  ctx.beginPath()
  ctx.rect(300 * scale, triggerY, triggerWidth, triggerHeight)
  
  if (gamepadState.connected) {
    // Apply trigger calibration
    const rightTriggerValue = gamepadState.buttons[7]?.value || 0
    let calibratedTrigger = rightTriggerValue
    if (rightTriggerValue > calibrationData.deadZones.triggers) {
      calibratedTrigger = 
        (rightTriggerValue - calibrationData.deadZones.triggers) / 
        (1 - calibrationData.deadZones.triggers) * 
        calibrationData.sensitivity.triggers
    } else {
      calibratedTrigger = 0
    }
    
    // Create gradient based on trigger pressure
    const gradient = ctx.createLinearGradient(
      300 * scale,
      triggerY,
      (300 + triggerWidth) * scale,
      triggerY
    )
    gradient.addColorStop(0, "#444")
    gradient.addColorStop(calibratedTrigger, "#3b82f6")
    gradient.addColorStop(calibratedTrigger, "#444")
    gradient.addColorStop(1, "#444")
    ctx.fillStyle = gradient
  } else {
    ctx.fillStyle = "#444"
  }
  
    ctx.fill()
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 2 * scale
    ctx.stroke()
  
  // Draw "R2" text
  ctx.fillStyle = "#fff"
  ctx.fillText("R2", (300 + triggerWidth / 2) * scale, (triggerY + triggerHeight / 2))

  // Draw center buttons (Share, Options, PS)
  const centerButtonWidth = 25 * scale
  const centerButtonHeight = 15 * scale
  const centerButtonY = 140 * scale // Adjusted position
  const centerButtonSpacing = 15 * scale

  // Share button (left)
  ctx.beginPath()
  ctx.ellipse(
    200 * scale - centerButtonSpacing - centerButtonWidth / 2,
    centerButtonY,
    centerButtonWidth / 2,
    centerButtonHeight / 2,
    0,
    0,
    Math.PI * 2
  )
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[8]?.pressed ? "#3b82f6" : "#444"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Draw "SHARE" text
  ctx.fillStyle = "#fff"
  ctx.font = `${6 * scale}px Arial`
  ctx.fillText("SHARE", 200 * scale - centerButtonSpacing - centerButtonWidth / 2, centerButtonY)

  // Options button (right)
  ctx.beginPath()
  ctx.ellipse(
    200 * scale + centerButtonSpacing + centerButtonWidth / 2,
    centerButtonY,
    centerButtonWidth / 2,
    centerButtonHeight / 2,
    0,
    0,
    Math.PI * 2
  )
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[9]?.pressed ? "#3b82f6" : "#444"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Draw "OPTIONS" text
  ctx.fillText("OPTIONS", 200 * scale + centerButtonSpacing + centerButtonWidth / 2, centerButtonY)

  // PS button (center)
  ctx.beginPath()
  ctx.arc(200 * scale, centerButtonY + 35 * scale, 15 * scale, 0, Math.PI * 2)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[16]?.pressed ? "#3b82f6" : "#444"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Draw "PS" text
  ctx.fillStyle = "#fff"
  ctx.font = `${10 * scale}px Arial`
  ctx.fillText("PS", 200 * scale, centerButtonY + 35 * scale)

  ctx.restore()
}
