"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { MousePointer2 } from "lucide-react";

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
          scale: isHovering ? 1.3 : 1,
          rotate: isHovering ? -15 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* SVG Kursor Panah Standar */}
        <MousePointer2 
          className="w-6 h-6 text-primary fill-primary" 
          strokeWidth={2}
          stroke="var(--color-border)"
          style={{ 
            filter: "drop-shadow(2px 2px 0px var(--color-border))",
            transform: "rotate(-15deg)" // Miringkan sedikit agar lebih natural mirip kursor OS
          }}
        />
      </motion.div>
    </motion.div>
  );
}
