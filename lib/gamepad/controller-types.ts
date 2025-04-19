// Define controller types
export type ControllerType = "xbox" | "playstation" | "generic"

// Button mappings for different controller types
export type ButtonMappings = {
  [key: number]: {
    xbox: string
    playstation: string
    generic: string
  }
}

// Button mappings (index to button name)
export const buttonMappings: ButtonMappings = {
  0: { xbox: "A", playstation: "×", generic: "A" },
  1: { xbox: "B", playstation: "○", generic: "B" },
  2: { xbox: "X", playstation: "□", generic: "X" },
  3: { xbox: "Y", playstation: "△", generic: "Y" },
  4: { xbox: "LB", playstation: "L1", generic: "LB" },
  5: { xbox: "RB", playstation: "R1", generic: "RB" },
  6: { xbox: "LT", playstation: "L2", generic: "LT" },
  7: { xbox: "RT", playstation: "R2", generic: "RT" },
  8: { xbox: "Back", playstation: "Share", generic: "Select" },
  9: { xbox: "Start", playstation: "Options", generic: "Start" },
  10: { xbox: "LS", playstation: "L3", generic: "LS" },
  11: { xbox: "RS", playstation: "R3", generic: "RS" },
  12: { xbox: "Up", playstation: "Up", generic: "Up" },
  13: { xbox: "Down", playstation: "Down", generic: "Down" },
  14: { xbox: "Left", playstation: "Left", generic: "Left" },
  15: { xbox: "Right", playstation: "Right", generic: "Right" },
  16: { xbox: "Guide", playstation: "PS", generic: "Home" },
}

// Function to detect controller type based on gamepad ID
export function detectControllerType(gamepadId: string): ControllerType {
  const lowerCaseId = gamepadId.toLowerCase()

  if (lowerCaseId.includes("xbox") || lowerCaseId.includes("microsoft")) {
    return "xbox"
  } else if (
    lowerCaseId.includes("playstation") ||
    lowerCaseId.includes("sony") ||
    lowerCaseId.includes("dualshock") ||
    lowerCaseId.includes("dualsense")
  ) {
    return "playstation"
  } else {
    return "generic"
  }
}

// Get button label based on controller type and button index
export function getButtonLabel(buttonIndex: number, controllerType: ControllerType): string {
  const mapping = buttonMappings[buttonIndex]
  if (!mapping) {
    return `Button ${buttonIndex}`
  }

  return mapping[controllerType]
}
