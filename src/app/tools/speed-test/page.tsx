"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Wifi, Activity, Server, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SpeedTestPage() {
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Animation ref
  const speedRef = useRef(0);

  const runTest = async () => {
    if (isTesting) return;
    
    setIsTesting(true);
    setProgress(0);
    setSpeed(0);
    setPing(0);
    setError(null);
    speedRef.current = 0;

    try {
      // 1. Measure Ping (Latency)
      const pingStart = performance.now();
      await fetch('/api/tools/speedtest', { method: 'HEAD', cache: 'no-store' });
      const pingEnd = performance.now();
      const currentPing = Math.round(pingEnd - pingStart);
      setPing(currentPing);
      setProgress(20);

      // 2. Measure Download Speed
      // We will download the 2MB payload 3 times to get an average and show progress
      const fileSizeInBytes = 2 * 1024 * 1024;
      let totalBytes = 0;
      let totalTimeMs = 0;

      for (let i = 0; i < 3; i++) {
        const startTime = performance.now();
        const response = await fetch(`/api/tools/speedtest?t=${Date.now()}`, { cache: 'no-store' });
        
        if (!response.ok) throw new Error("Gagal mengunduh payload uji.");
        
        const blob = await response.blob();
        const endTime = performance.now();
        
        totalBytes += blob.size;
        totalTimeMs += (endTime - startTime);
        
        // Calculate intermediate speed
        const durationSeconds = (endTime - startTime) / 1000;
        const bitsLoaded = blob.size * 8;
        const speedBps = bitsLoaded / durationSeconds;
        const speedMbps = speedBps / (1024 * 1024);
        
        speedRef.current = speedMbps;
        setSpeed(parseFloat(speedMbps.toFixed(2)));
        setProgress(20 + ((i + 1) / 3) * 80);
      }

      // Calculate Final Average Speed
      const finalDurationSeconds = totalTimeMs / 1000;
      const finalBitsLoaded = totalBytes * 8;
      const finalSpeedBps = finalBitsLoaded / finalDurationSeconds;
      const finalSpeedMbps = finalSpeedBps / (1024 * 1024);

      setSpeed(parseFloat(finalSpeedMbps.toFixed(2)));
      setProgress(100);

    } catch (err: any) {
      console.error(err);
      setError("Pengujian gagal. Pastikan koneksi internet Anda stabil.");
    } finally {
      setIsTesting(false);
    }
  };

  // Convert speed to degree for speedometer needle (-90 to 90 degrees)
  const getNeedleRotation = () => {
    if (speed === null || speed === 0) return -90;
    // Let's cap the visual meter at 100 Mbps
    const maxSpeed = 100;
    const cappedSpeed = Math.min(speed, maxSpeed);
    const percentage = cappedSpeed / maxSpeed;
    return -90 + (percentage * 180);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <Link href="/#tools" className="inline-flex items-center text-muted hover:text-primary mb-8 font-bold neo-brutalist-shadow-sm bg-surface px-4 py-2 rounded-xl border-2 border-border transition-all hover:translate-y-[-2px]">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Dashboard
      </Link>

      <div className="mb-8 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
          <div className="bg-[#3B82F6] p-3 rounded-xl neo-brutalist-shadow-sm border-2 border-border">
            <Wifi className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black">Internet Speed Test</h1>
        </div>
        <p className="text-muted text-lg">Uji kecepatan unduh (download) dan tingkat keterlambatan (ping) koneksi Anda.</p>
      </div>

      <div className="bg-surface border-4 border-border rounded-3xl p-6 md:p-12 neo-brutalist-shadow mb-10 text-center">
        
        {/* Speedometer Visual */}
        <div className="relative w-[280px] h-[140px] md:w-[400px] md:h-[200px] mx-auto mb-8 overflow-hidden">
          {/* Arch background */}
          <div className="absolute bottom-0 left-0 w-full h-[280px] md:h-[400px] rounded-full border-[15px] md:border-[20px] border-background border-t-[#3B82F6] border-l-[#10B981] border-r-[#F59E0B] transform -rotate-45"></div>
          
          {/* Numbers */}
          <span className="absolute bottom-2 left-4 md:left-8 font-bold text-muted">0</span>
          <span className="absolute top-4 left-1/2 -translate-x-1/2 font-bold text-muted">50</span>
          <span className="absolute bottom-2 right-4 md:right-8 font-bold text-muted">100+</span>

          {/* Needle */}
          <motion.div 
            className="absolute bottom-0 left-1/2 w-2 h-[120px] md:h-[160px] bg-primary origin-bottom rounded-t-full z-10"
            style={{ x: "-50%" }}
            animate={{ rotate: getNeedleRotation() }}
            transition={{ type: "spring", stiffness: 50, damping: 10 }}
          />
          {/* Center dot */}
          <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-6 h-6 bg-border rounded-full z-20"></div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-10">
          <div className="bg-background border-2 border-border p-4 rounded-2xl neo-brutalist-shadow-sm flex flex-col items-center">
            <span className="text-muted font-bold mb-1 flex items-center gap-1"><Activity className="w-4 h-4"/> DOWNLOAD</span>
            <span className="text-3xl md:text-4xl font-black text-[#3B82F6]">
              {speed !== null ? speed : "--"}
            </span>
            <span className="text-sm font-bold mt-1">Mbps</span>
          </div>
          <div className="bg-background border-2 border-border p-4 rounded-2xl neo-brutalist-shadow-sm flex flex-col items-center">
            <span className="text-muted font-bold mb-1 flex items-center gap-1"><Server className="w-4 h-4"/> PING</span>
            <span className="text-3xl md:text-4xl font-black text-[#10B981]">
              {ping !== null ? ping : "--"}
            </span>
            <span className="text-sm font-bold mt-1">ms</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 rounded-xl text-red-700 flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-bold">{error}</span>
          </div>
        )}

        <Button 
          onClick={runTest} 
          disabled={isTesting}
          className="text-xl py-6 px-12 neo-brutalist-shadow hover:neo-brutalist-shadow-hover transition-all w-full max-w-sm mx-auto"
        >
          {isTesting ? `MENGUJI... ${Math.round(progress)}%` : "MULAI UJI KECEPATAN"}
        </Button>
      </div>

    </div>
  );
}
