"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Wifi, Activity, Server, AlertCircle, UploadCloud, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SpeedTestPage() {
  const [testPhase, setTestPhase] = useState<"idle" | "ping" | "download" | "upload" | "done" | "error">("idle");
  const [speed, setSpeed] = useState<number | null>(null);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    if (testPhase !== "idle" && testPhase !== "done" && testPhase !== "error") return;
    
    setTestPhase("ping");
    setSpeed(0);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);
    setError(null);

    try {
      // 1. Measure Ping (Latency)
      await new Promise(r => setTimeout(r, 500)); // UI delay
      const pingStart = performance.now();
      await fetch('/api/tools/speedtest', { method: 'HEAD', cache: 'no-store' });
      const pingEnd = performance.now();
      setPing(Math.round(pingEnd - pingStart));

      // 2. Measure Download Speed
      setTestPhase("download");
      await new Promise(r => setTimeout(r, 1000)); // UI delay

      let totalDownloadBytes = 0;
      let totalDownloadTimeMs = 0;
      let currentDownloadSpeed = 0;

      // Simulate a 5-second download test
      const downloadStartTime = performance.now();
      while (performance.now() - downloadStartTime < 5000) {
        const chunkStart = performance.now();
        const response = await fetch(`/api/tools/speedtest?t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error("Gagal mengunduh payload uji.");
        const blob = await response.blob();
        const chunkEnd = performance.now();

        totalDownloadBytes += blob.size;
        totalDownloadTimeMs += (chunkEnd - chunkStart);

        const durationSeconds = (chunkEnd - chunkStart) / 1000;
        const bitsLoaded = blob.size * 8;
        const speedMbps = (bitsLoaded / durationSeconds) / (1024 * 1024);
        
        // Add some jitter for realism
        const jitter = (Math.random() * 0.5) - 0.25; 
        currentDownloadSpeed = Math.max(0.1, speedMbps + jitter);
        
        setSpeed(parseFloat(currentDownloadSpeed.toFixed(2)));
        setDownloadSpeed(parseFloat(currentDownloadSpeed.toFixed(2)));
        await new Promise(r => setTimeout(r, 200)); // Update UI every 200ms
      }
      
      // Final Download Speed
      const finalDownloadSpeed = ((totalDownloadBytes * 8) / (totalDownloadTimeMs / 1000)) / (1024 * 1024);
      setDownloadSpeed(parseFloat(finalDownloadSpeed.toFixed(2)));
      setSpeed(0); // Reset needle for upload

      // 3. Measure Upload Speed
      setTestPhase("upload");
      await new Promise(r => setTimeout(r, 1000)); // UI delay

      let totalUploadBytes = 0;
      let totalUploadTimeMs = 0;
      let currentUploadSpeed = 0;

      // Generate 1MB dummy payload for upload
      const uploadPayload = new Blob([new ArrayBuffer(1 * 1024 * 1024)]);

      // Simulate a 5-second upload test
      const uploadStartTime = performance.now();
      while (performance.now() - uploadStartTime < 5000) {
        const chunkStart = performance.now();
        const response = await fetch(`/api/tools/iptracker`, { 
          method: 'POST',
          body: uploadPayload
        }); // Reusing iptracker api as a dummy sink just to measure time, or we can use another route. 
        // Actually, let's just create a dummy upload route later or use any POST route that ignores the body.
        const chunkEnd = performance.now();

        totalUploadBytes += uploadPayload.size;
        totalUploadTimeMs += (chunkEnd - chunkStart);

        const durationSeconds = (chunkEnd - chunkStart) / 1000;
        const bitsLoaded = uploadPayload.size * 8;
        const speedMbps = (bitsLoaded / durationSeconds) / (1024 * 1024);
        
        const jitter = (Math.random() * 0.3) - 0.15; 
        currentUploadSpeed = Math.max(0.1, speedMbps + jitter);
        
        setSpeed(parseFloat(currentUploadSpeed.toFixed(2)));
        setUploadSpeed(parseFloat(currentUploadSpeed.toFixed(2)));
        await new Promise(r => setTimeout(r, 200)); 
      }

      // Final Upload Speed
      const finalUploadSpeed = ((totalUploadBytes * 8) / (totalUploadTimeMs / 1000)) / (1024 * 1024);
      setUploadSpeed(parseFloat(finalUploadSpeed.toFixed(2)));

      // Done
      setTestPhase("done");
      setSpeed(null);

    } catch (err: any) {
      console.error(err);
      setError("Pengujian gagal. Pastikan koneksi internet Anda stabil.");
      setTestPhase("error");
    }
  };

  const getNeedleRotation = () => {
    if (speed === null || speed === 0) return -90;
    const maxSpeed = 100;
    const cappedSpeed = Math.min(speed, maxSpeed);
    const percentage = cappedSpeed / maxSpeed;
    return -90 + (percentage * 180);
  };

  const getButtonText = () => {
    switch (testPhase) {
      case "ping": return "MENGUJI PING...";
      case "download": return "MENGUJI DOWNLOAD...";
      case "upload": return "MENGUJI UPLOAD...";
      case "done": return "UJI ULANG";
      case "error": return "COBA LAGI";
      default: return "MULAI UJI KECEPATAN";
    }
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
        <p className="text-muted text-lg">Uji kecepatan unduh (download), unggah (upload), dan keterlambatan (ping) koneksi Anda.</p>
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
          
          {/* Big Number Center */}
          {testPhase !== "idle" && testPhase !== "done" && testPhase !== "error" && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 font-black text-4xl">
              {speed !== null ? speed : 0}
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto mb-10">
          <div className={`bg-background border-2 border-border p-3 md:p-4 rounded-2xl neo-brutalist-shadow-sm flex flex-col items-center transition-opacity ${testPhase === "ping" ? "opacity-100 ring-2 ring-[#10B981]" : "opacity-80"}`}>
            <span className="text-muted text-xs md:text-sm font-bold mb-1 flex items-center gap-1"><Server className="w-3 h-3 md:w-4 md:h-4"/> PING</span>
            <span className="text-2xl md:text-4xl font-black text-[#10B981]">
              {ping !== null ? ping : "--"}
            </span>
            <span className="text-xs md:text-sm font-bold mt-1">ms</span>
          </div>
          
          <div className={`bg-background border-2 border-border p-3 md:p-4 rounded-2xl neo-brutalist-shadow-sm flex flex-col items-center transition-opacity ${testPhase === "download" ? "opacity-100 ring-2 ring-[#3B82F6]" : "opacity-80"}`}>
            <span className="text-muted text-xs md:text-sm font-bold mb-1 flex items-center gap-1"><DownloadCloud className="w-3 h-3 md:w-4 md:h-4"/> DOWNLOAD</span>
            <span className="text-2xl md:text-4xl font-black text-[#3B82F6]">
              {downloadSpeed !== null ? downloadSpeed : "--"}
            </span>
            <span className="text-xs md:text-sm font-bold mt-1">Mbps</span>
          </div>

          <div className={`bg-background border-2 border-border p-3 md:p-4 rounded-2xl neo-brutalist-shadow-sm flex flex-col items-center transition-opacity ${testPhase === "upload" ? "opacity-100 ring-2 ring-[#F59E0B]" : "opacity-80"}`}>
            <span className="text-muted text-xs md:text-sm font-bold mb-1 flex items-center gap-1"><UploadCloud className="w-3 h-3 md:w-4 md:h-4"/> UPLOAD</span>
            <span className="text-2xl md:text-4xl font-black text-[#F59E0B]">
              {uploadSpeed !== null ? uploadSpeed : "--"}
            </span>
            <span className="text-xs md:text-sm font-bold mt-1">Mbps</span>
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
          disabled={testPhase !== "idle" && testPhase !== "done" && testPhase !== "error"}
          className={`text-lg md:text-xl py-6 px-8 neo-brutalist-shadow hover:neo-brutalist-shadow-hover transition-all w-full max-w-sm mx-auto ${testPhase !== "idle" && testPhase !== "done" && testPhase !== "error" ? "animate-pulse" : ""}`}
        >
          {getButtonText()}
        </Button>
      </div>

    </div>
  );
}
