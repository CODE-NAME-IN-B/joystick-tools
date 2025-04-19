// Define the structure of our translations
export type Translation = {
  general: {
    appTitle: string
    noGamepad: string
    connected: string
    notConnected: string
  }
  controlPanel: {
    title: string
    calibration: string
    resetCalibration: string
    testVibration: string
    connectionStatus: string
  }
  visualization: {
    title: string
    noGamepadDetected: string
  }
  dataVisualization: {
    title: string
    inputLog: string
    buttonCounter: string
    axisGraph: string
    deviceInfo: string
    clear: string
    noInputEvents: string
    pressed: string
    released: string
  }
  tabs: {
    visualization: string
    testing: string
  }
  testing: {
    title: string
    latency: string
    analog: string
    triggers: string
    vibration: string
    wizard: string
    connectGamepad: string
  }
  latencyTest: {
    title: string
    startTest: string
    getReady: string
    pressButton: string
    nextButton: string
    results: string
    test: string
    average: string
    description: string
  }
  analogCalibration: {
    title: string
    leftStick: string
    rightStick: string
    deadZone: string
    sensitivity: string
    invertAxes: string
    invertX: string
    invertY: string
    description: string
  }
  triggerPrecision: {
    title: string
    leftTrigger: string
    rightTrigger: string
    targetValue: string
    currentValue: string
    target: string
    precisionScore: string
    pullAndHold: string
    description: string
  }
  vibrationTest: {
    title: string
    notSupported: string
    controllerNoSupport: string
    constant: string
    pulse: string
    rampUp: string
    weakRumble: string
    strongRumble: string
    duration: string
    testVibration: string
    stop: string
    description: string
  }
  calibrationWizard: {
    title: string
    step: string
    of: string
    previous: string
    next: string
    startCollecting: string
    collectAgain: string
    finish: string
    connectController: string
    steps: {
      introduction: {
        title: string
        description: string
      }
      leftStick: {
        title: string
        description: string
      }
      rightStick: {
        title: string
        description: string
      }
      triggers: {
        title: string
        description: string
      }
      complete: {
        title: string
        description: string
      }
    }
  }
  gamepadType: {
    xbox: string
    playstation: string
    generic: string
    detected: string
  }
  language: {
    english: string
    arabic: string
  }
  direction: "ltr" | "rtl"
}

