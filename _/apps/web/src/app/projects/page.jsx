"use client";

import { useState, useEffect } from "react";
import { Plus, X, ChevronRight } from "lucide-react";
import BottomNavigation from "../../components/BottomNavigation";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "" });
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

  // Load projects from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("projects");
    if (stored) {
      setProjects(JSON.parse(stored));
    }
  }, []);

  const saveProjects = (updatedProjects) => {
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  const addProject = () => {
    if (!newProject.title) return;

    const project = {
      id: Date.now(),
      ...newProject,
      tasks: [],
      createdAt: new Date().toISOString(),
    };

    saveProjects([...projects, project]);
    setNewProject({ title: "", description: "" });
    setShowAddProject(false);
  };

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
              Projects
            </h1>
            <button
              onClick={() => setShowAddProject(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-70"
              style={{ backgroundColor: themeColors.accent }}
            >
              <Plus size={20} style={{ color: themeColors.surface }} />
            </button>
          </div>

          {/* Projects List */}
          <div className="space-y-3">
            {projects.length === 0 ? (
              <div
                className="rounded-2xl p-12 text-center transition-colors duration-[2400000]"
                style={{ backgroundColor: themeColors.surface }}
              >
                <p
                  className="transition-colors duration-[2400000]"
                  style={{ color: themeColors.textSecondary }}
                >
                  No projects yet. Create one to get started.
                </p>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl p-6 transition-colors duration-[2400000]"
                  style={{ backgroundColor: themeColors.surface }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3
                        className="font-medium mb-2 transition-colors duration-[2400000]"
                        style={{ color: themeColors.text }}
                      >
                        {project.title}
                      </h3>
                      {project.description && (
                        <p
                          className="text-sm mb-3 transition-colors duration-[2400000]"
                          style={{ color: themeColors.textSecondary }}
                        >
                          {project.description}
                        </p>
                      )}
                      <p
                        className="text-xs transition-colors duration-[2400000]"
                        style={{ color: themeColors.textSecondary }}
                      >
                        {project.tasks.length} tasks
                      </p>
                    </div>
                    <button className="transition-opacity duration-200 hover:opacity-70">
                      <ChevronRight
                        size={20}
                        style={{ color: themeColors.textSecondary }}
                      />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddProject && (
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
                New Project
              </h2>
              <button
                onClick={() => {
                  setShowAddProject(false);
                  setNewProject({ title: "", description: "" });
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
                  Project Title
                </label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  placeholder="Name your project"
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
                  Description (optional)
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  placeholder="What is this project about?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl outline-none resize-none transition-colors duration-[2400000]"
                  style={{
                    backgroundColor: themeColors.bg,
                    color: themeColors.text,
                    border: `1px solid ${timePhase === "night" ? "#3A3A37" : "#E5E5E5"}`,
                  }}
                />
              </div>

              <button
                onClick={addProject}
                disabled={!newProject.title}
                className="w-full py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: themeColors.accent,
                  color: themeColors.surface,
                }}
              >
                Create Project
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
