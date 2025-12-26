"use client";

import { useState, useEffect } from "react";
import { Plus, X, Search } from "lucide-react";
import BottomNavigation from "../../components/BottomNavigation";

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: "", content: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);
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

  // Load entries
  useEffect(() => {
    const stored = localStorage.getItem("journal_entries");
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  }, []);

  const saveEntries = (updatedEntries) => {
    localStorage.setItem("journal_entries", JSON.stringify(updatedEntries));
    setEntries(updatedEntries);
  };

  const addEntry = () => {
    if (!newEntry.title || !newEntry.content) return;

    const entry = {
      id: Date.now(),
      ...newEntry,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveEntries([entry, ...entries]);
    setNewEntry({ title: "", content: "" });
    setShowNewEntry(false);
  };

  const updateEntry = (updatedEntry) => {
    const updated = entries.map((e) =>
      e.id === updatedEntry.id
        ? { ...updatedEntry, updatedAt: new Date().toISOString() }
        : e,
    );
    saveEntries(updated);
    setSelectedEntry(null);
  };

  const deleteEntry = (id) => {
    if (confirm("Delete this entry?")) {
      saveEntries(entries.filter((e) => e.id !== id));
      setSelectedEntry(null);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const entryDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    if (entryDate.getTime() === today.getTime()) {
      return `Today · ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (entryDate.getTime() === today.getTime() - 86400000) {
      return `Yesterday · ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const renderMarkdown = (text) => {
    // Simple markdown rendering
    let html = text;

    // Headers
    html = html.replace(
      /^### (.*$)/gim,
      '<h3 style="font-size: 1.25rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem;">$1</h3>',
    );
    html = html.replace(
      /^## (.*$)/gim,
      '<h2 style="font-size: 1.5rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem;">$1</h2>',
    );
    html = html.replace(
      /^# (.*$)/gim,
      '<h1 style="font-size: 1.875rem; font-weight: 700; margin-top: 1rem; margin-bottom: 0.5rem;">$1</h1>',
    );

    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");

    // Lists
    html = html.replace(
      /^\- (.*$)/gim,
      '<li style="margin-left: 1.5rem;">$1</li>',
    );

    // Line breaks
    html = html.replace(/\n/gim, "<br />");

    return html;
  };

  const filteredEntries = entries.filter((entry) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(query) ||
      entry.content.toLowerCase().includes(query)
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
              Journal
            </h1>
            <button
              onClick={() => setShowNewEntry(true)}
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
              placeholder="Search entries..."
              className="flex-1 outline-none transition-colors duration-[2400000]"
              style={{
                backgroundColor: "transparent",
                color: themeColors.text,
              }}
            />
          </div>

          {/* Entries List */}
          <div className="space-y-3">
            {filteredEntries.length === 0 ? (
              <div
                className="rounded-2xl p-12 text-center transition-colors duration-[2400000]"
                style={{ backgroundColor: themeColors.surface }}
              >
                <p
                  className="transition-colors duration-[2400000]"
                  style={{ color: themeColors.textSecondary }}
                >
                  {searchQuery ? "No entries found" : "No journal entries yet"}
                </p>
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className="rounded-xl p-6 cursor-pointer transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: themeColors.surface }}
                >
                  <h3
                    className="font-medium mb-2 transition-colors duration-[2400000]"
                    style={{ color: themeColors.text }}
                  >
                    {entry.title}
                  </h3>
                  <p
                    className="text-sm mb-3 line-clamp-2 transition-colors duration-[2400000]"
                    style={{ color: themeColors.textSecondary }}
                  >
                    {entry.content.substring(0, 150)}...
                  </p>
                  <p
                    className="text-xs transition-colors duration-[2400000]"
                    style={{ color: themeColors.textSecondary }}
                  >
                    {formatDate(entry.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* New Entry Modal */}
      {showNewEntry && (
        <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center p-6 z-50">
          <div
            className="w-full max-w-2xl rounded-2xl p-6 max-h-[80vh] overflow-y-auto transition-colors duration-[2400000]"
            style={{ backgroundColor: themeColors.surface }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-semibold transition-colors duration-[2400000]"
                style={{ color: themeColors.text }}
              >
                New Entry
              </h2>
              <button
                onClick={() => {
                  setShowNewEntry(false);
                  setNewEntry({ title: "", content: "" });
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-70"
                style={{ backgroundColor: themeColors.bg }}
              >
                <X size={16} style={{ color: themeColors.text }} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={newEntry.title}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, title: e.target.value })
                }
                placeholder="Entry title..."
                className="w-full px-4 py-3 rounded-xl outline-none text-lg font-medium transition-colors duration-[2400000]"
                style={{
                  backgroundColor: themeColors.bg,
                  color: themeColors.text,
                  border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                }}
              />

              <textarea
                value={newEntry.content}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, content: e.target.value })
                }
                placeholder="Start writing... (supports **bold**, *italic*, # headers, - lists)"
                rows={12}
                className="w-full px-4 py-3 rounded-xl outline-none resize-none transition-colors duration-[2400000]"
                style={{
                  backgroundColor: themeColors.bg,
                  color: themeColors.text,
                  border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                }}
              />

              <button
                onClick={addEntry}
                disabled={!newEntry.title || !newEntry.content}
                className="w-full py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: themeColors.accent,
                  color: themeColors.surface,
                }}
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View/Edit Entry Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center p-6 z-50">
          <div
            className="w-full max-w-2xl rounded-2xl p-6 max-h-[80vh] overflow-y-auto transition-colors duration-[2400000]"
            style={{ backgroundColor: themeColors.surface }}
          >
            <div className="flex items-center justify-between mb-6">
              <p
                className="text-sm transition-colors duration-[2400000]"
                style={{ color: themeColors.textSecondary }}
              >
                {formatDate(selectedEntry.createdAt)}
              </p>
              <button
                onClick={() => setSelectedEntry(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-70"
                style={{ backgroundColor: themeColors.bg }}
              >
                <X size={16} style={{ color: themeColors.text }} />
              </button>
            </div>

            <h2
              className="text-2xl font-semibold mb-6 transition-colors duration-[2400000]"
              style={{ color: themeColors.text }}
            >
              {selectedEntry.title}
            </h2>

            <div
              className="prose max-w-none mb-6 transition-colors duration-[2400000]"
              style={{ color: themeColors.text }}
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(selectedEntry.content),
              }}
            />

            <div className="flex gap-3">
              <button
                onClick={() => deleteEntry(selectedEntry.id)}
                className="flex-1 py-3 rounded-xl font-medium transition-all duration-200"
                style={{
                  backgroundColor: themeColors.bg,
                  color: themeColors.text,
                  border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                }}
              >
                Delete
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

        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </div>
  );
}
