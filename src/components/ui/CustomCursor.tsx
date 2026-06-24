"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Sembunyikan kursor kustom di perangkat layar sentuh/HP
    if (window.innerWidth < 768 || 'ontouchstart' in window) {
      if (cursorRef.current) cursorRef.current.style.display = 'none';
      return;
    }

    let ticking = false;
    let mouseX = -100;
    let mouseY = -100;

    // 1. DOM Murni + RequestAnimationFrame (Tingkat Kinerja Maksimal)
    // Menghindari React State dan Framer Motion sepenuhnya untuk kursor
    const updateCursor = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
      ticking = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX - 2;
      mouseY = e.clientY - 2;
      if (!ticking) {
        requestAnimationFrame(updateCursor);
        ticking = true;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest) {
        const isClickable = target.closest('a, button, input, select, textarea, [role="button"], label, .cursor-pointer') !== null;
        if (cursorRef.current) {
          // Hanya ganti class murni tanpa animasi transisi berat
          if (isClickable) {
            cursorRef.current.classList.add('scale-125', 'rotate-[-10deg]');
          } else {
            cursorRef.current.classList.remove('scale-125', 'rotate-[-10deg]');
          }
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="hidden md:block pointer-events-none fixed top-0 left-0 z-[10000] will-change-transform transition-transform duration-100 ease-out"
    >
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 28 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="text-primary" 
        style={{ filter: "drop-shadow(3px 3px 0px var(--color-border))" }}
      >
        <path 
          d="M2.54011 28.5303L0.985926 1.76451C0.844784 -0.665793 3.65593 -1.82173 5.30939 0.239328L26.3315 26.4385C27.7944 28.2619 26.3768 31.0601 24.0326 30.9818L13.882 30.6432L6.15574 38.6534C4.69466 40.1685 2.15579 38.9959 2.37877 36.8835L3.10976 29.9575L2.54011 28.5303Z" 
          fill="currentColor" 
          stroke="var(--color-border)" 
          strokeWidth="2" 
        />
      </svg>
    </div>
  );
}
