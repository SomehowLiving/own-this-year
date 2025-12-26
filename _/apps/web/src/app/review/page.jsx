"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import BottomNavigation from "../../components/BottomNavigation";

export default function ReviewPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [reviews, setReviews] = useState({});
  const [currentReview, setCurrentReview] = useState({
    wentWell: "",
    didntGoWell: "",
    reflection: "",
    focus: "",
    energy: {},
    mood: {},
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

  // Load reviews
  useEffect(() => {
    const stored = localStorage.getItem("monthly_reviews");
    if (stored) {
      const allReviews = JSON.parse(stored);
      setReviews(allReviews);

      const monthKey = getMonthKey(currentMonth);
      if (allReviews[monthKey]) {
        setCurrentReview(allReviews[monthKey]);
      } else {
        setCurrentReview({
          wentWell: "",
          didntGoWell: "",
          reflection: "",
          focus: "",
          energy: {},
          mood: {},
        });
      }
    }
  }, [currentMonth]);

  const getMonthKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  };

  const formatMonthYear = () => {
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
    return `${months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const saveReview = () => {
    const monthKey = getMonthKey(currentMonth);
    const updatedReviews = {
      ...reviews,
      [monthKey]: currentReview,
    };
    localStorage.setItem("monthly_reviews", JSON.stringify(updatedReviews));
    setReviews(updatedReviews);
  };

  const logDailyMood = (mood) => {
    const today = new Date().toDateString();
    setCurrentReview({
      ...currentReview,
      mood: {
        ...currentReview.mood,
        [today]: mood,
      },
    });
  };

  const logDailyEnergy = (energy) => {
    const today = new Date().toDateString();
    setCurrentReview({
      ...currentReview,
      energy: {
        ...currentReview.energy,
        [today]: energy,
      },
    });
  };

  const moods = ["😊", "🙂", "😐", "😔", "😫"];
  const energyLevels = [1, 2, 3, 4, 5];

  const today = new Date().toDateString();
  const todayMood = currentReview.mood[today];
  const todayEnergy = currentReview.energy[today];

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
              Review
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={previousMonth}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-70"
                style={{ backgroundColor: themeColors.surface }}
              >
                <ChevronLeft size={20} style={{ color: themeColors.text }} />
              </button>
              <span
                className="text-sm px-4 transition-colors duration-[2400000]"
                style={{ color: themeColors.text }}
              >
                {formatMonthYear()}
              </span>
              <button
                onClick={nextMonth}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-70"
                style={{ backgroundColor: themeColors.surface }}
              >
                <ChevronRight size={20} style={{ color: themeColors.text }} />
              </button>
            </div>
          </div>

          {/* Daily Tracking */}
          <div className="space-y-4 mb-6">
            <div
              className="rounded-2xl p-6 transition-colors duration-[2400000]"
              style={{ backgroundColor: themeColors.surface }}
            >
              <p
                className="text-sm mb-4 transition-colors duration-[2400000]"
                style={{ color: themeColors.textSecondary }}
              >
                How are you feeling today?
              </p>
              <div className="flex gap-3">
                {moods.map((mood, index) => (
                  <button
                    key={index}
                    onClick={() => logDailyMood(mood)}
                    className="w-14 h-14 rounded-xl text-2xl transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor:
                        todayMood === mood
                          ? themeColors.accent + "30"
                          : themeColors.bg,
                      border: `2px solid ${todayMood === mood ? themeColors.accent : "transparent"}`,
                    }}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl p-6 transition-colors duration-[2400000]"
              style={{ backgroundColor: themeColors.surface }}
            >
              <p
                className="text-sm mb-4 transition-colors duration-[2400000]"
                style={{ color: themeColors.textSecondary }}
              >
                Energy Level (1 = low, 5 = high)
              </p>
              <div className="flex gap-3">
                {energyLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => logDailyEnergy(level)}
                    className="w-14 h-14 rounded-xl font-semibold transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor:
                        todayEnergy === level
                          ? themeColors.accent
                          : themeColors.bg,
                      color:
                        todayEnergy === level
                          ? themeColors.surface
                          : themeColors.text,
                      border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Reflection */}
          <div className="space-y-4">
            <div
              className="rounded-2xl p-6 transition-colors duration-[2400000]"
              style={{ backgroundColor: themeColors.surface }}
            >
              <label
                className="text-sm mb-3 block transition-colors duration-[2400000]"
                style={{ color: themeColors.textSecondary }}
              >
                What went well this month?
              </label>
              <textarea
                value={currentReview.wentWell}
                onChange={(e) =>
                  setCurrentReview({
                    ...currentReview,
                    wentWell: e.target.value,
                  })
                }
                placeholder="Celebrate the wins..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl outline-none resize-none transition-colors duration-[2400000]"
                style={{
                  backgroundColor: themeColors.bg,
                  color: themeColors.text,
                  border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                }}
              />
            </div>

            <div
              className="rounded-2xl p-6 transition-colors duration-[2400000]"
              style={{ backgroundColor: themeColors.surface }}
            >
              <label
                className="text-sm mb-3 block transition-colors duration-[2400000]"
                style={{ color: themeColors.textSecondary }}
              >
                What didn't go well?
              </label>
              <textarea
                value={currentReview.didntGoWell}
                onChange={(e) =>
                  setCurrentReview({
                    ...currentReview,
                    didntGoWell: e.target.value,
                  })
                }
                placeholder="Observe without judgment..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl outline-none resize-none transition-colors duration-[2400000]"
                style={{
                  backgroundColor: themeColors.bg,
                  color: themeColors.text,
                  border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                }}
              />
            </div>

            <div
              className="rounded-2xl p-6 transition-colors duration-[2400000]"
              style={{ backgroundColor: themeColors.surface }}
            >
              <label
                className="text-sm mb-3 block transition-colors duration-[2400000]"
                style={{ color: themeColors.textSecondary }}
              >
                One sentence reflection
              </label>
              <input
                type="text"
                value={currentReview.reflection}
                onChange={(e) =>
                  setCurrentReview({
                    ...currentReview,
                    reflection: e.target.value,
                  })
                }
                placeholder="What did this month teach you?"
                className="w-full px-4 py-3 rounded-xl outline-none transition-colors duration-[2400000]"
                style={{
                  backgroundColor: themeColors.bg,
                  color: themeColors.text,
                  border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                }}
              />
            </div>

            <div
              className="rounded-2xl p-6 transition-colors duration-[2400000]"
              style={{ backgroundColor: themeColors.surface }}
            >
              <label
                className="text-sm mb-3 block transition-colors duration-[2400000]"
                style={{ color: themeColors.textSecondary }}
              >
                Focus for next month
              </label>
              <input
                type="text"
                value={currentReview.focus}
                onChange={(e) =>
                  setCurrentReview({ ...currentReview, focus: e.target.value })
                }
                placeholder="One theme or intention..."
                className="w-full px-4 py-3 rounded-xl outline-none transition-colors duration-[2400000]"
                style={{
                  backgroundColor: themeColors.bg,
                  color: themeColors.text,
                  border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                }}
              />
            </div>

            <button
              onClick={saveReview}
              className="w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                backgroundColor: themeColors.accent,
                color: themeColors.surface,
              }}
            >
              <Save size={18} />
              Save Review
            </button>
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
      `}</style>
    </div>
  );
}
