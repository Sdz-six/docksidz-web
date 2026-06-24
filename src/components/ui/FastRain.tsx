"use client";

import { useEffect, useRef, useState } from "react";
import { THEMES } from "./ThemeSwitcher";

export function FastRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rainColor, setRainColor] = useState("#9CA3AF"); // Default abu-abu
  const [intensityParams, setIntensityParams] = useState({ count: 100, speedMultiplier: 1 });

  // 1. Sinkronisasi Warna dengan Tema (Hanya berjalan saat tema berubah)
  useEffect(() => {
    const updateColor = (themeId: string) => {
      const theme = THEMES.find((t) => t.id === themeId);
      if (theme) {
        setRainColor(theme.id === "default" ? "#9CA3AF" : theme.color);
      }
    };

    // Baca tema awal dari local storage
    const savedTheme = localStorage.getItem("docksidz_theme") || "monochrome";
    updateColor(savedTheme);

    const handleThemeChange = (e: any) => updateColor(e.detail);
    window.addEventListener("theme-changed", handleThemeChange);
    return () => window.removeEventListener("theme-changed", handleThemeChange);
  }, []);

  // 2. Sinkronisasi Intensitas Hujan (Hanya berjalan saat intensitas berubah)
  useEffect(() => {
    const handleIntensityChange = (e: any) => {
      const mode = e.detail;
      if (mode === "gerimis") setIntensityParams({ count: 30, speedMultiplier: 0.6 });
      else if (mode === "badai") setIntensityParams({ count: 350, speedMultiplier: 1.5 });
      else if (mode === "off") setIntensityParams({ count: 0, speedMultiplier: 0 }); // Mode Mati
      else setIntensityParams({ count: 120, speedMultiplier: 1 }); // Normal
    };

    // Load preferensi awal dari local storage
    const savedIntensity = localStorage.getItem("docksidz_rain");
    if (savedIntensity) {
      if (savedIntensity === "gerimis") setIntensityParams({ count: 30, speedMultiplier: 0.6 });
      else if (savedIntensity === "badai") setIntensityParams({ count: 350, speedMultiplier: 1.5 });
      else if (savedIntensity === "off") setIntensityParams({ count: 0, speedMultiplier: 0 });
    }

    window.addEventListener("rain-intensity-changed", handleIntensityChange);
    return () => window.removeEventListener("rain-intensity-changed", handleIntensityChange);
  }, []);

  // 3. Mesin Animasi Canvas (Sangat Ringan untuk HP Kentang)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; length: number; velocity: number; opacity: number }[] = [];

    // Fungsi inisialisasi partikel (dipanggil saat resize atau ganti intensitas)
    const initParticles = () => {
      // Mengurangi drastis jumlah partikel jika layar kecil (HP) agar tidak nge-lag
      const isMobile = window.innerWidth < 768;
      let finalCount = intensityParams.count;
      if (isMobile) finalCount = Math.floor(finalCount * 0.6); // Pangkas 40% di HP
      
      particles = [];
      for (let i = 0; i < finalCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          length: (Math.random() * 20 + 10) * intensityParams.speedMultiplier,
          velocity: (Math.random() * 15 + 10) * intensityParams.speedMultiplier,
          opacity: Math.random() * 0.4 + 0.1 // Transparansi halus
        });
      }
    };

    if (intensityParams.count === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return; // Berhenti sepenuhnya jika dimatikan
    }

    const resize = () => {
      // Set ukuran kanvas sesuai resolusi layar secara dinamis
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", resize);
    resize();

    // Loop Animasi Utama (Dirender menggunakan Hardware Acceleration / GPU)
    const render = () => {
      // Bersihkan kanvas di setiap frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.strokeStyle = rainColor; // Warna hujan sesuai tema

      // Gambar seluruh partikel dalam satu siklus memori
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        ctx.globalAlpha = p.opacity; // Terapkan transparansi per rintik
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + p.length);
        ctx.stroke();

        // Gerakkan rintik ke bawah
        p.y += p.velocity;

        // Jika rintik menyentuh bawah tanah, reset ke atas langit
        if (p.y > canvas.height) {
          p.y = -p.length;
          p.x = Math.random() * canvas.width;
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [rainColor, intensityParams]); // Re-render canvas HANYA jika warna atau intensitas berubah

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-50 pointer-events-none"
    />
  );
}
