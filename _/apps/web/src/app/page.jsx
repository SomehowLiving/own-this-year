"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Target, BookOpen, Timer } from "lucide-react";
import { registerServiceWorker } from "./register-sw";
import BottomNavigation from "../components/BottomNavigation";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyIntention, setDailyIntention] = useState("");
  const [isEditingIntention, setIsEditingIntention] = useState(false);
  const [timePhase, setTimePhase] = useState("midday");
  const [themeColors, setThemeColors] = useState({
    bg: "#FAFAF7",
    text: "#2B2B2B",
    textSecondary: "#6B6B6B",
    accent: "#8FA6B8",
    surface: "#FFFFFF",
  });

  // Register service worker on mount
  useEffect(() => {
    registerServiceWorker();
  }, []);

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
    const interval = setInterval(updateTimePhase, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load daily intention from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(`intention_${today}`);
    if (stored) {
      setDailyIntention(stored);
    }
  }, []);

  // Calculate time stats
  const getTodayTotal = () => {
    const timeEntries = JSON.parse(
      localStorage.getItem("time_entries") || "[]",
    );
    const activeTimer = localStorage.getItem("active_timer");

    const today = new Date().toDateString();
    const todayEntries = timeEntries.filter((e) => {
      const entryDate = new Date(e.endTime).toDateString();
      return entryDate === today;
    });
    const total = todayEntries.reduce((sum, e) => sum + e.duration, 0);

    let activeSeconds = 0;
    if (activeTimer) {
      const timer = JSON.parse(activeTimer);
      const startTime = new Date(timer.startTime);
      const now = new Date();
      activeSeconds = Math.floor((now - startTime) / 1000);
    }

    const totalSeconds = total + activeSeconds;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getWeekTotal = () => {
    const timeEntries = JSON.parse(
      localStorage.getItem("time_entries") || "[]",
    );
    const activeTimer = localStorage.getItem("active_timer");

    const now = new Date();
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay(),
    );
    const weekEntries = timeEntries.filter((e) => {
      const entryDate = new Date(e.endTime);
      return entryDate >= weekStart;
    });
    const total = weekEntries.reduce((sum, e) => sum + e.duration, 0);

    let activeSeconds = 0;
    if (activeTimer) {
      const timer = JSON.parse(activeTimer);
      const startTime = new Date(timer.startTime);
      const now = new Date();
      activeSeconds = Math.floor((now - startTime) / 1000);
    }

    const totalSeconds = total + activeSeconds;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getActiveGoals = () => {
    const goals = JSON.parse(localStorage.getItem("goals") || "[]");
    return goals.filter((g) => g.progress < 100);
  };

  const saveDailyIntention = (value) => {
    const today = new Date().toDateString();
    localStorage.setItem(`intention_${today}`, value);
    setDailyIntention(value);
  };

  const formatDate = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayName = days[currentTime.getDay()];
    const monthName = months[currentTime.getMonth()];
    const date = currentTime.getDate();

    let phaseLabel = "";
    if (timePhase === "morning") phaseLabel = "Morning";
    else if (timePhase === "evening") phaseLabel = "Evening";
    else if (timePhase === "night") phaseLabel = "Night";

    return phaseLabel
      ? `${dayName} · ${monthName} ${date} · ${phaseLabel}`
      : `${dayName} · ${monthName} ${date}`;
  };

  return (
    <div
      className="min-h-screen transition-colors duration-[2400000]"
      style={{ backgroundColor: themeColors.bg }}
    >
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <p
            className="text-sm mb-1 transition-colors duration-[2400000]"
            style={{ color: themeColors.textSecondary }}
          >
            {formatDate()}
          </p>
          <h1
            className="text-3xl font-semibold transition-colors duration-[2400000]"
            style={{ color: themeColors.text }}
          >
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Daily Intention */}
          <div
            className="rounded-2xl p-6 transition-colors duration-[2400000]"
            style={{ backgroundColor: themeColors.surface }}
          >
            <p
              className="text-sm mb-2 transition-colors duration-[2400000]"
              style={{ color: themeColors.textSecondary }}
            >
              Today's Intention
            </p>
            {isEditingIntention ? (
              <input
                type="text"
                value={dailyIntention}
                onChange={(e) => setDailyIntention(e.target.value)}
                onBlur={() => {
                  saveDailyIntention(dailyIntention);
                  setIsEditingIntention(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    saveDailyIntention(dailyIntention);
                    setIsEditingIntention(false);
                  }
                }}
                autoFocus
                placeholder="What matters most today?"
                className="w-full text-lg outline-none transition-colors duration-[2400000]"
                style={{
                  backgroundColor: "transparent",
                  color: themeColors.text,
                }}
              />
            ) : (
              <p
                onClick={() => setIsEditingIntention(true)}
                className="text-lg cursor-pointer transition-colors duration-[2400000]"
                style={{
                  color: dailyIntention
                    ? themeColors.text
                    : themeColors.textSecondary,
                }}
              >
                {dailyIntention || "Set your intention for today"}
              </p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="rounded-2xl p-6 transition-colors duration-[2400000]"
              style={{ backgroundColor: themeColors.surface }}
            >
              <p
                className="text-sm mb-1 transition-colors duration-[2400000]"
                style={{ color: themeColors.textSecondary }}
              >
                Today
              </p>
              <p
                className="text-2xl font-semibold transition-colors duration-[2400000]"
                style={{ color: themeColors.text }}
              >
                {getTodayTotal()}
              </p>
              <p
                className="text-xs mt-1 transition-colors duration-[2400000]"
                style={{ color: themeColors.textSecondary }}
              >
                Time tracked
              </p>
            </div>

            <div
              className="rounded-2xl p-6 transition-colors duration-[2400000]"
              style={{ backgroundColor: themeColors.surface }}
            >
              <p
                className="text-sm mb-1 transition-colors duration-[2400000]"
                style={{ color: themeColors.textSecondary }}
              >
                This Week
              </p>
              <p
                className="text-2xl font-semibold transition-colors duration-[2400000]"
                style={{ color: themeColors.text }}
              >
                {getWeekTotal()}
              </p>
              <p
                className="text-xs mt-1 transition-colors duration-[2400000]"
                style={{ color: themeColors.textSecondary }}
              >
                Total hours
              </p>
            </div>
          </div>

          {/* Active Goals */}
          <div
            className="rounded-2xl p-6 transition-colors duration-[2400000]"
            style={{ backgroundColor: themeColors.surface }}
          >
            <p
              className="text-sm mb-4 transition-colors duration-[2400000]"
              style={{ color: themeColors.textSecondary }}
            >
              Active Goals
            </p>
            <p
              className="text-sm transition-colors duration-[2400000]"
              style={{ color: themeColors.textSecondary }}
            >
              {getActiveGoals().length} active goals
            </p>
          </div>

          {/* Pomodoro Status */}
          <div
            className="rounded-2xl p-6 transition-colors duration-[2400000]"
            style={{ backgroundColor: themeColors.surface }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm mb-1 transition-colors duration-[2400000]"
                  style={{ color: themeColors.textSecondary }}
                >
                  Focus Session
                </p>
                <p
                  className="text-lg transition-colors duration-[2400000]"
                  style={{ color: themeColors.text }}
                >
                  Ready to begin
                </p>
              </div>
              <button
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
                style={{ backgroundColor: themeColors.accent }}
              >
                <Timer size={20} style={{ color: themeColors.surface }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
