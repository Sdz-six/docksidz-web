"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, AlertTriangle } from "lucide-react";

interface MascotGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MascotGame({ isOpen, onClose }: MascotGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [highScore, setHighScore] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  // Ref untuk nyimpen state yang dipakai di dalam requestAnimationFrame
  const gameState = useRef({
    birdY: 300,
    velocity: 0,
    gravity: 0.4, // Lebih lambat jatuhnya
    jumpStrength: -7, // Loncatan lebih lembut
    pipes: [] as { x: number, y: number, passed: boolean }[],
    pipeWidth: 60,
    pipeGap: 220, // Celah lebih lebar agar mudah
    score: 0,
    isGameOver: false,
    isStarted: false,
    mascotImg: null as HTMLImageElement | null
  });

  // Load Highscore & Mascot Image
  useEffect(() => {
    if (isOpen) {
      const savedScore = localStorage.getItem("docksidz_highscore");
      if (savedScore) setHighScore(parseInt(savedScore));

      const savedMascot = localStorage.getItem("docksidz_mascot") || "/mascot.png";
      const img = new Image();
      img.src = savedMascot;
      img.onload = () => {
        gameState.current.mascotImg = img;
      };

      // Reset state
      resetGame();
    }
  }, [isOpen]);

  const resetGame = () => {
    gameState.current = {
      ...gameState.current,
      birdY: 300,
      velocity: 0,
      pipes: [],
      score: 0,
      isGameOver: false,
      isStarted: false
    };
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setCountdown(null);
  };

  const startCountdown = () => {
    setCountdown(3);
    let currentCount = 3;
    
    const countInterval = setInterval(() => {
      currentCount -= 1;
      if (currentCount > 0) {
        setCountdown(currentCount);
      } else if (currentCount === 0) {
        setCountdown("GO!" as unknown as number);
      } else {
        clearInterval(countInterval);
        setCountdown(null);
        gameState.current.isStarted = true;
        setGameStarted(true);
        gameState.current.velocity = gameState.current.jumpStrength; // Lompatan awal
      }
    }, 1000);
  };

  const jump = () => {
    if (countdown !== null) return; // Blokir input selama hitung mundur

    if (gameState.current.isGameOver) {
      resetGame();
      startCountdown();
      return;
    }
    if (!gameState.current.isStarted) {
      startCountdown();
      return;
    }
    gameState.current.velocity = gameState.current.jumpStrength;
  };

  // Game Loop
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let frameCount = 0;

    const render = () => {
      const state = gameState.current;
      
      // Bersihkan kanvas
      ctx.fillStyle = "#111844"; // bg-primary
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gambar grid retro background
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 2;
      for(let i=0; i<canvas.width; i+=40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for(let i=0; i<canvas.height; i+=40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      if (state.isStarted && !state.isGameOver) {
        // Fisika Burung
        state.velocity += state.gravity;
        state.birdY += state.velocity;

        // Munculkan Pipa
        frameCount++;
        if (frameCount % 120 === 0) { // Jarak antar pipa lebih jauh
          const minPipeY = 100;
          const maxPipeY = canvas.height - state.pipeGap - 100;
          const topPipeY = Math.random() * (maxPipeY - minPipeY) + minPipeY;
          state.pipes.push({ x: canvas.width, y: topPipeY, passed: false });
        }

        // Update Pipa & Deteksi Tabrakan
        for (let i = state.pipes.length - 1; i >= 0; i--) {
          const p = state.pipes[i];
          p.x -= 3; // Kecepatan geser lebih lambat (sebelumnya 4)

          // Gambar Pipa Atas
          ctx.fillStyle = "#EF4444"; // Merah neo-brutalist
          ctx.fillRect(p.x, 0, state.pipeWidth, p.y);
          ctx.lineWidth = 4;
          ctx.strokeStyle = "#1A1A2E";
          ctx.strokeRect(p.x, 0, state.pipeWidth, p.y);

          // Gambar Pipa Bawah
          const bottomPipeY = p.y + state.pipeGap;
          ctx.fillRect(p.x, bottomPipeY, state.pipeWidth, canvas.height - bottomPipeY);
          ctx.strokeRect(p.x, bottomPipeY, state.pipeWidth, canvas.height - bottomPipeY);

          // Hitbox deteksi tabrakan
          const birdX = 100; // Posisi X burung selalu di 100
          const birdSize = 30; // Ukuran hitbox diperkecil agar lebih memaafkan (sebelumnya 40)
          
          if (
            birdX + birdSize > p.x && 
            birdX < p.x + state.pipeWidth && 
            (state.birdY < p.y || state.birdY + birdSize > bottomPipeY)
          ) {
            state.isGameOver = true;
          }

          // Skor
          if (p.x + state.pipeWidth < birdX && !p.passed) {
            state.score += 1;
            p.passed = true;
            setScore(state.score);
            if (state.score > highScore) {
              setHighScore(state.score);
              localStorage.setItem("docksidz_highscore", state.score.toString());
            }
          }

          // Hapus pipa yang sudah lewat layar
          if (p.x + state.pipeWidth < 0) {
            state.pipes.splice(i, 1);
          }
        }

        // Tabrak Tanah atau Langit
        if (state.birdY > canvas.height - 40 || state.birdY < 0) {
          state.isGameOver = true;
        }
      }

      // Gambar Maskot (Burung)
      if (state.mascotImg) {
        ctx.drawImage(state.mascotImg, 100, state.birdY, 50, 50);
      } else {
        ctx.fillStyle = "#22C55E";
        ctx.fillRect(100, state.birdY, 40, 40);
        ctx.strokeRect(100, state.birdY, 40, 40);
      }

      if (state.isGameOver && !gameOver) {
        setGameOver(true);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isOpen, highScore, gameOver]);

  // Handle Keyboard Jump
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative bg-surface border-4 border-border rounded-2xl neo-brutalist-shadow overflow-hidden max-w-[800px] w-full"
      >
        <div className="flex justify-between items-center p-4 border-b-4 border-border bg-primary text-white">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-yellow-400" />
            <h2 className="text-xl font-black tracking-widest">AREA RAHASIA: FLAPPY MASCOT</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-red-500 border-2 border-border rounded-lg hover:bg-red-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div 
          className="relative w-full h-[500px] cursor-pointer"
          onClick={jump}
        >
          <canvas 
            ref={canvasRef}
            width={800}
            height={500}
            className="w-full h-full object-cover"
          />

          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none bg-black/40 backdrop-blur-sm">
              <motion.h3 
                key={countdown}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="text-8xl font-black text-white drop-shadow-[6px_6px_0_#EF4444]"
              >
                {countdown}
              </motion.h3>
            </div>
          )}

          {!gameStarted && !gameOver && countdown === null && (
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <h3 className="text-4xl md:text-5xl font-black text-white drop-shadow-[4px_4px_0_#1A1A2E] mb-4 text-center">TEKAN SPASI / KLIK</h3>
              <p className="text-white font-bold neo-brutalist-shadow-sm px-4 py-2 bg-primary border-2 border-border rounded-lg">Terbang melewati rintangan!</p>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none bg-black/50 backdrop-blur-sm">
              <h3 className="text-6xl font-black text-red-500 drop-shadow-[4px_4px_0_#1A1A2E] mb-2">NABRAK!</h3>
              <p className="text-2xl text-white font-bold mb-6 drop-shadow-[2px_2px_0_#1A1A2E]">Skor Anda: {score}</p>
              <button className="px-8 py-3 bg-green-500 text-white font-black text-xl border-4 border-border rounded-xl neo-brutalist-shadow hover:-translate-y-1 transition-transform pointer-events-auto">
                MAIN LAGI
              </button>
            </div>
          )}

          <div className="absolute top-4 right-4 flex gap-4 pointer-events-none">
            <div className="px-4 py-2 bg-surface border-4 border-border rounded-xl neo-brutalist-shadow flex flex-col items-center">
              <span className="text-xs font-bold text-muted uppercase">Skor</span>
              <span className="text-3xl font-black text-primary">{score}</span>
            </div>
            <div className="px-4 py-2 bg-[#F59E0B] border-4 border-border rounded-xl neo-brutalist-shadow flex flex-col items-center">
              <span className="text-xs font-bold text-[#1A1A2E] uppercase flex items-center gap-1"><Trophy className="w-3 h-3"/> Tertinggi</span>
              <span className="text-3xl font-black text-[#1A1A2E]">{highScore}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
