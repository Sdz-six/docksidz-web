"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Splash {
  id: number;
  x: number;
  y: number;
  color: string;
}

const colors = [
  "#7288AE", // Light Blue/Grey
  "#4B5694", // Mid Blue
  "#111844", // Dark Blue
];

// Singleton AudioContext agar tidak membuat konteks baru setiap saat
let audioCtx: AudioContext | null = null;

function playBubbleSound() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Pastikan context berjalan (beberapa browser menghentikan context sebelum interaksi)
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Suara "plop" atau gelembung pecah (Pitch sweep naik dengan cepat)
    const now = audioCtx.currentTime;
    osc.type = "sine";
    // Mulai dari 400Hz naik ke 1200Hz
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);

    // Envelope volume: gain dimaksimalkan agar terdengar jelas
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(1, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch (error) {
    // Abaikan error audio jika browser tidak mendukung
    console.error("Audio error:", error);
  }
}

export function SplashCursor() {
  const [splashes, setSplashes] = useState<Splash[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Mainkan efek suara gelembung
      playBubbleSound();

      // Menambahkan efek splash pada posisi klik
      const newSplash = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      setSplashes((prev) => [...prev, newSplash]);

      // Hapus splash setelah animasi selesai (1 detik)
      setTimeout(() => {
        setSplashes((prev) => prev.filter((s) => s.id !== newSplash.id));
      }, 1000);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <AnimatePresence>
        {splashes.map((splash) => (
          <React.Fragment key={splash.id}>
            {/* Partikel utama membesar dan memudar */}
            <motion.div
              initial={{ opacity: 1, scale: 0 }}
              animate={{ opacity: 0, scale: 2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute rounded-full"
              style={{
                left: splash.x - 20,
                top: splash.y - 20,
                width: 40,
                height: 40,
                backgroundColor: splash.color,
                opacity: 0.5,
              }}
            />
            {/* Percikan kecil di sekeliling */}
            {[...Array(6)].map((_, i) => {
              const angle = (i * Math.PI * 2) / 6;
              const distance = 40 + Math.random() * 30;
              return (
                <motion.div
                  key={`${splash.id}-${i}`}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{
                    opacity: 0,
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    scale: 0,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute rounded-full"
                  style={{
                    left: splash.x - 5,
                    top: splash.y - 5,
                    width: 10,
                    height: 10,
                    backgroundColor: splash.color,
                  }}
                />
              );
            })}
          </React.Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
}
