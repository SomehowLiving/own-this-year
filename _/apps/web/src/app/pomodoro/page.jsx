"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import BottomNavigation from "../../components/BottomNavigation";

export default function PomodoroPage() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [isBreak, setIsBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [timePhase, setTimePhase] = useState("midday");
  const [themeColors, setThemeColors] = useState({
    bg: "#FAFAF7",
    text: "#2B2B2B",
    textSecondary: "#6B6B6B",
    accent: "#8FA6B8",
    surface: "#FFFFFF",
  });

  const intervalRef = useRef(null);

  // Time phase detection
  useEffect(() => {
    const updateTimePhase = () => {
      const hour = new Date().getHours();
      let phase = "midday";
      let colors = {
        bg: "#FAFAF7",
        text: "#2B2B2B",
        textSecondary: "#6B6B6B",
        accent: "#8FA6B8",
        surface: "#FFFFFF",
      };

      if (hour >= 5 && hour < 9.5) {
        phase = "morning";
        colors = {
          bg: "#FBFAF6",
          text: "#2B2B2B",
          textSecondary: "#6B6B6B",
          accent: "#9CAF88",
          surface: "#FFFFFF",
        };
      } else if (hour >= 16.5 && hour < 21) {
        phase = "evening";
        colors = {
          bg: "#F4F1EC",
          text: "#2B2B2B",
          textSecondary: "#6B6B6B",
          accent: "#C7A89B",
          surface: "#FAF9F7",
        };
      } else if (hour >= 21 || hour < 5) {
        phase = "night";
        colors = {
          bg: "#1F1F1C",
          text: "#E7E6E2",
          textSecondary: "#A8A7A3",
          accent: "#8FA6B8",
          surface: "#2A2A27",
        };
      }

      setTimePhase(phase);
      setThemeColors(colors);
    };

    updateTimePhase();
    const interval = setInterval(updateTimePhase, 60000);
    return () => clearInterval(interval);
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer complete
            setIsRunning(false);
            if (isBreak) {
              setIsBreak(false);
              setMinutes(workDuration);
            } else {
              setIsBreak(true);
              setMinutes(breakDuration);
            }
            setSeconds(0);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, minutes, seconds, isBreak, workDuration, breakDuration]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setMinutes(workDuration);
    setSeconds(0);
  };

  const progress = isBreak
    ? ((breakDuration * 60 - (minutes * 60 + seconds)) / (breakDuration * 60)) *
      100
    : ((workDuration * 60 - (minutes * 60 + seconds)) / (workDuration * 60)) *
      100;

  return (
    <div
      className="min-h-screen transition-colors duration-[2400000]"
      style={{ backgroundColor: themeColors.bg }}
    >
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1
              className="text-2xl font-semibold transition-colors duration-[2400000]"
              style={{ color: themeColors.text }}
            >
              Focus Session
            </h1>
            <button
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-70"
              style={{ backgroundColor: themeColors.surface }}
            >
              <Settings size={20} style={{ color: themeColors.text }} />
            </button>
          </div>

          {/* Timer Display */}
          <div
            className="rounded-2xl p-12 text-center transition-colors duration-[2400000]"
            style={{ backgroundColor: themeColors.surface }}
          >
            <p
              className="text-sm mb-4 transition-colors duration-[2400000]"
              style={{ color: themeColors.textSecondary }}
            >
              {isBreak ? "Rest Time" : "Focus Time"}
            </p>

            <div
              className="text-7xl font-semibold mb-8 transition-colors duration-[2400000]"
              style={{ color: themeColors.text }}
            >
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </div>

            {/* Progress Circle */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke={themeColors.bg}
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke={themeColors.accent}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                  className="transition-all duration-300"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={resetTimer}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-70"
                style={{ backgroundColor: themeColors.bg }}
              >
                <RotateCcw size={20} style={{ color: themeColors.text }} />
              </button>

              <button
                onClick={toggleTimer}
                className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: themeColors.accent }}
              >
                {isRunning ? (
                  <Pause size={28} style={{ color: themeColors.surface }} />
                ) : (
                  <Play
                    size={28}
                    style={{ color: themeColors.surface, marginLeft: "4px" }}
                  />
                )}
              </button>

              <div className="w-14" />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center p-6 z-50">
          <div
            className="w-full max-w-md rounded-2xl p-6 transition-colors duration-[2400000]"
            style={{ backgroundColor: themeColors.surface }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-semibold transition-colors duration-[2400000]"
                style={{ color: themeColors.text }}
              >
                Timer Settings
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-70"
                style={{ backgroundColor: themeColors.bg }}
              >
                <Settings size={16} style={{ color: themeColors.text }} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  className="text-sm mb-2 block transition-colors duration-[2400000]"
                  style={{ color: themeColors.textSecondary }}
                >
                  Focus Duration (minutes)
                </label>
                <input
                  type="number"
                  value={workDuration}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setWorkDuration(val);
                    if (!isRunning && !isBreak) {
                      setMinutes(val);
                    }
                  }}
                  min="1"
                  max="60"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-colors duration-[2400000]"
                  style={{
                    backgroundColor: themeColors.bg,
                    color: themeColors.text,
                    border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                  }}
                />
              </div>

              <div>
                <label
                  className="text-sm mb-2 block transition-colors duration-[2400000]"
                  style={{ color: themeColors.textSecondary }}
                >
                  Rest Duration (minutes)
                </label>
                <input
                  type="number"
                  value={breakDuration}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setBreakDuration(val);
                    if (!isRunning && isBreak) {
                      setMinutes(val);
                    }
                  }}
                  min="1"
                  max="30"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-colors duration-[2400000]"
                  style={{
                    backgroundColor: themeColors.bg,
                    color: themeColors.text,
                    border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>
    </div>
  );
}
