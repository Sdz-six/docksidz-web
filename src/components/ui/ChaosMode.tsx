"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export function ChaosMode() {
  const [isChaos, setIsChaos] = useState(false);

  useEffect(() => {
    const handleChaos = () => {
      // 1. Bunyikan Alarm (Opsional)
      try {
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch (e) {}

      setIsChaos(true);
      document.body.classList.add("chaos-active");
    };

    window.addEventListener("trigger-chaos", handleChaos);
    return () => window.removeEventListener("trigger-chaos", handleChaos);
  }, []);

  const restoreOrder = () => {
    window.location.reload();
  };

  return (
    <>
      {isChaos && (
        <style dangerouslySetInnerHTML={{ __html: `
          /* Efek Gravitasi Runtuh pada Semua Elemen */
          .chaos-active main *, .chaos-active header *, .chaos-active footer *, .chaos-active nav * {
            transition: transform 3s cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity 4s linear !important;
            transform: translateY(3000px) rotate(calc(720deg * var(--random-spin, 1))) !important;
            pointer-events: none !important;
          }

          /* Buat sedikit variasi acak untuk tiap elemen menggunakan nth-child hack */
          .chaos-active *:nth-child(even) { --random-spin: -1; }
          .chaos-active *:nth-child(3n) { --random-spin: 2; transition-duration: 2.5s !important; }
          .chaos-active *:nth-child(5n) { --random-spin: -2; transition-duration: 4s !important; }

          body.chaos-active {
            background-color: #000 !important;
            animation: bgFlash 0.5s infinite;
          }

          @keyframes bgFlash {
            0%, 100% { background-color: #1A1A2E; }
            50% { background-color: #3f0000; }
          }
        `}} />
      )}
      
      <AnimatePresence>
        {isChaos && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 1 }} // Muncul setelah semua runtuh
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center p-4 pointer-events-auto"
          >
            <div className="bg-surface border-8 border-red-500 p-8 rounded-3xl neo-brutalist-shadow flex flex-col items-center max-w-lg text-center">
              <AlertTriangle className="w-24 h-24 text-red-500 mb-6 animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-black text-red-500 mb-4">SISTEM HANCUR!</h1>
              <p className="text-xl font-bold text-text mb-8">
                Anda menekan tombol terlarang. Gravitasi server mati dan semua komponen web jatuh ke jurang ruang dan waktu.
              </p>
              <button 
                onClick={restoreOrder}
                className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-black text-2xl border-4 border-border rounded-xl hover:scale-110 active:scale-95 transition-transform neo-brutalist-shadow"
              >
                <RefreshCcw className="w-6 h-6" /> PULIHKAN WEB
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
