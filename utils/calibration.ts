// Apply calibration to raw gamepad values
export function applyCalibration(value: number, deadZone: number, sensitivity: number, invert: boolean): number {
  // Apply dead zone
  let result = 0

  if (Math.abs(value) > deadZone) {
    // Scale the value to account for the dead zone
    result = (Math.abs(value) - deadZone) / (1 - deadZone)
    result *= Math.sign(value)

    // Clamp to -1 to 1
    result = Math.max(-1, Math.min(1, result))
  }

  // Apply sensitivity
  result *= sensitivity

  // Apply inversion
  if (invert) {
    result = -result
  }

  return result
}

// Apply calibration to a pair of axis values (like a joystick)
export function applyStickCalibration(
  x: number,
  y: number,
  deadZone: number,
  sensitivity: number,
  invertX: boolean,
  invertY: boolean,
): [number, number] {
  // Calculate the magnitude of the stick position
  const magnitude = Math.sqrt(x * x + y * y)

  if (magnitude < deadZone) {
    // Within dead zone, return zero
    return [0, 0]
  }

  // Calculate the normalized direction
  const normalizedX = x / magnitude
  const normalizedY = y / magnitude

  // Scale the magnitude accounting for the dead zone
  const normalizedMagnitude = Math.min(1, (magnitude - deadZone) / (1 - deadZone))

  // Apply the normalized magnitude to get the calibrated position
  let calibratedX = normalizedX * normalizedMagnitude * sensitivity
  let calibratedY = normalizedY * normalizedMagnitude * sensitivity

  // Apply inversion
  if (invertX) calibratedX = -calibratedX
  if (invertY) calibratedY = -calibratedY

  return [calibratedX, calibratedY]
}
