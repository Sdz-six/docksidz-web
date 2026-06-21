"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { FileCode2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function WelcomeScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Cek apakah user sudah pernah melihat welcome screen di sesi ini
    const hasVisited = sessionStorage.getItem("docksidz_welcomed");
    if (hasVisited) {
      setIsVisible(false);
    } else {
      // Tembakkan confetti meriah saat pertama kali muncul
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#111844", "#7288AE", "#EAE0CF"]
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#111844", "#7288AE", "#EAE0CF"]
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      // Delay sedikit agar rendering selesai dulu
      setTimeout(frame, 300);
    }
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem("docksidz_welcomed", "true");
    setIsVisible(false);
    
    // Suara letupan kecil
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background overflow-hidden"
        >
          {/* Latar Belakang Animasi Pattern */}
          <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: "radial-gradient(#EAE0CF 2px, transparent 2px)", 
            backgroundSize: "30px 30px" 
          }}></div>

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.5 }}
            className="relative z-10 text-center max-w-2xl px-6"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="inline-block mb-6 bg-surface p-6 rounded-3xl neo-brutalist-shadow border-4 border-border"
            >
              <FileCode2 className="w-16 h-16 text-primary" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-text tracking-tight">
              Selamat Datang di <span className="text-surface bg-primary px-4 py-1 rounded-2xl inline-block mt-2 rotate-2 neo-brutalist-shadow-sm border-2 border-border">DockSidz</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted mb-10 font-medium">
              Platform konversi Word & PDF instan favorit Anda. Didesain dengan gaya keren dan eksperimental dibuat dengan sepenuh hati 💖
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={handleEnter} size="lg" className="text-xl px-10 py-6 h-auto neo-brutalist-shadow border-4 border-border rounded-2xl flex items-center gap-3 mx-auto">
                Masuk ke Aplikasi
                <ArrowRight className="w-6 h-6" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
