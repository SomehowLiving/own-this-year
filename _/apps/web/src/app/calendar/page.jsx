"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import BottomNavigation from "../../components/BottomNavigation";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    category: "personal",
    time: "",
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

  // Load events from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("calendar_events");
    if (stored) {
      setEvents(JSON.parse(stored));
    }
  }, []);

  const saveEvents = (updatedEvents) => {
    localStorage.setItem("calendar_events", JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
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
    return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const handleDayClick = (date) => {
    if (date) {
      setSelectedDate(date);
      setShowAddEvent(true);
    }
  };

  const addEvent = () => {
    if (!newEvent.title || !selectedDate) return;

    const event = {
      id: Date.now(),
      date: selectedDate.toDateString(),
      title: newEvent.title,
      category: newEvent.category,
      time: newEvent.time,
    };

    saveEvents([...events, event]);
    setNewEvent({ title: "", category: "personal", time: "" });
    setShowAddEvent(false);
    setSelectedDate(null);
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter((e) => e.date === date.toDateString());
  };

  const categoryColors = {
    personal: "#9CAF88",
    work: "#8FA6B8",
    learning: "#C7A89B",
    health: "#D8CFC4",
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date().toDateString();

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
              {formatMonthYear()}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={previousMonth}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-70"
                style={{ backgroundColor: themeColors.surface }}
              >
                <ChevronLeft size={20} style={{ color: themeColors.text }} />
              </button>
              <button
                onClick={nextMonth}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-70"
                style={{ backgroundColor: themeColors.surface }}
              >
                <ChevronRight size={20} style={{ color: themeColors.text }} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div
            className="rounded-2xl p-6 transition-colors duration-[2400000]"
            style={{ backgroundColor: themeColors.surface }}
          >
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium transition-colors duration-[2400000]"
                  style={{ color: themeColors.textSecondary }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((date, index) => {
                const dayEvents = date ? getEventsForDate(date) : [];
                const isToday = date && date.toDateString() === today;

                return (
                  <button
                    key={index}
                    onClick={() => handleDayClick(date)}
                    disabled={!date}
                    className="aspect-square rounded-xl p-2 transition-all duration-200 hover:opacity-70 disabled:opacity-0"
                    style={{
                      backgroundColor: isToday
                        ? themeColors.accent
                        : "transparent",
                      border: isToday
                        ? "none"
                        : `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                    }}
                  >
                    {date && (
                      <div className="h-full flex flex-col">
                        <span
                          className="text-sm font-medium transition-colors duration-[2400000]"
                          style={{
                            color: isToday
                              ? themeColors.surface
                              : themeColors.text,
                          }}
                        >
                          {date.getDate()}
                        </span>
                        <div className="flex-1 flex flex-col gap-1 mt-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className="w-full h-1 rounded-full"
                              style={{
                                backgroundColor: categoryColors[event.category],
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Events List */}
          {events.length > 0 && (
            <div className="mt-4 space-y-2">
              <p
                className="text-sm mb-3 transition-colors duration-[2400000]"
                style={{ color: themeColors.textSecondary }}
              >
                Upcoming Events
              </p>
              {events.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl p-4 transition-colors duration-[2400000]"
                  style={{ backgroundColor: themeColors.surface }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p
                        className="font-medium transition-colors duration-[2400000]"
                        style={{ color: themeColors.text }}
                      >
                        {event.title}
                      </p>
                      <p
                        className="text-sm mt-1 transition-colors duration-[2400000]"
                        style={{ color: themeColors.textSecondary }}
                      >
                        {event.date} {event.time && `· ${event.time}`}
                      </p>
                    </div>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: categoryColors[event.category],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
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
                Add Event
              </h2>
              <button
                onClick={() => {
                  setShowAddEvent(false);
                  setSelectedDate(null);
                  setNewEvent({ title: "", category: "personal", time: "" });
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
                  Event Title
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="What's happening?"
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
                  Time (optional)
                </label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
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
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(categoryColors).map((cat) => (
                    <button
                      key={cat}
                      onClick={() =>
                        setNewEvent({ ...newEvent, category: cat })
                      }
                      className="px-4 py-3 rounded-xl capitalize transition-all duration-200"
                      style={{
                        backgroundColor:
                          newEvent.category === cat
                            ? categoryColors[cat]
                            : themeColors.bg,
                        color:
                          newEvent.category === cat
                            ? "#FFFFFF"
                            : themeColors.text,
                        border: `1px solid ${newEvent.category === cat ? categoryColors[cat] : timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={addEvent}
                disabled={!newEvent.title}
                className="w-full py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: themeColors.accent,
                  color: themeColors.surface,
                }}
              >
                Add Event
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
