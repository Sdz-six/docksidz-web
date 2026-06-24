"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { MascotGame } from "./MascotGame";

export function Mascot() {
  const [mascotSrc, setMascotSrc] = useState("off");
  const [isGameOpen, setIsGameOpen] = useState(false);
  
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Muat preferensi maskot dari localStorage jika ada
    const savedMascot = localStorage.getItem("docksidz_mascot");
    if (savedMascot) {
      setMascotSrc(savedMascot);
    }

    // Dengarkan perubahan dari controller
    const handleMascotChange = (e: any) => {
      setMascotSrc(e.detail);
      localStorage.setItem("docksidz_mascot", e.detail);
    };

    window.addEventListener("mascot-changed", handleMascotChange);
    return () => window.removeEventListener("mascot-changed", handleMascotChange);
  }, []);

  const handleMascotClick = () => {
    clickCountRef.current += 1;
    
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    
    if (clickCountRef.current >= 5) {
      setIsGameOpen(true);
      clickCountRef.current = 0;
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1000); // 1 detik jeda maksimal antar klik
    }
  };

  if (mascotSrc === "off") return null;

  return (
    <>
      <MascotGame isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />
      <motion.div
        key={mascotSrc} // Paksa re-render animasi saat maskot berubah
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="fixed bottom-0 right-0 z-40 pointer-events-none opacity-80 hover:opacity-100 transition-opacity"
        style={{
          // Menggunakan ukuran maksimum agar proporsional di berbagai layar
          maxWidth: "300px",
          width: "30vw",
          minWidth: "150px"
        }}
      >
        <img
          src={mascotSrc}
          alt="DockSidz Mascot"
          onClick={handleMascotClick}
          className="w-full h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] grayscale hover:grayscale-0 transition-all duration-500 pointer-events-auto cursor-pointer"
        />
      </motion.div>
    </>
  );
}
