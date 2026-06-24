"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function Mascot() {
  const [mascotSrc, setMascotSrc] = useState("/mascot.png");

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

  if (mascotSrc === "off") return null;

  return (
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
        className="w-full h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] grayscale hover:grayscale-0 transition-all duration-500"
      />
    </motion.div>
  );
}
