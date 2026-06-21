"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring config yang sangat responsif agar panah menempel kursor dengan presisi
  const springConfig = { damping: 30, stiffness: 800, mass: 0.2 };
  
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      // Offset agar ujung panah pas di titik kursor
      cursorX.set(e.clientX - 2);
      cursorY.set(e.clientY - 2);
      
      const target = e.target as HTMLElement;
      const isClickable = target.closest('a, button, input, select, textarea, [role="button"], label, .cursor-pointer') !== null;
      setIsHovering(isClickable);
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[10000]"
      style={{
        x: smoothX,
        y: smoothY,
      }}
    >
      <motion.div
        animate={{
          scale: isHovering ? 1.3 : 1,
          rotate: isHovering ? -10 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
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
