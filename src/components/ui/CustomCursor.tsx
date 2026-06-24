"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // Default true agar tidak SSR mismatch
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);

    // Gerakan kursor instan tanpa spring (delay) agar terasa enteng dan akurat
    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX - 2); // Offset agar titik klik pas di ujung
      cursorY.set(e.clientY - 2);
    };

    // Deteksi hover dipindah ke mouseover agar ringan
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest) {
        const isClickable = target.closest('a, button, input, select, textarea, [role="button"], label, .cursor-pointer') !== null;
        setIsHovering(prev => prev !== isClickable ? isClickable : prev);
      }
    };

    // Gunakan { passive: true } agar ringan
    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (isMobile) return null;

  return (
    <motion.div
      className="hidden md:block pointer-events-none fixed top-0 left-0 z-[10000]"
      style={{
        x: cursorX,
        y: cursorY,
      }}
    >
      <motion.div
        animate={{
          scale: isHovering ? 1.2 : 1,
          rotate: isHovering ? -10 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* SVG Kursor Asli Diperkecil (Width/Height 20) */}
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 28 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="text-primary" 
          style={{ filter: "drop-shadow(2px 2px 0px var(--color-border))" }}
        >
          <path 
            d="M2.54011 28.5303L0.985926 1.76451C0.844784 -0.665793 3.65593 -1.82173 5.30939 0.239328L26.3315 26.4385C27.7944 28.2619 26.3768 31.0601 24.0326 30.9818L13.882 30.6432L6.15574 38.6534C4.69466 40.1685 2.15579 38.9959 2.37877 36.8835L3.10976 29.9575L2.54011 28.5303Z" 
            fill="currentColor" 
            stroke="var(--color-border)" 
            strokeWidth="2" 
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
