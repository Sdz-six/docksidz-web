"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Play, RotateCcw, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

const COLORS = [
  "#FF5733", "#33FF57", "#3357FF", "#F033FF", "#33FFF0",
  "#FFC300", "#FF3380", "#80FF33", "#3380FF", "#8033FF"
];

export default function SpinWheelPage() {
  const [options, setOptions] = useState<string>("Sate Ayam\nNasi Goreng\nMie Ayam\nBakso\nAyam Geprek");
  const [segments, setSegments] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    const lines = options.split("\n").filter(line => line.trim() !== "");
    if (lines.length === 0) {
      setSegments(["Kosong"]);
    } else {
      setSegments(lines);
    }
  }, [options]);

  const spinWheel = () => {
    if (isSpinning || segments.length < 2) return;
    
    setIsSpinning(true);
    setWinner(null);

    const segmentAngle = 360 / segments.length;
    const randomSegmentIndex = Math.floor(Math.random() * segments.length);
    
    const extraSpins = 5 * 360; 
    const targetAngle = 360 - (randomSegmentIndex * segmentAngle) - (segmentAngle / 2);
    
    const randomOffset = (Math.random() * segmentAngle * 0.8) - (segmentAngle * 0.4);

    const finalRotation = rotation + extraSpins + 360 - (rotation % 360) + targetAngle + randomOffset;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const won = segments[randomSegmentIndex];
      setWinner(won);
      fireConfetti();

      // Simpan ke riwayat
      try {
        const historyData = localStorage.getItem("docksidz_history");
        const history = historyData ? JSON.parse(historyData) : [];
        history.push({ 
          id: Date.now().toString(), 
          name: `Pemenang: ${won}`, 
          type: "Spin Wheel", 
          url: "", 
          timestamp: Date.now() 
        });
        localStorage.setItem("docksidz_history", JSON.stringify(history));
        window.dispatchEvent(new Event("history-updated"));
      } catch (e) {}

    }, 5000); 
  };

  const fireConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const getConicGradient = () => {
    if (segments.length === 0) return "conic-gradient(#ccc 0 100%)";
    const segmentPercentage = 100 / segments.length;
    let gradientParts = [];
    for (let i = 0; i < segments.length; i++) {
      const color = COLORS[i % COLORS.length];
      gradientParts.push(`${color} ${i * segmentPercentage}% ${(i + 1) * segmentPercentage}%`);
    }
    return `conic-gradient(${gradientParts.join(', ')})`;
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <Link href="/#tools" className="inline-flex items-center text-muted hover:text-primary mb-8 font-bold neo-brutalist-shadow-sm bg-surface px-4 py-2 rounded-xl border-2 border-border transition-all hover:translate-y-[-2px]">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Dashboard
      </Link>

      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-black mb-4">Spin the Wheel</h1>
        <p className="text-muted text-lg">Roda keberuntungan untuk mengambil keputusan acak. Masukkan pilihan Anda dan putar rodanya!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Input Panel */}
        <div className="bg-surface border-4 border-border rounded-2xl p-6 neo-brutalist-shadow">
          <h2 className="text-2xl font-bold mb-4">Daftar Pilihan</h2>
          <div className="mb-4">
            <textarea
              className="w-full h-48 p-4 bg-background border-2 border-border rounded-xl resize-none font-medium focus:outline-none focus:ring-2 focus:ring-primary neo-brutalist-shadow-sm"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              placeholder="Masukkan pilihan di sini (satu per baris)..."
              disabled={isSpinning}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setOptions("")}
              variant="outline"
              className="w-1/3 flex items-center justify-center gap-2"
              disabled={isSpinning}
            >
              <Trash2 className="w-5 h-5" /> Bersihkan
            </Button>
            <Button
              onClick={() => setOptions("Sate Ayam\nNasi Goreng\nMie Ayam\nBakso\nAyam Geprek")}
              variant="outline"
              className="w-2/3 flex items-center justify-center gap-2"
              disabled={isSpinning}
            >
              <RotateCcw className="w-5 h-5" /> Reset
            </Button>
          </div>
          <p className="text-sm text-muted mt-4 font-bold">Total pilihan aktif: {segments.length}</p>
        </div>

        {/* Wheel Panel */}
        <div className="flex flex-col items-center justify-center relative bg-surface border-4 border-border rounded-2xl p-8 neo-brutalist-shadow overflow-hidden min-h-[450px]">
          {/* Pointer */}
          <div className="absolute top-4 z-10 text-[#111844] drop-shadow-md">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="transform rotate-180">
              <path d="M12 2L2 22h20L12 2z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>

          {/* The Wheel */}
          <div className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px] rounded-full border-4 border-border neo-brutalist-shadow-sm bg-background mb-8 overflow-hidden shadow-[inset_0px_0px_10px_rgba(0,0,0,0.5)]">
            <motion.div
              className="w-full h-full rounded-full"
              style={{ background: getConicGradient() }}
              animate={{ rotate: rotation }}
              transition={{ duration: 5, ease: [0.1, 0.8, 0.1, 1] }} 
            >
              {segments.map((segment, index) => {
                const rotationAngle = (360 / segments.length) * index + (360 / segments.length) / 2 - 90;
                return (
                  <div
                    key={index}
                    className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none"
                    style={{ transform: `rotate(${rotationAngle}deg)` }}
                  >
                    <span 
                      className="absolute right-4 md:right-8 text-xs md:text-sm font-black text-white uppercase drop-shadow-md truncate max-w-[90px] md:max-w-[120px]"
                      style={{ textShadow: "2px 2px 0px #111844, -1px -1px 0px #111844, 1px -1px 0px #111844, -1px 1px 0px #111844" }}
                    >
                      {segment}
                    </span>
                  </div>
                );
              })}
            </motion.div>
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border-4 border-border rounded-full z-20 shadow-[2px_2px_0px_#111844]">
              <div className="w-full h-full rounded-full bg-border opacity-20"></div>
            </div>
          </div>

          <Button
            onClick={spinWheel}
            variant="primary"
            className="w-full text-xl py-6 flex items-center justify-center gap-2 shadow-[4px_4px_0px_#111844] hover:shadow-[2px_2px_0px_#111844] hover:translate-y-[2px]"
            disabled={isSpinning || segments.length < 2}
          >
            <Play className="w-6 h-6 fill-current" /> PUTAR RODA
          </Button>

          {/* Winner Banner */}
          {winner && !isSpinning && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center z-40 p-4 backdrop-blur-sm"
              onClick={() => setWinner(null)}
            >
              <div 
                className="bg-surface border-4 border-border rounded-2xl p-8 text-center max-w-sm w-full shadow-[8px_8px_0px_#111844]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center border-4 border-border mx-auto mb-4 neo-brutalist-shadow-sm">
                  <span className="text-3xl">🎉</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-muted">Selamat! Pilihan jatuh pada:</h3>
                <p className="text-3xl md:text-4xl font-black text-primary mb-8 break-words uppercase">{winner}</p>
                <Button variant="primary" className="w-full" onClick={() => setWinner(null)}>Lanjutkan</Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
