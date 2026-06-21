"use client";

import { useEffect, useRef } from "react";

export function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    let mouseX = -1000;
    let mouseY = -1000;

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    setSize();
    window.addEventListener("resize", setSize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);
    
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      const spacing = 40;
      const baseRadius = 2;
      const maxDistance = 150; // Jarak interaksi magnetik
      
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          const dx = mouseX - x;
          const dy = mouseY - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          let drawX = x;
          let drawY = y;
          let size = baseRadius;
          let alpha = 0.15;
          
          // Logika riak air / efek menjauh
          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            drawX -= dx * force * 0.15;
            drawY -= dy * force * 0.15;
            size = baseRadius + force * 2.5;
            alpha = 0.15 + force * 0.5;
          }
          
          ctx.beginPath();
          ctx.arc(drawX, drawY, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener("resize", setSize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'overlay' }}
    />
  );
}
