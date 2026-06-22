"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause, RotateCcw, Coffee, Brain, Music, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function FocusRoomPage() {
  const [focusTime, setFocusTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [mediaUrl, setMediaUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");

  const currentTime = mode === "focus" ? focusTime : breakTime;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && currentTime > 0) {
      interval = setInterval(() => {
        if (mode === "focus") {
          setFocusTime((time) => time - 1);
        } else {
          setBreakTime((time) => time - 1);
        }
      }, 1000);
    } else if (currentTime === 0 && isActive) {
      // Auto switch modes and play sound
      try {
        const audio = new Audio('/notification.mp3'); // We might not have this, but standard practice
        audio.play().catch(() => {});
      } catch (e) {}
      
      setIsActive(false);
      if (mode === "focus") {
        setMode("break");
        setFocusTime(25 * 60); // Reset timer yang sudah selesai
      } else {
        setMode("focus");
        setBreakTime(5 * 60); // Reset timer yang sudah selesai
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, currentTime, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    if (mode === "focus") setFocusTime(25 * 60);
    else setBreakTime(5 * 60);
  };

  const setTimerMode = (newMode: "focus" | "break") => {
    setIsActive(false);
    setMode(newMode);
    // Timer tidak di-reset agar bisa kembali ke progres sebelumnya
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Logic to parse universal links into embed URLs
  const handleLoadMedia = () => {
    if (!mediaUrl) return;
    
    let finalUrl = "";
    try {
      if (mediaUrl.includes("spotify.com")) {
        // format: https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ?si=...
        const urlObj = new URL(mediaUrl);
        finalUrl = `https://open.spotify.com/embed${urlObj.pathname}`;
      } else if (mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be")) {
        let videoId = "";
        if (mediaUrl.includes("youtu.be/")) {
          videoId = mediaUrl.split("youtu.be/")[1]?.split("?")[0];
        } else {
          const urlParams = new URL(mediaUrl).searchParams;
          videoId = urlParams.get("v") || "";
        }
        if (videoId) finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } else if (mediaUrl.includes("soundcloud.com")) {
        finalUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(mediaUrl)}&auto_play=true`;
      } else {
        // Fallback default (Lofi Girl)
        finalUrl = "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1";
      }
      setEmbedUrl(finalUrl);
    } catch (e) {
      setEmbedUrl("https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1");
    }
  };

  const loadDefaultLofi = () => {
    setMediaUrl("https://www.youtube.com/watch?v=jfKfPfyJRdk");
    setEmbedUrl("https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1");
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <Link href="/#tools" className="inline-flex items-center text-muted hover:text-primary mb-8 font-bold neo-brutalist-shadow-sm bg-surface px-4 py-2 rounded-xl border-2 border-border transition-all hover:translate-y-[-2px]">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Dashboard
      </Link>

      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Left Panel: Pomodoro Timer */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="bg-surface border-4 border-border rounded-3xl p-8 neo-brutalist-shadow flex flex-col items-center">
            <h1 className="text-3xl font-black mb-6 uppercase tracking-widest text-center flex items-center gap-3">
              <Brain className="w-8 h-8 text-primary" /> Ruang Fokus
            </h1>
            
            <div className="flex bg-background border-4 border-border rounded-xl p-2 mb-8">
              <button 
                onClick={() => setTimerMode("focus")}
                className={`px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 ${mode === "focus" ? "bg-primary text-white" : "text-muted hover:bg-border"}`}
              >
                <Brain className="w-4 h-4" /> Fokus
              </button>
              <button 
                onClick={() => setTimerMode("break")}
                className={`px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 ${mode === "break" ? "bg-green-500 text-white" : "text-muted hover:bg-border"}`}
              >
                <Coffee className="w-4 h-4" /> Istirahat
              </button>
            </div>

            <div className={`text-8xl md:text-9xl font-black mb-8 tabular-nums tracking-tighter ${mode === "focus" ? "text-primary" : "text-green-500"}`}>
              {formatTime(mode === "focus" ? focusTime : breakTime)}
            </div>

            <div className="flex gap-4">
              <Button onClick={toggleTimer} className={`w-16 h-16 rounded-full flex items-center justify-center neo-brutalist-shadow hover:neo-brutalist-shadow-hover transition-all ${isActive ? 'bg-error hover:bg-error/90' : 'bg-primary'}`}>
                {isActive ? <Pause className="w-8 h-8" fill="currentColor" /> : <Play className="w-8 h-8 ml-1" fill="currentColor" />}
              </Button>
              <Button onClick={resetTimer} variant="outline" className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-border hover:bg-border transition-colors">
                <RotateCcw className="w-8 h-8 text-muted" />
              </Button>
            </div>
          </div>

          <div className="bg-[#1A1F2B] border-4 border-border rounded-3xl p-6 text-sm text-[#9CA3AF]">
            <h3 className="font-bold text-white mb-2 uppercase flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Cara Penggunaan
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Teknik Pomodoro membantu Anda tetap fokus tanpa kelelahan otak.</li>
              <li>Satu sesi Fokus = 25 menit. Konsentrasi penuhlah di sini.</li>
              <li>Satu sesi Istirahat = 5 menit. Jauhkan layar, minum air.</li>
              <li>Gunakan panel di sebelah kanan untuk memutar musik pendamping.</li>
            </ul>
          </div>
        </div>

        {/* Right Panel: Universal Music Embedder */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="bg-surface border-4 border-border rounded-3xl p-6 neo-brutalist-shadow">
            <h2 className="text-xl font-black mb-4 uppercase flex items-center gap-2">
              <Music className="w-6 h-6 text-[#10B981]" /> Pusat Media Pribadi
            </h2>
            
            <div className="flex flex-col gap-3 mb-6">
              <label className="text-sm font-bold text-muted">Tempelkan Link Musik Anda (Spotify, YouTube, SoundCloud):</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://open.spotify.com/playlist/..."
                  className="flex-1 bg-background border-4 border-border rounded-xl px-4 py-3 outline-none focus:border-primary font-mono text-sm"
                />
                <Button onClick={handleLoadMedia} className="bg-[#10B981] hover:bg-[#059669]">Putar</Button>
              </div>
              <button onClick={loadDefaultLofi} className="text-xs text-left text-muted hover:text-primary underline mt-1 w-fit">
                Atau putar stasiun Lofi Girl standar (YouTube)
              </button>
            </div>

            <div className="w-full bg-background border-4 border-border rounded-2xl h-[350px] md:h-[400px] overflow-hidden flex flex-col items-center justify-center relative">
              {embedUrl ? (
                <iframe 
                  src={embedUrl}
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                  className="absolute inset-0"
                ></iframe>
              ) : (
                <div className="flex flex-col items-center text-muted opacity-50 p-6 text-center">
                  <Music className="w-16 h-16 mb-4" />
                  <p className="font-bold">Pemutar Musik Belum Aktif</p>
                  <p className="text-sm mt-2">Masukkan link dari Spotify atau YouTube di atas untuk mulai memutar lagu.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
