"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  useEffect(() => {
    // 1. Gerakan kursor instan tanpa spring (delay) agar terasa enteng
    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX - 2);
      cursorY.set(e.clientY - 2);
    };

    // 2. Deteksi hover dipindah ke mouseover agar tidak membebani setiap piksel pergerakan mouse
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest) {
        const isClickable = target.closest('a, button, input, select, textarea, [role="button"], label, .cursor-pointer') !== null;
        setIsHovering(prev => prev !== isClickable ? isClickable : prev);
      }
    };

    // Gunakan { passive: true } agar scroll dan gerakan mouse tidak tertahan oleh Javascript
    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

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
          scale: isHovering ? 1.3 : 1,
          rotate: isHovering ? -10 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 28 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="text-primary" 
          style={{ filter: "drop-shadow(4px 4px 0px var(--color-border))" }}
        >
          <path 
            d="M3 3L11 27L15 17L25 13L3 3Z" 
            fill="currentColor" 
            stroke="var(--color-border)" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
