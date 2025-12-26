"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, Clock, Target, BookOpen } from "lucide-react";

export default function BottomNavigation() {
  const [isVisible, setIsVisible] = useState(true);
  const [timePhase, setTimePhase] = useState("midday");
  const [themeColors, setThemeColors] = useState({
    bg: "#FAFAF7",
    text: "#2B2B2B",
    textSecondary: "#6B6B6B",
    accent: "#8FA6B8",
    surface: "#FFFFFF",
  });

  const lastScrollY = useRef(0);
  const scrollThreshold = 10; // 8-12px threshold
  const ticking = useRef(false);
  const prefersReducedMotion = useRef(false);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mediaQuery.matches;

    const handleChange = (e) => {
      prefersReducedMotion.current = e.matches;
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Time phase detection (same as in pages)
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

  // Scroll detection with throttling
  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;

      ticking.current = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY.current;

        // Always show navigation near top (within first 100px)
        if (currentScrollY < 100) {
          setIsVisible(true);
        }
        // Always show navigation at bottom
        else if (window.innerHeight + currentScrollY >= document.body.offsetHeight - 100) {
          setIsVisible(true);
        }
        // Hide when scrolling down, show when scrolling up (with threshold)
        else if (Math.abs(scrollDelta) > scrollThreshold) {
          setIsVisible(scrollDelta < 0); // Show when scrolling up (negative delta)
        }
        // Keep current state for small movements

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };

    // Initial state - always visible on load
    setIsVisible(true);
    lastScrollY.current = window.scrollY;

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get current page for active state
  const getCurrentPage = () => {
    if (typeof window === "undefined") return "";
    return window.location.pathname;
  };

  const currentPage = getCurrentPage();

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 border-t transition-transform duration-200 ease-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      } ${prefersReducedMotion.current ? "!transition-none" : ""}`}
      style={{
        backgroundColor: themeColors.surface,
        borderColor: timePhase === "night" ? "#3A3A37" : "#E5E5E5",
        boxShadow: isVisible
          ? "0 -2px 8px rgba(0, 0, 0, 0.1)"
          : "none",
        transform: prefersReducedMotion.current
          ? (isVisible ? "translateY(0)" : "translateY(100%)")
          : undefined,
      }}
    >
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-around">
          <a
            href="/"
            className="flex flex-col items-center gap-1 transition-opacity duration-200 hover:opacity-70"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                currentPage === "/" ? "shadow-lg" : ""
              }`}
              style={{
                backgroundColor: currentPage === "/" ? themeColors.accent : themeColors.bg,
              }}
            >
              <Calendar
                size={20}
                style={{
                  color: currentPage === "/" ? themeColors.surface : themeColors.text
                }}
              />
            </div>
            <span
              className={`text-xs transition-colors duration-200 ${
                currentPage === "/" ? "font-medium" : ""
              }`}
              style={{
                color: currentPage === "/" ? themeColors.accent : themeColors.textSecondary
              }}
            >
              Dashboard
            </span>
          </a>

          <a
            href="/calendar"
            className="flex flex-col items-center gap-1 transition-opacity duration-200 hover:opacity-70"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                currentPage === "/calendar" ? "shadow-lg" : ""
              }`}
              style={{
                backgroundColor: currentPage === "/calendar" ? themeColors.accent : themeColors.bg,
              }}
            >
              <Calendar
                size={20}
                style={{
                  color: currentPage === "/calendar" ? themeColors.surface : themeColors.text
                }}
              />
            </div>
            <span
              className={`text-xs transition-colors duration-200 ${
                currentPage === "/calendar" ? "font-medium" : ""
              }`}
              style={{
                color: currentPage === "/calendar" ? themeColors.accent : themeColors.textSecondary
              }}
            >
              Calendar
            </span>
          </a>

          <a
            href="/activity"
            className="flex flex-col items-center gap-1 transition-opacity duration-200 hover:opacity-70"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                currentPage === "/activity" ? "shadow-lg" : ""
              }`}
              style={{
                backgroundColor: currentPage === "/activity" ? themeColors.accent : themeColors.bg,
              }}
            >
              <Clock
                size={20}
                style={{
                  color: currentPage === "/activity" ? themeColors.surface : themeColors.text
                }}
              />
            </div>
            <span
              className={`text-xs transition-colors duration-200 ${
                currentPage === "/activity" ? "font-medium" : ""
              }`}
              style={{
                color: currentPage === "/activity" ? themeColors.accent : themeColors.textSecondary
              }}
            >
              Activity
            </span>
          </a>

          <a
            href="/goals"
            className="flex flex-col items-center gap-1 transition-opacity duration-200 hover:opacity-70"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                currentPage === "/goals" ? "shadow-lg" : ""
              }`}
              style={{
                backgroundColor: currentPage === "/goals" ? themeColors.accent : themeColors.bg,
              }}
            >
              <Target
                size={20}
                style={{
                  color: currentPage === "/goals" ? themeColors.surface : themeColors.text
                }}
              />
            </div>
            <span
              className={`text-xs transition-colors duration-200 ${
                currentPage === "/goals" ? "font-medium" : ""
              }`}
              style={{
                color: currentPage === "/goals" ? themeColors.accent : themeColors.textSecondary
              }}
            >
              Goals
            </span>
          </a>

          <a
            href="/projects"
            className="flex flex-col items-center gap-1 transition-opacity duration-200 hover:opacity-70"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                currentPage === "/projects" ? "shadow-lg" : ""
              }`}
              style={{
                backgroundColor: currentPage === "/projects" ? themeColors.accent : themeColors.bg,
              }}
            >
              <BookOpen
                size={20}
                style={{
                  color: currentPage === "/projects" ? themeColors.surface : themeColors.text
                }}
              />
            </div>
            <span
              className={`text-xs transition-colors duration-200 ${
                currentPage === "/projects" ? "font-medium" : ""
              }`}
              style={{
                color: currentPage === "/projects" ? themeColors.accent : themeColors.textSecondary
              }}
            >
              Projects
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
