"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Plus, X } from "lucide-react";
import BottomNavigation from "../../components/BottomNavigation";

export default function TimeTrackingPage() {
  const [timeEntries, setTimeEntries] = useState([]);
  const [activeTimer, setActiveTimer] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    description: "",
    category: "work",
    goalId: "",
    startTime: "",
    endTime: "",
  });
  const [goals, setGoals] = useState([]);
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

  // Load time entries and goals
  useEffect(() => {
    const stored = localStorage.getItem("time_entries");
    if (stored) {
      setTimeEntries(JSON.parse(stored));
    }

    const storedGoals = localStorage.getItem("goals");
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }

    const storedActiveTimer = localStorage.getItem("active_timer");
    if (storedActiveTimer) {
      const timer = JSON.parse(storedActiveTimer);
      setActiveTimer(timer);
      const startTime = new Date(timer.startTime);
      const now = new Date();
      setElapsedSeconds(Math.floor((now - startTime) / 1000));
    }
  }, []);

  // Active timer logic
  useEffect(() => {
    if (activeTimer) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
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
  }, [activeTimer]);

  const saveTimeEntries = (entries) => {
    localStorage.setItem("time_entries", JSON.stringify(entries));
    setTimeEntries(entries);
  };

  const startTimer = () => {
    const timer = {
      startTime: new Date().toISOString(),
      description: "",
      category: "work",
      goalId: "",
    };
    setActiveTimer(timer);
    setElapsedSeconds(0);
    localStorage.setItem("active_timer", JSON.stringify(timer));
  };

  const stopTimer = () => {
    if (!activeTimer) return;

    const entry = {
      id: Date.now(),
      description: activeTimer.description || "Work session",
      category: activeTimer.category,
      goalId: activeTimer.goalId,
      startTime: activeTimer.startTime,
      endTime: new Date().toISOString(),
      duration: elapsedSeconds,
    };

    // Save to time entries
    saveTimeEntries([entry, ...timeEntries]);

    // Auto-log to activity
    const activities = JSON.parse(localStorage.getItem("activity_log") || "[]");
    const activityEntry = {
      id: Date.now() + 1,
      description: `${entry.description} (${formatDuration(entry.duration)})`,
      tags: [entry.category],
      timestamp: entry.endTime,
    };
    localStorage.setItem(
      "activity_log",
      JSON.stringify([activityEntry, ...activities]),
    );

    setActiveTimer(null);
    setElapsedSeconds(0);
    localStorage.removeItem("active_timer");
  };

  const addManualEntry = () => {
    if (
      !manualEntry.description ||
      !manualEntry.startTime ||
      !manualEntry.endTime
    )
      return;

    const start = new Date(manualEntry.startTime);
    const end = new Date(manualEntry.endTime);
    const duration = Math.floor((end - start) / 1000);

    const entry = {
      id: Date.now(),
      description: manualEntry.description,
      category: manualEntry.category,
      goalId: manualEntry.goalId,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      duration: duration,
    };

    saveTimeEntries([entry, ...timeEntries]);

    // Auto-log to activity
    const activities = JSON.parse(localStorage.getItem("activity_log") || "[]");
    const activityEntry = {
      id: Date.now() + 1,
      description: `${entry.description} (${formatDuration(entry.duration)})`,
      tags: [entry.category],
      timestamp: entry.endTime,
    };
    localStorage.setItem(
      "activity_log",
      JSON.stringify([activityEntry, ...activities]),
    );

    setManualEntry({
      description: "",
      category: "work",
      goalId: "",
      startTime: "",
      endTime: "",
    });
    setShowManualEntry(false);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getTodayTotal = () => {
    const today = new Date().toDateString();
    const todayEntries = timeEntries.filter((e) => {
      const entryDate = new Date(e.endTime).toDateString();
      return entryDate === today;
    });
    const total = todayEntries.reduce((sum, e) => sum + e.duration, 0);
    return formatDuration(total + (activeTimer ? elapsedSeconds : 0));
  };

  const getWeekTotal = () => {
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
    return formatDuration(total + (activeTimer ? elapsedSeconds : 0));
  };

  const categoryColors = {
    work: "#8FA6B8",
    learning: "#C7A89B",
    personal: "#9CAF88",
    health: "#D8CFC4",
  };

  return (
    <div
      className="min-h-screen transition-colors duration-[2400000]"
      style={{ backgroundColor: themeColors.bg }}
    >
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-2xl font-semibold mb-6 transition-colors duration-[2400000]"
            style={{ color: themeColors.text }}
          >
            Time Tracking
          </h1>

          {/* Active Timer */}
          <div
            className="rounded-2xl p-6 mb-4 transition-colors duration-[2400000]"
            style={{ backgroundColor: themeColors.surface }}
          >
            {activeTimer ? (
              <div>
                <p
                  className="text-sm mb-3 transition-colors duration-[2400000]"
                  style={{ color: themeColors.textSecondary }}
                >
                  Timer Running
                </p>
                <div
                  className="text-4xl font-semibold mb-4 transition-colors duration-[2400000]"
                  style={{ color: themeColors.text }}
                >
                  {formatDuration(elapsedSeconds)}
                </div>
                <input
                  type="text"
                  value={activeTimer.description}
                  onChange={(e) => {
                    const updated = {
                      ...activeTimer,
                      description: e.target.value,
                    };
                    setActiveTimer(updated);
                    localStorage.setItem(
                      "active_timer",
                      JSON.stringify(updated),
                    );
                  }}
                  placeholder="What are you working on?"
                  className="w-full px-4 py-3 rounded-xl outline-none mb-3 transition-colors duration-[2400000]"
                  style={{
                    backgroundColor: themeColors.bg,
                    color: themeColors.text,
                    border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                  }}
                />
                <button
                  onClick={stopTimer}
                  className="w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: themeColors.accent,
                    color: themeColors.surface,
                  }}
                >
                  <Pause size={18} />
                  Stop Timer
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p
                  className="text-sm mb-4 transition-colors duration-[2400000]"
                  style={{ color: themeColors.textSecondary }}
                >
                  No timer running
                </p>
                <button
                  onClick={startTimer}
                  className="w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: themeColors.accent,
                    color: themeColors.surface,
                  }}
                >
                  <Play size={18} />
                  Start Timer
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
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
            </div>
          </div>

          {/* Manual Entry Button */}
          <button
            onClick={() => setShowManualEntry(true)}
            className="w-full py-3 rounded-xl font-medium mb-6 transition-all duration-200"
            style={{
              backgroundColor: themeColors.surface,
              color: themeColors.text,
              border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
            }}
          >
            <Plus size={18} className="inline mr-2" />
            Add Manual Entry
          </button>

          {/* Recent Entries */}
          <div>
            <p
              className="text-sm mb-4 transition-colors duration-[2400000]"
              style={{ color: themeColors.textSecondary }}
            >
              Recent Entries
            </p>
            <div className="space-y-3">
              {timeEntries.slice(0, 10).map((entry) => {
                const goal = goals.find((g) => g.id === parseInt(entry.goalId));
                return (
                  <div
                    key={entry.id}
                    className="rounded-xl p-4 transition-colors duration-[2400000]"
                    style={{ backgroundColor: themeColors.surface }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p
                        className="font-medium transition-colors duration-[2400000]"
                        style={{ color: themeColors.text }}
                      >
                        {entry.description}
                      </p>
                      <p
                        className="text-sm font-semibold transition-colors duration-[2400000]"
                        style={{ color: themeColors.text }}
                      >
                        {formatDuration(entry.duration)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            categoryColors[entry.category] + "20",
                          color: categoryColors[entry.category],
                        }}
                      >
                        {entry.category}
                      </span>
                      {goal && (
                        <span
                          className="text-xs transition-colors duration-[2400000]"
                          style={{ color: themeColors.textSecondary }}
                        >
                          → {goal.title}
                        </span>
                      )}
                      <span
                        className="text-xs ml-auto transition-colors duration-[2400000]"
                        style={{ color: themeColors.textSecondary }}
                      >
                        {new Date(entry.endTime).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}

              {timeEntries.length === 0 && (
                <div
                  className="rounded-2xl p-12 text-center transition-colors duration-[2400000]"
                  style={{ backgroundColor: themeColors.surface }}
                >
                  <p
                    className="transition-colors duration-[2400000]"
                    style={{ color: themeColors.textSecondary }}
                  >
                    No time entries yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showManualEntry && (
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
                Add Time Entry
              </h2>
              <button
                onClick={() => {
                  setShowManualEntry(false);
                  setManualEntry({
                    description: "",
                    category: "work",
                    goalId: "",
                    startTime: "",
                    endTime: "",
                  });
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-70"
                style={{ backgroundColor: themeColors.bg }}
              >
                <X size={16} style={{ color: themeColors.text }} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="text-sm mb-2 block transition-colors duration-[2400000]"
                  style={{ color: themeColors.textSecondary }}
                >
                  Description
                </label>
                <input
                  type="text"
                  value={manualEntry.description}
                  onChange={(e) =>
                    setManualEntry({
                      ...manualEntry,
                      description: e.target.value,
                    })
                  }
                  placeholder="What did you work on?"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-colors duration-[2400000]"
                  style={{
                    backgroundColor: themeColors.bg,
                    color: themeColors.text,
                    border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="text-sm mb-2 block transition-colors duration-[2400000]"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={manualEntry.startTime}
                    onChange={(e) =>
                      setManualEntry({
                        ...manualEntry,
                        startTime: e.target.value,
                      })
                    }
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
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={manualEntry.endTime}
                    onChange={(e) =>
                      setManualEntry({
                        ...manualEntry,
                        endTime: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl outline-none transition-colors duration-[2400000]"
                    style={{
                      backgroundColor: themeColors.bg,
                      color: themeColors.text,
                      border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  className="text-sm mb-2 block transition-colors duration-[2400000]"
                  style={{ color: themeColors.textSecondary }}
                >
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(categoryColors).map((cat) => (
                    <button
                      key={cat}
                      onClick={() =>
                        setManualEntry({ ...manualEntry, category: cat })
                      }
                      className="px-4 py-3 rounded-xl capitalize transition-all duration-200"
                      style={{
                        backgroundColor:
                          manualEntry.category === cat
                            ? categoryColors[cat]
                            : themeColors.bg,
                        color:
                          manualEntry.category === cat
                            ? "#FFFFFF"
                            : themeColors.text,
                        border: `1px solid ${manualEntry.category === cat ? categoryColors[cat] : timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className="text-sm mb-2 block transition-colors duration-[2400000]"
                  style={{ color: themeColors.textSecondary }}
                >
                  Link to Goal (optional)
                </label>
                <select
                  value={manualEntry.goalId}
                  onChange={(e) =>
                    setManualEntry({ ...manualEntry, goalId: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl outline-none transition-colors duration-[2400000]"
                  style={{
                    backgroundColor: themeColors.bg,
                    color: themeColors.text,
                    border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                  }}
                >
                  <option value="">No goal</option>
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={addManualEntry}
                disabled={
                  !manualEntry.description ||
                  !manualEntry.startTime ||
                  !manualEntry.endTime
                }
                className="w-full py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: themeColors.accent,
                  color: themeColors.surface,
                }}
              >
                Add Entry
              </button>
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
