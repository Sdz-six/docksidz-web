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
            speed: 25, // Kecepatan tinggi untuk efek hujan deras
            straight: true,
          },
          number: {
            density: { enable: true, area: 800 },
            value: 250, // Jumlah titik hujan yang sangat banyak
          },
          opacity: {
            value: { min: 0.2, max: 0.6 },
          },
          shape: { type: "circle" },
          size: {
            value: { min: 1, max: 3 }, // Memanjang ke bawah menggunakan stretch CSS atau kecepatan
          },
        },
        detectRetina: true,
      }}
    />
  );
}
