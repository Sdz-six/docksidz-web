"use client";

import { useState, useEffect, useRef } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, Radio, Volume2, VolumeX, Music, Link as LinkIcon, Check } from "lucide-react";

// Stasiun radio default menggunakan video yang terjamin bisa di-embed (Bukan Live Stream agar lebih stabil)
const DEFAULT_STATIONS = [
  { id: "5yx6BWlEVcY", name: "CHILLHOP", genre: "Chillhop" }, // VOD Lofi Clean
  { id: "CUSTOM", name: "Stasiun Kustom", genre: "Pilihan Anda Sendiri" }
];

function parseYouTubeUrl(url: string): { type: "video" | "playlist", id: string } | null {
  // Cek apakah ini adalah Playlist
  const listMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (listMatch) {
    return { type: "playlist", id: listMatch[1] };
  }

  // Cek apakah ini Video biasa
  if (url.length === 11 && !url.includes("?")) return { type: "video", id: url };
  const vidMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
  if (vidMatch) {
    return { type: "video", id: vidMatch[1] };
  }

  // Jika user langsung memasukkan ID playlist secara manual
  if (url.startsWith("PL") && url.length > 15) return { type: "playlist", id: url };

  return null;
}

export function NeoRadio() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentStation, setCurrentStation] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  // Custom URL State
  const [customUrl, setCustomUrl] = useState("");
  const [customId, setCustomId] = useState("");
  const [customType, setCustomType] = useState<"video" | "playlist">("video");
  
  // Progress State
  const [progress, setProgress] = useState(0);
  
  const playerRef = useRef<any>(null);

  const station = DEFAULT_STATIONS[currentStation];
  const activeVideoId = station.id === "CUSTOM" ? customId : station.id;

  const onReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
    setIsReady(true);
    event.target.setVolume(40);
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
    if (event.data === 1) setIsPlaying(true);
    else if (event.data === 2) setIsPlaying(false);
    else if (event.data === 0) nextStation(); // Habis
  };

  const togglePlay = () => {
    if (!playerRef.current || !activeVideoId) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const nextStation = () => {
    const nextIndex = (currentStation + 1) % DEFAULT_STATIONS.length;
    setCurrentStation(nextIndex);
    setIsPlaying(false);
    setProgress(0);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = parseYouTubeUrl(customUrl);
    if (result) {
      setCustomId(result.id);
      setCustomType(result.type);
      setIsPlaying(false);
      setProgress(0);
    } else {
      alert("Link YouTube tidak valid! Masukkan link video atau playlist yang benar.");
    }
  };

  // Real-time Progress Bar Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && playerRef.current) {
      interval = setInterval(() => {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          if (duration > 0) {
            setProgress((currentTime / duration) * 100);
          } else {
            // Untuk Live Stream, duration biasanya 0
            setProgress(100);
          }
        } catch (error) {
          // Abaikan error jika player belum siap
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeVideoId]);

  return (
    <>
      <div className="hidden">
        {activeVideoId && (
          <YouTube 
            videoId={station.id === "CUSTOM" && customType === "playlist" ? undefined : activeVideoId} 
            opts={{
              height: '0',
              width: '0',
              playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                ...(station.id === "CUSTOM" && customType === "playlist" && {
                  listType: 'playlist',
                  list: activeVideoId
                })
              },
            }} 
            onReady={onReady} 
            onStateChange={onStateChange} 
          />
        )}
      </div>

      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="mb-4 bg-surface border-4 border-border p-4 rounded-2xl neo-brutalist-shadow w-[280px]"
            >
              <div className="flex justify-between items-start mb-4 border-b-2 border-border/50 pb-3">
                <div>
                  <h3 className="font-black text-lg text-primary tracking-tight leading-tight">{station.name}</h3>
                  <p className="text-xs font-bold text-muted uppercase mt-1 px-2 py-1 bg-black/10 inline-block rounded-md">
                    CH {currentStation + 1} • {station.genre}
                  </p>
                </div>
                <div className={`p-2 rounded-full border-2 border-border ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}>
                  <Music className="w-4 h-4 text-border" />
                </div>
              </div>

              {/* Form Input Custom URL */}
              {station.id === "CUSTOM" && (
                <form onSubmit={handleCustomSubmit} className="mb-4 flex gap-2">
                  <input 
                    type="text" 
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="Paste link YouTube..."
                    className="w-full text-xs p-2 rounded-lg border-2 border-border bg-background text-text focus:outline-none focus:border-primary"
                  />
                  <button 
                    type="submit" 
                    className="bg-primary text-white p-2 rounded-lg border-2 border-border hover:bg-primary-hover active:scale-95 transition-all"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </form>
              )}

              <div className="flex items-center justify-between gap-2">
                <button 
                  onClick={toggleMute}
                  disabled={!isReady || (!activeVideoId && station.id === "CUSTOM")}
                  className="p-3 bg-background border-2 border-border rounded-xl hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                <button 
                  onClick={togglePlay}
                  disabled={!isReady || (!activeVideoId && station.id === "CUSTOM")}
                  className="p-3 flex-1 flex justify-center bg-primary text-white border-2 border-border rounded-xl hover:bg-primary-hover active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                </button>

                <button 
                  onClick={nextStation}
                  className="p-3 bg-background border-2 border-border rounded-xl hover:bg-primary hover:text-white transition-colors"
                >
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>
              </div>

              {/* Real-time Status Bar */}
              <div className="mt-4 h-2 w-full bg-border/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${progress >= 99 ? 'bg-green-400 animate-pulse' : 'bg-primary'} transition-all duration-1000 ease-linear`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-3 border-4 border-border rounded-2xl neo-brutalist-shadow-sm font-black transition-colors ${isOpen || isPlaying ? 'bg-primary text-white' : 'bg-surface text-primary'}`}
        >
          <Radio className={`w-6 h-6 ${isPlaying && !isOpen ? 'animate-bounce' : ''}`} />
          {isOpen ? 'Tutup Radio' : isPlaying ? 'Radio Menyala' : 'Radio FM'}
        </motion.button>
      </div>
    </>
  );
}