// English translations
export const en: Translation = {
  general: {
    appTitle: "Gamepad Tester",
    noGamepad: "No gamepad detected",
    connected: "Connected",
    notConnected: "Not connected",
  },
  controlPanel: {
    title: "Control Panel",
    calibration: "Calibration",
    resetCalibration: "Reset Calibration",
    testVibration: "Test Vibration",
    connectionStatus: "Connection Status",
  },
  visualization: {
    title: "Controller Visualization",
    noGamepadDetected: "No gamepad detected. Connect a controller and press any button.",
  },
  dataVisualization: {
    title: "Data Visualization",
    inputLog: "Input Log",
    buttonCounter: "Button Counter",
    axisGraph: "Axis Graph",
    deviceInfo: "Device Info",
    clear: "Clear",
    noInputEvents: "No input events recorded. Press buttons or move sticks to see events.",
    pressed: "Pressed",
    released: "Released",
  },
  tabs: {
    visualization: "Visualization",
    testing: "Testing",
  },
  testing: {
    title: "Testing Modules",
    latency: "Latency",
    analog: "Analog",
    triggers: "Triggers",
    vibration: "Vibration",
    wizard: "Wizard",
    connectGamepad: "Connect a gamepad to use the testing modules",
  },
  latencyTest: {
    title: "Button Response Latency Test",
    startTest: "Start Test",
    getReady: "Get ready...",
    pressButton: "Press this button now!",
    nextButton: "Get ready for next button...",
    results: "Results",
    test: "Test",
    average: "Average",
    description:
      "This test measures how quickly you can respond to on-screen button prompts. Press the indicated button as soon as you see it appear.",
  },
  analogCalibration: {
    title: "Analog Stick Calibration",
    leftStick: "Left Stick",
    rightStick: "Right Stick",
    deadZone: "Dead Zone",
    sensitivity: "Sensitivity",
    invertAxes: "Invert Axes",
    invertX: "Invert X-Axis",
    invertY: "Invert Y-Axis",
    description:
      "Move the analog stick to see its position. Adjust the dead zone to eliminate drift when the stick is at rest. Increase sensitivity for more responsive control or decrease it for more precision.",
  },
  triggerPrecision: {
    title: "Trigger Precision Test",
    leftTrigger: "Left Trigger (LT)",
    rightTrigger: "Right Trigger (RT)",
    targetValue: "Target Value",
    currentValue: "Current Value",
    target: "Target",
    precisionScore: "Precision Score",
    pullAndHold: "Pull and hold trigger",
    description:
      "This test measures how precisely you can hold a trigger at a specific position. Try to hold the trigger at exactly the target value for the highest precision score.",
  },
  vibrationTest: {
    title: "Vibration Test",
    notSupported: "Vibration not supported",
    controllerNoSupport: "Your controller does not support vibration or is not connected.",
    constant: "Constant",
    pulse: "Pulse",
    rampUp: "Ramp Up",
    weakRumble: "Weak Rumble",
    strongRumble: "Strong Rumble",
    duration: "Duration",
    testVibration: "Test Vibration",
    stop: "Stop",
    description:
      "Test your controller's vibration capabilities. Adjust the intensity and duration to find the right feedback for your game. The weak rumble uses high-frequency motors, while the strong rumble uses low-frequency motors.",
  },
  calibrationWizard: {
    title: "Calibration Wizard",
    step: "Step",
    of: "of",
    previous: "Previous",
    next: "Next",
    startCollecting: "Start Collecting",
    collectAgain: "Collect Again",
    finish: "Finish",
    connectController: "Please connect a controller to use the calibration wizard.",
    steps: {
      introduction: {
        title: "Introduction",
        description: "This wizard will help you calibrate your controller for optimal performance.",
      },
      leftStick: {
        title: "Left Stick",
        description: "Move the left stick in a full circle, reaching the edges of its range.",
      },
      rightStick: {
        title: "Right Stick",
        description: "Move the right stick in a full circle, reaching the edges of its range.",
      },
      triggers: {
        title: "Triggers",
        description: "Press and release both triggers several times, fully pressing them each time.",
      },
      complete: {
        title: "Complete",
        description: "Calibration complete! Your controller is now optimized for better performance.",
      },
    },
  },
  gamepadType: {
    xbox: "Xbox Controller",
    playstation: "PlayStation Controller",
    generic: "Generic Controller",
    detected: "Detected:",
  },
  language: {
    english: "English",
    arabic: "العربية",
  },
  direction: "ltr",
}

