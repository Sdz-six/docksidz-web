"use client";

import { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const THEMES = [
  { id: "default", name: "DockSidz Default", color: "#111844" },
  { id: "cyberpunk", name: "Cyberpunk", color: "#22C55E" },
  { id: "retro", name: "Retro Vibe", color: "#DC2626" },
  { id: "midnight", name: "Midnight Hacker", color: "#10B981" },
  { id: "bubblegum", name: "Bubblegum Pop", color: "#EC4899" },
  { id: "solar", name: "Solar Flare", color: "#F59E0B" },
  { id: "ocean", name: "Deep Ocean", color: "#06B6D4" },
  { id: "lavender", name: "Lavender Dream", color: "#8B5CF6" },
  { id: "synthwave", name: "Synthwave", color: "#D946EF" },
  { id: "forest", name: "Forest Ranger", color: "#22C55E" },
  { id: "monochrome", name: "Monochrome", color: "#000000" },
  { id: "vampire", name: "Vampire", color: "#991B1B" },
  { id: "tokyo", name: "Neon Tokyo", color: "#F43F5E" },
  { id: "matcha", name: "Matcha Latte", color: "#84CC16" },
  { id: "terminal", name: "Terminal", color: "#4ADE80" },
  { id: "sunset", name: "Sunset", color: "#F97316" },
  { id: "arctic", name: "Arctic Ice", color: "#38BDF8" },
  { id: "halloween", name: "Halloween", color: "#EA580C" },
  { id: "royal", name: "Royal Gold", color: "#EAB308" },
  { id: "coffee", name: "Coffee Shop", color: "#D97706" },
];

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("default");

  useEffect(() => {
    const savedTheme = localStorage.getItem("docksidz_theme") || "default";
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const changeTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem("docksidz_theme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    setIsOpen(false);
    
    // Suara kecil saat ganti tema
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      osc.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-surface border-2 border-border rounded-xl neo-brutalist-shadow-sm hover:-translate-y-1 transition-transform"
        aria-label="Ubah Tema"
      >
        <Palette className="w-6 h-6 text-primary" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute right-0 mt-4 w-56 bg-background border-4 border-border rounded-2xl neo-brutalist-shadow overflow-hidden max-h-[60vh] overflow-y-auto"
            style={{ scrollbarWidth: "thin" }}
          >
            <div className="p-2 flex flex-col gap-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => changeTheme(theme.id)}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg text-left font-bold transition-colors ${
                    currentTheme === theme.id ? "bg-primary text-white" : "hover:bg-surface text-text"
                  }`}
                >
                  <span 
                    className="w-4 h-4 rounded-full border-2 border-border" 
                    style={{ backgroundColor: theme.color }}
                  ></span>
                  {theme.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
