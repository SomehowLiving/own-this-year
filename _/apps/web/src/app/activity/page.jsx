"use client";

import { useState, useEffect } from "react";
import { Plus, Search, X } from "lucide-react";
import BottomNavigation from "../../components/BottomNavigation";

export default function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({ description: "", tags: "" });
  const [searchQuery, setSearchQuery] = useState("");
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

  // Load activities from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("activity_log");
    if (stored) {
      setActivities(JSON.parse(stored));
    }
  }, []);

  const saveActivities = (updatedActivities) => {
    localStorage.setItem("activity_log", JSON.stringify(updatedActivities));
    setActivities(updatedActivities);
  };

  const addActivity = () => {
    if (!newActivity.description) return;

    const activity = {
      id: Date.now(),
      description: newActivity.description,
      tags: newActivity.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      timestamp: new Date().toISOString(),
    };

    saveActivities([activity, ...activities]);
    setNewActivity({ description: "", tags: "" });
    setShowAddActivity(false);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const activityDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (activityDate.getTime() === today.getTime()) {
      return `Today · ${time}`;
    } else if (activityDate.getTime() === today.getTime() - 86400000) {
      return `Yesterday · ${time}`;
    } else {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return `${days[date.getDay()]} · ${time}`;
    }
  };

  const filteredActivities = activities.filter((activity) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      activity.description.toLowerCase().includes(query) ||
      activity.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

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
              Activity Log
            </h1>
            <button
              onClick={() => setShowAddActivity(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-70"
              style={{ backgroundColor: themeColors.accent }}
            >
              <Plus size={20} style={{ color: themeColors.surface }} />
            </button>
          </div>

          {/* Search */}
          <div
            className="rounded-xl px-4 py-3 flex items-center gap-3 mb-6 transition-colors duration-[2400000]"
            style={{
              backgroundColor: themeColors.surface,
              border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
            }}
          >
            <Search size={18} style={{ color: themeColors.textSecondary }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities or tags..."
              className="flex-1 outline-none transition-colors duration-[2400000]"
              style={{
                backgroundColor: "transparent",
                color: themeColors.text,
              }}
            />
          </div>

          {/* Activities List */}
          <div className="space-y-3">
            {filteredActivities.length === 0 ? (
              <div
                className="rounded-2xl p-12 text-center transition-colors duration-[2400000]"
                style={{ backgroundColor: themeColors.surface }}
              >
                <p
                  className="transition-colors duration-[2400000]"
                  style={{ color: themeColors.textSecondary }}
                >
                  {searchQuery
                    ? "No activities found"
                    : "No activities logged yet"}
                </p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-xl p-4 transition-colors duration-[2400000]"
                  style={{ backgroundColor: themeColors.surface }}
                >
                  <p
                    className="text-sm mb-2 transition-colors duration-[2400000]"
                    style={{ color: themeColors.textSecondary }}
                  >
                    {formatTimestamp(activity.timestamp)}
                  </p>
                  <p
                    className="mb-3 transition-colors duration-[2400000]"
                    style={{ color: themeColors.text }}
                  >
                    {activity.description}
                  </p>
                  {activity.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {activity.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-xs transition-colors duration-[2400000]"
                          style={{
                            backgroundColor: themeColors.bg,
                            color: themeColors.textSecondary,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Activity Modal */}
      {showAddActivity && (
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
                Log Activity
              </h2>
              <button
                onClick={() => {
                  setShowAddActivity(false);
                  setNewActivity({ description: "", tags: "" });
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
                  What did you do?
                </label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe your activity..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl outline-none resize-none transition-colors duration-[2400000]"
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
                  Tags (optional, comma-separated)
                </label>
                <input
                  type="text"
                  value={newActivity.tags}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, tags: e.target.value })
                  }
                  placeholder="work, learning, personal"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-colors duration-[2400000]"
                  style={{
                    backgroundColor: themeColors.bg,
                    color: themeColors.text,
                    border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                  }}
                />
              </div>

              <button
                onClick={addActivity}
                disabled={!newActivity.description}
                className="w-full py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: themeColors.accent,
                  color: themeColors.surface,
                }}
              >
                Log Activity
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
