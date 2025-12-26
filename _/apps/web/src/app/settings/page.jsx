"use client";

import { useState, useEffect } from "react";
import { Download, Upload, Trash2 } from "lucide-react";
import BottomNavigation from "../../components/BottomNavigation";

export default function SettingsPage() {
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

  const exportData = () => {
    const data = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      data: {
        intentions: {},
        calendar_events: JSON.parse(
          localStorage.getItem("calendar_events") || "[]",
        ),
        activity_log: JSON.parse(localStorage.getItem("activity_log") || "[]"),
        goals: JSON.parse(localStorage.getItem("goals") || "[]"),
        projects: JSON.parse(localStorage.getItem("projects") || "[]"),
        time_entries: JSON.parse(localStorage.getItem("time_entries") || "[]"),
        monthly_reviews: JSON.parse(
          localStorage.getItem("monthly_reviews") || "{}",
        ),
        journal_entries: JSON.parse(
          localStorage.getItem("journal_entries") || "[]",
        ),
      },
    };

    // Collect all daily intentions
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("intention_")) {
        data.data.intentions[key] = localStorage.getItem(key);
      }
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `personal-os-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result);

        if (confirm("This will replace all current data. Continue?")) {
          // Restore all data
          Object.entries(imported.data).forEach(([key, value]) => {
            if (key === "intentions") {
              Object.entries(value).forEach(
                ([intentionKey, intentionValue]) => {
                  localStorage.setItem(intentionKey, intentionValue);
                },
              );
            } else {
              localStorage.setItem(key, JSON.stringify(value));
            }
          });

          alert("Data imported successfully. Refreshing...");
          window.location.reload();
        }
      } catch (error) {
        console.error(error);
        alert("Failed to import data. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (
      confirm(
        "This will permanently delete ALL your data. This cannot be undone. Continue?",
      )
    ) {
      if (
        confirm("Are you absolutely sure? This is your last chance to back up.")
      ) {
        localStorage.clear();
        alert("All data cleared. Refreshing...");
        window.location.reload();
      }
    }
  };

  const getDataSize = () => {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        total += localStorage.getItem(key)?.length || 0;
      }
    }
    return (total / 1024).toFixed(2);
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
            Settings
          </h1>

          {/* Data Management */}
          <div className="space-y-4">
            <div
              className="rounded-2xl p-6 transition-colors duration-[2400000]"
              style={{ backgroundColor: themeColors.surface }}
            >
              <h2
                className="text-lg font-medium mb-4 transition-colors duration-[2400000]"
                style={{ color: themeColors.text }}
              >
                Data Management
              </h2>

              <div className="space-y-3">
                <div
                  className="p-4 rounded-xl transition-colors duration-[2400000]"
                  style={{ backgroundColor: themeColors.bg }}
                >
                  <p
                    className="text-sm mb-1 transition-colors duration-[2400000]"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Current Storage
                  </p>
                  <p
                    className="text-lg font-semibold transition-colors duration-[2400000]"
                    style={{ color: themeColors.text }}
                  >
                    {getDataSize()} KB
                  </p>
                </div>

                <button
                  onClick={exportData}
                  className="w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: themeColors.accent,
                    color: themeColors.surface,
                  }}
                >
                  <Download size={18} />
                  Export All Data (JSON)
                </button>

                <label
                  className="w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  style={{
                    backgroundColor: themeColors.bg,
                    color: themeColors.text,
                    border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                  }}
                >
                  <Upload size={18} />
                  Import Data
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={clearAllData}
                  className="w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "#EF444420",
                    color: "#EF4444",
                    border: "1px solid #EF444440",
                  }}
                >
                  <Trash2 size={18} />
                  Clear All Data
                </button>
              </div>
            </div>

            {/* About */}
            <div
              className="rounded-2xl p-6 transition-colors duration-[2400000]"
              style={{ backgroundColor: themeColors.surface }}
            >
              <h2
                className="text-lg font-medium mb-4 transition-colors duration-[2400000]"
                style={{ color: themeColors.text }}
              >
                About
              </h2>

              <div className="space-y-3">
                <div>
                  <p
                    className="text-sm transition-colors duration-[2400000]"
                    style={{ color: themeColors.textSecondary }}
                  >
                    This is your personal operating system. Everything stays on
                    your device. No accounts. No cloud. No tracking.
                  </p>
                </div>

                <div>
                  <p
                    className="text-sm font-medium mb-1 transition-colors duration-[2400000]"
                    style={{ color: themeColors.text }}
                  >
                    Data Storage
                  </p>
                  <p
                    className="text-sm transition-colors duration-[2400000]"
                    style={{ color: themeColors.textSecondary }}
                  >
                    All data is stored locally in your browser using
                    localStorage. It persists across sessions but will be lost
                    if you clear browser data.
                  </p>
                </div>

                <div>
                  <p
                    className="text-sm font-medium mb-1 transition-colors duration-[2400000]"
                    style={{ color: themeColors.text }}
                  >
                    Privacy
                  </p>
                  <p
                    className="text-sm transition-colors duration-[2400000]"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Nothing leaves your device. This is completely private and
                    offline-first.
                  </p>
                </div>

                <div>
                  <p
                    className="text-sm font-medium mb-1 transition-colors duration-[2400000]"
                    style={{ color: themeColors.text }}
                  >
                    Backup Recommendation
                  </p>
                  <p
                    className="text-sm transition-colors duration-[2400000]"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Export your data weekly to keep a backup. Save the JSON file
                    somewhere safe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
