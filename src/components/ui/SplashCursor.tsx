"use client";

import React, { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  vx: number;
  vy: number;
  va: number; // velocity angle
  life: number;
  decay: number;

  constructor(x: number, y: number, isBurst = false) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 12 + 8; // Ukuran kotak 8 - 20
    
    // Warna cerah ala Neo-Brutalism / Cyberpunk
    const colors = ["#3B82F6", "#10B981", "#EF4444", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4"]; 
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.angle = Math.random() * Math.PI * 2;
    
    // Jika burst (diklik), kotak melesat lebih cepat dan jauh
    const speed = isBurst ? 8 : 2;
    this.vx = (Math.random() - 0.5) * speed;
    this.vy = (Math.random() - 0.5) * speed;
    
    this.va = (Math.random() - 0.5) * 0.2; // Kecepatan putaran
    this.life = 1.0;
    this.decay = Math.random() * 0.02 + 0.01; // Kecepatan menghilang
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.va;
    this.life -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    
    // Efek Outline agar kotak lebih tegas (Brutalist style)
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    
    // Gambar kotak
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
    
    ctx.restore();
  }
}

export function SplashCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if(e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Ledakan partikel saat diklik
      for(let i = 0; i < 15; i++){
        particles.push(new Particle(e.clientX, e.clientY, true));
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("click", handleClick);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }
      
      // Hapus partikel yang sudah mati
      particles = particles.filter(p => p.life > 0);
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
    />
  );
}
