"use client";

import { useState, useEffect } from "react";
import { Plus, X, ChevronRight } from "lucide-react";
import BottomNavigation from "../../components/BottomNavigation";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    type: "personal",
    deadline: "",
    progress: 0,
  });
  const [timePhase, setTimePhase] = useState("midday");
  const [themeColors, setThemeColors] = useState({
    bg: "#FAFAF7",
    text: "#2B2B2B",
    textSecondary: "#6B6B6B",
    accent: "#8FA6B8",
    surface: "#FFFFFF",
  });

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

  // Load goals from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("goals");
    if (stored) {
      setGoals(JSON.parse(stored));
    }
  }, []);

  const saveGoals = (updatedGoals) => {
    localStorage.setItem("goals", JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  };

  const addGoal = () => {
    if (!newGoal.title) return;

    const goal = {
      id: Date.now(),
      ...newGoal,
      createdAt: new Date().toISOString(),
    };

    saveGoals([...goals, goal]);
    setNewGoal({ title: "", type: "personal", deadline: "", progress: 0 });
    setShowAddGoal(false);
  };

  const updateProgress = (goalId, newProgress) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === goalId ? { ...goal, progress: newProgress } : goal,
    );
    saveGoals(updatedGoals);
  };

  const goalTypes = {
    personal: { label: "Personal", color: "#9CAF88" },
    projects: { label: "Projects", color: "#8FA6B8" },
    learning: { label: "Learning", color: "#C7A89B" },
    business: { label: "Business", color: "#D8CFC4" },
  };

  const activeGoals = goals.filter((g) => g.progress < 100);
  const completedGoals = goals.filter((g) => g.progress === 100);

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
              Goals
            </h1>
            <button
              onClick={() => setShowAddGoal(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-70"
              style={{ backgroundColor: themeColors.accent }}
            >
              <Plus size={20} style={{ color: themeColors.surface }} />
            </button>
          </div>

          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <div className="mb-8">
              <p
                className="text-sm mb-4 transition-colors duration-[2400000]"
                style={{ color: themeColors.textSecondary }}
              >
                Active Goals
              </p>
              <div className="space-y-3">
                {activeGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="rounded-2xl p-6 transition-colors duration-[2400000]"
                    style={{ backgroundColor: themeColors.surface }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3
                          className="font-medium mb-1 transition-colors duration-[2400000]"
                          style={{ color: themeColors.text }}
                        >
                          {goal.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              backgroundColor:
                                goalTypes[goal.type].color + "20",
                              color: goalTypes[goal.type].color,
                            }}
                          >
                            {goalTypes[goal.type].label}
                          </span>
                          {goal.deadline && (
                            <span
                              className="text-xs transition-colors duration-[2400000]"
                              style={{ color: themeColors.textSecondary }}
                            >
                              Due {new Date(goal.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="transition-opacity duration-200 hover:opacity-70">
                        <ChevronRight
                          size={20}
                          style={{ color: themeColors.textSecondary }}
                        />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm transition-colors duration-[2400000]"
                          style={{ color: themeColors.textSecondary }}
                        >
                          Progress
                        </span>
                        <span
                          className="text-sm font-medium transition-colors duration-[2400000]"
                          style={{ color: themeColors.text }}
                        >
                          {goal.progress}%
                        </span>
                      </div>
                      <div
                        className="h-2 rounded-full overflow-hidden transition-colors duration-[2400000]"
                        style={{ backgroundColor: themeColors.bg }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${goal.progress}%`,
                            backgroundColor: goalTypes[goal.type].color,
                          }}
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) =>
                          updateProgress(goal.id, parseInt(e.target.value))
                        }
                        className="w-full mt-2"
                        style={{ accentColor: goalTypes[goal.type].color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div>
              <p
                className="text-sm mb-4 transition-colors duration-[2400000]"
                style={{ color: themeColors.textSecondary }}
              >
                Completed
              </p>
              <div className="space-y-3">
                {completedGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="rounded-2xl p-6 transition-colors duration-[2400000]"
                    style={{
                      backgroundColor: themeColors.surface,
                      opacity: 0.7,
                    }}
                  >
                    <h3
                      className="font-medium mb-1 transition-colors duration-[2400000]"
                      style={{ color: themeColors.text }}
                    >
                      {goal.title}
                    </h3>
                    <span
                      className="text-xs px-2 py-1 rounded-full inline-block"
                      style={{
                        backgroundColor: goalTypes[goal.type].color + "20",
                        color: goalTypes[goal.type].color,
                      }}
                    >
                      {goalTypes[goal.type].label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {goals.length === 0 && (
            <div
              className="rounded-2xl p-12 text-center transition-colors duration-[2400000]"
              style={{ backgroundColor: themeColors.surface }}
            >
              <p
                className="transition-colors duration-[2400000]"
                style={{ color: themeColors.textSecondary }}
              >
                No goals yet. Create one to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
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
                New Goal
              </h2>
              <button
                onClick={() => {
                  setShowAddGoal(false);
                  setNewGoal({
                    title: "",
                    type: "personal",
                    deadline: "",
                    progress: 0,
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
                  Goal Title
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, title: e.target.value })
                  }
                  placeholder="What do you want to achieve?"
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
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(goalTypes).map(([key, { label, color }]) => (
                    <button
                      key={key}
                      onClick={() => setNewGoal({ ...newGoal, type: key })}
                      className="px-4 py-3 rounded-xl transition-all duration-200"
                      style={{
                        backgroundColor:
                          newGoal.type === key ? color : themeColors.bg,
                        color:
                          newGoal.type === key ? "#FFFFFF" : themeColors.text,
                        border: `1px solid ${newGoal.type === key ? color : timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className="text-sm mb-2 block transition-colors duration-[2400000]"
                  style={{ color: themeColors.textSecondary }}
                >
                  Deadline (optional)
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, deadline: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl outline-none transition-colors duration-[2400000]"
                  style={{
                    backgroundColor: themeColors.bg,
                    color: themeColors.text,
                    border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                  }}
                />
              </div>

              <button
                onClick={addGoal}
                disabled={!newGoal.title}
                className="w-full py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: themeColors.accent,
                  color: themeColors.surface,
                }}
              >
                Create Goal
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
