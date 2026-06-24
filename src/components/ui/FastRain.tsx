"use client";

import { useEffect, useState, useMemo } from "react";
import { THEMES } from "./ThemeSwitcher";

// Fungsi untuk menghasilkan ratusan partikel hanya menggunakan SATU DOM element (Sangat Ringan)
const generateShadows = (count: number) => {
  let shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    shadows.push(`${x}vw ${y}vh`);
  }
  return shadows.join(", ");
};

export function FastRain() {
  const [rainColor, setRainColor] = useState("#ffffff");
  const [isMounted, setIsMounted] = useState(false);

  // Generate shadow strings hanya di client side untuk mencegah Hydration Mismatch
  const [rainLayer1, setRainLayer1] = useState("");
  const [rainLayer2, setRainLayer2] = useState("");
  const [rainLayer3, setRainLayer3] = useState("");

  useEffect(() => {
    setRainLayer1(generateShadows(150));
    setRainLayer2(generateShadows(100));
    setRainLayer3(generateShadows(50));
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const updateColor = (themeId: string) => {
      const theme = THEMES.find((t) => t.id === themeId);
      if (theme) {
        setRainColor(theme.id === "default" ? "#9CA3AF" : theme.color);
      }
    };

    const savedTheme = localStorage.getItem("docksidz_theme") || "monochrome";
    updateColor(savedTheme);

    const handleThemeChange = (e: any) => {
      updateColor(e.detail);
    };

    window.addEventListener("theme-changed", handleThemeChange);
    return () => window.removeEventListener("theme-changed", handleThemeChange);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none overflow-hidden" style={{ color: rainColor }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .rain-drop {
          width: 2px;
          height: 15px;
          background: transparent;
          border-radius: 5px;
        }
        .rain-layer-1 {
          box-shadow: ${rainLayer1};
          animation: rainAnim 1.2s linear infinite;
        }
        .rain-layer-2 {
          box-shadow: ${rainLayer2};
          animation: rainAnim 1.8s linear infinite;
          opacity: 0.7;
          width: 1px;
          height: 10px;
        }
        .rain-layer-3 {
          box-shadow: ${rainLayer3};
          animation: rainAnim 2.4s linear infinite;
          opacity: 0.4;
          width: 1px;
          height: 5px;
        }
        @keyframes rainAnim {
          from { transform: translateY(-100vh); }
          to { transform: translateY(100vh); }
        }
      `}} />
      
      {/* Hanya render layer hujan jika sudah di mount di client */}
      {isMounted && (
        <>
          <div className="rain-drop rain-layer-1" />
          <div className="rain-drop rain-layer-2" />
          <div className="rain-drop rain-layer-3" />
        </>
      )}
    </div>
  );
}
