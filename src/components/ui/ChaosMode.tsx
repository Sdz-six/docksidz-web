"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCcw, Terminal } from "lucide-react";

export function ChaosMode() {
  const [isChaos, setIsChaos] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const confirmChaos = () => {
    setShowConfirmModal(false);
    
    // Bunyikan Alarm
    try {
      const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (e) {}

    setIsChaos(true);
    document.body.classList.add("chaos-active");
  };

  const restoreOrder = () => {
    window.location.reload();
  };

  useEffect(() => {
    const handleChaos = () => {
      setIsChaos(true);
      document.body.classList.add("chaos-active");
    };

    const handleModal = () => setShowConfirmModal(true);

    window.addEventListener("trigger-chaos", handleChaos);
    window.addEventListener("trigger-chaos-modal", handleModal);
    
    return () => {
      window.removeEventListener("trigger-chaos", handleChaos);
      window.removeEventListener("trigger-chaos-modal", handleModal);
    };
  }, []);

  return (
    <>
      {/* Modal Konfirmasi Ala Hacker / Error */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#0a0a0a] border-2 border-red-500 w-full max-w-xl rounded-lg overflow-hidden font-mono shadow-[0_0_50px_rgba(239,68,68,0.2)]"
            >
              <div className="bg-red-600 text-white p-2 flex items-center gap-2 text-sm font-bold">
                <Terminal className="w-4 h-4" /> CRITICAL_SYSTEM_WARNING.exe
              </div>
              <div className="p-6 text-red-500 flex flex-col gap-4">
                <p className="text-2xl font-black animate-pulse flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8" /> FATAL ERROR DETECTED
                </p>
                <div className="text-sm text-red-400 space-y-2 bg-red-950/30 p-4 border border-red-900/50 rounded">
                  <p>{">"} WARNING: TINDAKAN INI AKAN MENGESAMPINGKAN PROTOKOL KEAMANAN CSS.</p>
                  <p>{">"} WARNING: GRAVITASI DOM AKAN DIMATIKAN.</p>
                  <p>{">"} WARNING: SEMUA KOMPONEN STRUKTURAL AKAN KOLAPS.</p>
                </div>
                <p className="font-bold mt-2">
                  Apakah Anda benar-benar yakin ingin menghancurkan antarmuka ini?
                </p>
                
                <div className="flex justify-end gap-4 mt-6">
                  <button 
                    onClick={() => setShowConfirmModal(false)}
                    className="px-6 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors font-bold"
                  >
                    [ ABORT ]
                  </button>
                  <button 
                    onClick={confirmChaos}
                    className="px-6 py-2 bg-red-600 text-white font-black hover:bg-red-700 animate-pulse transition-colors"
                  >
                    [ INITIATE_CHAOS ]
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Efek Chaos Active */}
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
      
      {/* Layar Runtuh Modal */}
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
