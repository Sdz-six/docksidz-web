"use client";

import React, { useEffect, useRef } from "react";

let audioCtx: AudioContext | null = null;

function playBubbleSound() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(1, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch (error) {
    // Abaikan error audio di perangkat yang tidak mendukung
  }
}

class Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  life: number;
  decay: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 10 + 6; // Ukuran kotak dikurangi
    
    // Warna cerah
    const colors = ["#3B82F6", "#10B981", "#EF4444", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4"]; 
    this.color = colors[Math.floor(Math.random() * colors.length)];
    
    // Meluncur dengan kecepatan rendah
    const speed = 2.5;
    this.vx = (Math.random() - 0.5) * speed;
    this.vy = (Math.random() - 0.5) * speed;
    
    this.life = 1.0;
    this.decay = 0.03; // Menghilang lebih cepat agar memori lekas kosong
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
  }

  // Draw super ringan: Tanpa Outline, Tanpa Rotasi, Tanpa Save/Restore State
  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

export function SplashCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true }); // Tanpa desync dsb, cukup murni
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleClick = (e: MouseEvent) => {
      playBubbleSound();
      // Jumlah partikel dikurangi menjadi hanya 5 kotak per klik
      for(let i = 0; i < 5; i++){
        particles.push(new Particle(e.clientX, e.clientY));
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }
      
      // Hapus partikel yang sudah mati dari RAM
      particles = particles.filter(p => p.life > 0);
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
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
