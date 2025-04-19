import type { GamepadState, CalibrationData } from "@/hooks/useGamepadService"
import { applyStickCalibration } from "./calibration"

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
  const controllerHeight = 250 * scale

  // Draw controller body
  ctx.save()
  ctx.translate(centerX - controllerWidth / 2, centerY - controllerHeight / 2)

  // Draw controller base
  ctx.beginPath()
  ctx.moveTo(100 * scale, 50 * scale)
  ctx.bezierCurveTo(50 * scale, 50 * scale, 20 * scale, 100 * scale, 20 * scale, 125 * scale)
  ctx.lineTo(20 * scale, 175 * scale)
  ctx.bezierCurveTo(20 * scale, 200 * scale, 50 * scale, 250 * scale, 100 * scale, 250 * scale)
  ctx.lineTo(300 * scale, 250 * scale)
  ctx.bezierCurveTo(350 * scale, 250 * scale, 380 * scale, 200 * scale, 380 * scale, 175 * scale)
  ctx.lineTo(380 * scale, 125 * scale)
  ctx.bezierCurveTo(380 * scale, 100 * scale, 350 * scale, 50 * scale, 300 * scale, 50 * scale)
  ctx.closePath()

  // Fill controller body
  ctx.fillStyle = gamepadState.connected ? "#333" : "#666"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Draw left analog stick
  const leftStickX = 100 * scale
  const leftStickY = 125 * scale
  const stickRadius = 20 * scale

  // Draw stick base
  ctx.beginPath()
  ctx.arc(leftStickX, leftStickY, stickRadius + 5 * scale, 0, Math.PI * 2)
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
  const rightStickY = 125 * scale

  // Draw stick base
  ctx.beginPath()
  ctx.arc(rightStickX, rightStickY, stickRadius + 5 * scale, 0, Math.PI * 2)
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
  const dpadY = 200 * scale
  const dpadSize = 15 * scale

  // D-pad base
  ctx.beginPath()
  ctx.arc(dpadX, dpadY, dpadSize + 10 * scale, 0, Math.PI * 2)
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

  // Draw face buttons (A, B, X, Y)
  const faceButtonRadius = 15 * scale
  const faceButtonCenterX = 300 * scale
  const faceButtonCenterY = 175 * scale
  const faceButtonOffset = 25 * scale

  // A button (bottom)
  ctx.beginPath()
  ctx.arc(faceButtonCenterX, faceButtonCenterY + faceButtonOffset, faceButtonRadius, 0, Math.PI * 2)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[0]?.pressed ? "#3b82f6" : "#0f0"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // B button (right)
  ctx.beginPath()
  ctx.arc(faceButtonCenterX + faceButtonOffset, faceButtonCenterY, faceButtonRadius, 0, Math.PI * 2)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[1]?.pressed ? "#3b82f6" : "#f00"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // X button (left)
  ctx.beginPath()
  ctx.arc(faceButtonCenterX - faceButtonOffset, faceButtonCenterY, faceButtonRadius, 0, Math.PI * 2)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[2]?.pressed ? "#3b82f6" : "#00f"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Y button (top)
  ctx.beginPath()
  ctx.arc(faceButtonCenterX, faceButtonCenterY - faceButtonOffset, faceButtonRadius, 0, Math.PI * 2)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[3]?.pressed ? "#3b82f6" : "#ff0"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Draw bumpers and triggers
  const bumperWidth = 60 * scale
  const bumperHeight = 20 * scale

  // Left bumper (LB)
  ctx.beginPath()
  ctx.rect(50 * scale, 30 * scale, bumperWidth, bumperHeight)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[4]?.pressed ? "#3b82f6" : "#555"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Right bumper (RB)
  ctx.beginPath()
  ctx.rect(290 * scale, 30 * scale, bumperWidth, bumperHeight)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[5]?.pressed ? "#3b82f6" : "#555"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Left trigger (LT)
  if (gamepadState.connected) {
    const leftTriggerValue = gamepadState.buttons[6]?.value || 0
    const triggerHeight = bumperHeight * (0.5 + leftTriggerValue * 1.5)

    ctx.beginPath()
    ctx.rect(50 * scale, 10 * scale - triggerHeight, bumperWidth, triggerHeight)
    ctx.fillStyle = leftTriggerValue > 0 ? "#3b82f6" : "#555"
    ctx.fill()
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 2 * scale
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.rect(50 * scale, 0, bumperWidth, bumperHeight)
    ctx.fillStyle = "#555"
    ctx.fill()
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 2 * scale
    ctx.stroke()
  }

  // Right trigger (RT)
  if (gamepadState.connected) {
    const rightTriggerValue = gamepadState.buttons[7]?.value || 0
    const triggerHeight = bumperHeight * (0.5 + rightTriggerValue * 1.5)

    ctx.beginPath()
    ctx.rect(290 * scale, 10 * scale - triggerHeight, bumperWidth, triggerHeight)
    ctx.fillStyle = rightTriggerValue > 0 ? "#3b82f6" : "#555"
    ctx.fill()
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 2 * scale
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.rect(290 * scale, 0, bumperWidth, bumperHeight)
    ctx.fillStyle = "#555"
    ctx.fill()
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 2 * scale
    ctx.stroke()
  }

  // Draw center buttons (Back, Guide, Start)
  const centerButtonY = 125 * scale
  const centerButtonWidth = 25 * scale
  const centerButtonHeight = 15 * scale

  // Back/Select/View button
  ctx.beginPath()
  ctx.ellipse(160 * scale, centerButtonY, centerButtonWidth / 2, centerButtonHeight / 2, 0, 0, Math.PI * 2)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[8]?.pressed ? "#3b82f6" : "#555"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Guide/Home/Xbox button
  ctx.beginPath()
  ctx.arc(200 * scale, centerButtonY, 18 * scale, 0, Math.PI * 2)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[16]?.pressed ? "#3b82f6" : "#555"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Start/Menu button
  ctx.beginPath()
  ctx.ellipse(240 * scale, centerButtonY, centerButtonWidth / 2, centerButtonHeight / 2, 0, 0, Math.PI * 2)
  ctx.fillStyle = gamepadState.connected && gamepadState.buttons[9]?.pressed ? "#3b82f6" : "#555"
  ctx.fill()
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  ctx.restore()
}
