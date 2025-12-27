import { useState, useEffect } from 'react';

const THEME_PHASES = {
  morning: {
    phase: 'morning',
    colors: {
      bg: '#FBFAF6',
      text: '#2B2B2B',
      textSecondary: '#6B6B6B',
      accent: '#9CAF88',
      surface: '#FFFFFF',
    },
  },
  day: {
    phase: 'day',
    colors: {
      bg: '#FAFAF7',
      text: '#2B2B2B',
      textSecondary: '#6B6B6B',
      accent: '#8FA6B8',
      surface: '#FFFFFF',
    },
  },
  evening: {
    phase: 'evening',
    colors: {
      bg: '#F4F1EC',
      text: '#2B2B2B',
      textSecondary: '#6B6B6B',
      accent: '#C7A89B',
      surface: '#FAF9F7',
    },
  },
  night: {
    phase: 'night',
    colors: {
      bg: '#1F1F1C',
      text: '#E7E6E2',
      textSecondary: '#A8A7A3',
      accent: '#8FA6B8',
      surface: '#2A2A27',
    },
  },
};

export function useTimePhaseTheme() {
  const [timePhase, setTimePhase] = useState('day');
  const [themeColors, setThemeColors] = useState(THEME_PHASES.day.colors);

  useEffect(() => {
    const updateTimePhase = () => {
      const hour = new Date().getHours();
      let phaseKey = 'day';

      if (hour >= 5 && hour < 9.5) {
        phaseKey = 'morning';
      } else if (hour >= 9.5 && hour < 16.5) {
        phaseKey = 'day';
      } else if (hour >= 16.5 && hour < 21) {
        phaseKey = 'evening';
      } else if (hour >= 21 || hour < 5) {
        phaseKey = 'night';
      }

      const { phase, colors } = THEME_PHASES[phaseKey];
      setTimePhase(phase);
      setThemeColors(colors);

      if (import.meta.env.DEV) {
        console.debug(`[Theme] Updated to ${phase} phase at ${hour}:00`, colors);
      }
    };

    updateTimePhase();
    const interval = setInterval(updateTimePhase, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return { timePhase, themeColors };
}
