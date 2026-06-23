"use client";

import { motion } from "framer-motion";

export function Mascot() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="fixed bottom-0 right-0 z-40 pointer-events-none opacity-80 hover:opacity-100 transition-opacity"
      style={{
        // Menggunakan ukuran maksimum agar proporsional di berbagai layar
        maxWidth: "300px",
        width: "30vw",
        minWidth: "150px"
      }}
    >
      <img
        src="/mascot.png"
        alt="DockSidz Mascot"
        className="w-full h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] grayscale hover:grayscale-0 transition-all duration-500"
      />
    </motion.div>
  );
}
