"use client";

import { useCallback, useEffect, useState } from "react";
import { THEMES } from "./ThemeSwitcher";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

export function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    // loadSlim is much lighter than loadFull
    await loadSlim(engine);
  }, []);

  const [rainColor, setRainColor] = useState("#ffffff");

  useEffect(() => {
    const updateColor = (themeId: string) => {
      const theme = THEMES.find(t => t.id === themeId);
      if (theme) {
        // Jika tema default, gunakan warna biru muda/putih. Jika tema lain, gunakan warna aksen temanya.
        setRainColor(theme.id === "default" ? "#9CA3AF" : theme.color);
      }
    };

    // Initial load
    const savedTheme = localStorage.getItem("docksidz_theme") || "monochrome";
    updateColor(savedTheme);

    // Listener for changes
    const handleThemeChange = (e: any) => {
      updateColor(e.detail);
    };

    window.addEventListener("theme-changed", handleThemeChange);
    return () => window.removeEventListener("theme-changed", handleThemeChange);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="fixed inset-0 w-full h-full -z-50 pointer-events-none"
      options={{
        background: {
          color: { value: "transparent" },
        },
        fpsLimit: 60,
        particles: {
          color: { value: rainColor },
          links: { enable: false },
          move: {
            direction: "bottom",
            enable: true,
            outModes: { default: "out" },
            random: false,
            speed: 15, // Kurangi sedikit kecepatan agar lebih stabil
            straight: true,
          },
          number: {
            density: { enable: true, area: 1200 }, // Memperbesar area agar terlihat lebih menyebar
            value: 60, // Jumlah diturunkan drastis dari 250 agar ringan di HP 4GB
          },
          opacity: {
            value: { min: 0.2, max: 0.5 },
          },
          shape: { type: "circle" },
          size: {
            value: { min: 1, max: 2 }, 
          },
        },
        detectRetina: false, // Matikan retina agar tidak menggandakan partikel di layar HD HP
      }}
    />
  );
}
