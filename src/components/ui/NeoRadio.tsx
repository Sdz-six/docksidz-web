"use client";

import { useState, useEffect, useRef } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, Radio, Volume2, VolumeX, Music } from "lucide-react";

// Menggunakan Video Berdurasi Panjang (Mix 1-2 Jam) sebagai "Stasiun Radio"
// Ini lebih aman daripada Playlist yang sering dihapus oleh pembuatnya.
const STATIONS = [
  { id: "1fueZCTYkpA", name: "Hujan & Kenangan", genre: "Lo-Fi Chill" },
  { id: "4xDzrIxZZNc", name: "Fokus Tingkat Dewa", genre: "Synthwave / Cyberpunk" },
  { id: "uWw93iQk2n0", name: "Doping Programmer", genre: "Aggressive Phonk" },
  { id: "W1wW6a0XyGE", name: "Warung Kopi Malam", genre: "Acoustic Cafe" }
];

export function NeoRadio() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentStation, setCurrentStation] = useState(0);
  const [playerInfo, setPlayerInfo] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  
  // Referensi ke player YouTube
  const playerRef = useRef<any>(null);

  const onReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
    setIsReady(true);
    // Set volume default agak rendah agar tidak mengagetkan
    event.target.setVolume(30);
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
    // 1 = playing, 2 = paused, 0 = ended
    if (event.data === 1) setIsPlaying(true);
    else if (event.data === 2) setIsPlaying(false);
    else if (event.data === 0) nextStation(); // Otomatis pindah jika video habis
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
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
    const nextIndex = (currentStation + 1) % STATIONS.length;
    setCurrentStation(nextIndex);
    setIsPlaying(false); // Reset state loading
  };

  const station = STATIONS[currentStation];

  return (
    <>
      {/* Player YouTube Tersembunyi */}
      <div className="hidden">
        <YouTube 
          videoId={station.id} 
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 1, // Otomatis main saat ganti stasiun
              controls: 0,
              disablekb: 1,
            },
          }} 
          onReady={onReady} 
          onStateChange={onStateChange} 
        />
      </div>

      {/* UI Pemutar Radio */}
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

              <div className="flex items-center justify-between gap-2">
                <button 
                  onClick={toggleMute}
                  disabled={!isReady}
                  className="p-3 bg-background border-2 border-border rounded-xl hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                <button 
                  onClick={togglePlay}
                  disabled={!isReady}
                  className="p-3 flex-1 flex justify-center bg-primary text-white border-2 border-border rounded-xl hover:bg-primary-hover active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                </button>

                <button 
                  onClick={nextStation}
                  disabled={!isReady}
                  className="p-3 bg-background border-2 border-border rounded-xl hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>
              </div>

              {/* Status Bar Ala Kaset */}
              <div className="mt-4 h-2 w-full bg-border/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  animate={{ 
                    width: isPlaying ? ["0%", "100%"] : "0%"
                  }}
                  transition={{ 
                    duration: 3600, // Simulasi progress 1 jam
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tombol Toggle Radio */}
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
