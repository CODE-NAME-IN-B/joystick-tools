import { LatencyTest } from "@/components/tests/LatencyTest"
import { AnalogCalibration } from "@/components/tests/AnalogCalibration"
import { TriggerPrecision } from "@/components/tests/TriggerPrecision"
import { VibrationTest } from "@/components/tests/VibrationTest"
import { CalibrationWizard } from "@/components/tests/CalibrationWizard"
import { AutoCalibration } from "@/components/tests/AutoCalibration"

// ... existing button definitions ...
              <button
                onClick={() => setActiveModule("calibration")}
                className={`px-4 py-2 rounded-md mx-2 whitespace-nowrap ${
                  activeModule === "calibration" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                {t.testing.wizard}
              </button>
              <button
                onClick={() => setActiveModule("auto-calibration")}
                className={`px-4 py-2 rounded-md mx-2 whitespace-nowrap ${
                  activeModule === "auto-calibration" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                {currentLanguage === 'en' ? 'Auto Calibration' : 'المعايرة التلقائية'}
              </button>
// ... existing code ...

{/* ... existing active module conditions ... */}
                  {activeModule === "calibration" && (
                    <CalibrationWizard
                      gamepadState={gamepadState}
                      calibrationData={calibrationData}
                      setCalibrationData={setCalibrationData}
                    />
                  )}
                  {activeModule === "auto-calibration" && (
                    <AutoCalibration
                      gamepadState={gamepadState}
                      calibrationData={calibrationData}
                      setCalibrationData={setCalibrationData}
                    />
                  )}
// ... existing code ... 