// Arabic translations
export const ar: Translation = {
  general: {
    appTitle: "اختبار وحدة التحكم",
    noGamepad: "لم يتم اكتشاف وحدة تحكم",
    connected: "متصل",
    notConnected: "غير متصل",
  },
  controlPanel: {
    title: "لوحة التحكم",
    calibration: "المعايرة",
    resetCalibration: "إعادة ضبط المعايرة",
    testVibration: "اختبار الاهتزاز",
    connectionStatus: "حالة الاتصال",
  },
  visualization: {
    title: "تصور وحدة التحكم",
    noGamepadDetected: "لم يتم اكتشاف وحدة تحكم. قم بتوصيل وحدة تحكم واضغط على أي زر.",
  },
  dataVisualization: {
    title: "تصور البيانات",
    inputLog: "سجل الإدخال",
    buttonCounter: "عداد الأزرار",
    axisGraph: "رسم المحاور",
    deviceInfo: "معلومات الجهاز",
    clear: "مسح",
    noInputEvents: "لم يتم تسجيل أحداث إدخال. اضغط على الأزرار أو حرك العصي لرؤية الأحداث.",
    pressed: "مضغوط",
    released: "محرر",
  },
  tabs: {
    visualization: "التصور",
    testing: "الاختبار",
  },
  testing: {
    title: "وحدات الاختبار",
    latency: "زمن الاستجابة",
    analog: "تناظري",
    triggers: "الزناد",
    vibration: "الاهتزاز",
    wizard: "المعالج",
    connectGamepad: "قم بتوصيل وحدة تحكم لاستخدام وحدات الاختبار",
  },
  latencyTest: {
    title: "اختبار زمن استجابة الزر",
    startTest: "بدء الاختبار",
    getReady: "استعد...",
    pressButton: "اضغط على هذا الزر الآن!",
    nextButton: "استعد للزر التالي...",
    results: "النتائج",
    test: "اختبار",
    average: "المتوسط",
    description:
      "يقيس هذا الاختبار مدى سرعة استجابتك لمطالبات الأزرار على الشاشة. اضغط على الزر المشار إليه بمجرد ظهوره.",
  },
  analogCalibration: {
    title: "معايرة العصا التناظرية",
    leftStick: "العصا اليسرى",
    rightStick: "العصا اليمنى",
    deadZone: "المنطقة الميتة",
    sensitivity: "الحساسية",
    invertAxes: "عكس المحاور",
    invertX: "عكس محور X",
    invertY: "عكس محور Y",
    description:
      "حرك العصا التناظرية لرؤية موضعها. اضبط المنطقة الميتة للقضاء على الانجراف عندما تكون العصا في وضع الراحة. زيادة الحساسية للتحكم الأكثر استجابة أو تقليلها لمزيد من الدقة.",
  },
  triggerPrecision: {
    title: "اختبار دقة الزناد",
    leftTrigger: "الزناد الأيسر (LT)",
    rightTrigger: "الزناد الأيمن (RT)",
    targetValue: "القيمة المستهدفة",
    currentValue: "القيمة الحالية",
    target: "الهدف",
    precisionScore: "درجة الدقة",
    pullAndHold: "اسحب وامسك الزناد",
    description:
      "يقيس هذا الاختبار مدى دقة إمساكك للزناد في موضع محدد. حاول إمساك الزناد بالضبط عند القيمة المستهدفة للحصول على أعلى درجة دقة.",
  },
  vibrationTest: {
    title: "اختبار الاهتزاز",
    notSupported: "الاهتزاز غير مدعوم",
    controllerNoSupport: "وحدة التحكم الخاصة بك لا تدعم الاهتزاز أو غير متصلة.",
    constant: "ثابت",
    pulse: "نبض",
    rampUp: "تصاعد",
    weakRumble: "اهتزاز ضعيف",
    strongRumble: "اهتزاز قوي",
    duration: "المدة",
    testVibration: "اختبار الاهتزاز",
    stop: "إيقاف",
    description:
      "اختبر قدرات الاهتزاز في وحدة التحكم الخاصة بك. اضبط الشدة والمدة للعثور على التغذية الراجعة المناسبة للعبتك. يستخدم الاهتزاز الضعيف محركات عالية التردد، بينما يستخدم الاهتزاز القوي محركات منخفضة التردد.",
  },
  calibrationWizard: {
    title: "معالج المعايرة",
    step: "خطوة",
    of: "من",
    previous: "السابق",
    next: "التالي",
    startCollecting: "بدء التجميع",
    collectAgain: "تجميع مرة أخرى",
    finish: "إنهاء",
    connectController: "يرجى توصيل وحدة تحكم لاستخدام معالج المعايرة.",
    steps: {
      introduction: {
        title: "مقدمة",
        description: "سيساعدك هذا المعالج على معايرة وحدة التحكم الخاصة بك للحصول على أداء مثالي.",
      },
      leftStick: {
        title: "العصا اليسرى",
        description: "حرك العصا اليسرى في دائرة كاملة، للوصول إلى حواف نطاقها.",
      },
      rightStick: {
        title: "العصا اليمنى",
        description: "حرك العصا اليمنى في دائرة كاملة، للوصول إلى حواف نطاقها.",
      },
      triggers: {
        title: "الزناد",
        description: "اضغط وحرر كلا الزنادين عدة مرات، مع الضغط عليهما بالكامل في كل مرة.",
      },
      complete: {
        title: "اكتمال",
        description: "اكتملت المعايرة! تم الآن تحسين وحدة التحكم الخاصة بك للحصول على أداء أفضل.",
      },
    },
  },
  gamepadType: {
    xbox: "وحدة تحكم إكس بوكس",
    playstation: "وحدة تحكم بلاي ستيشن",
    generic: "وحدة تحكم عامة",
    detected: "تم اكتشاف:",
  },
  language: {
    english: "English",
    arabic: "العربية",
  },
  direction: "rtl",
}

// Export all translations
export const translations = {
  en,
  ar,
}

// Export supported languages
export type SupportedLanguage = keyof typeof translations
