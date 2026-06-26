"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Music, Disc, Calendar, ExternalLink, PlaySquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LyricsResult {
  id: number;
  title: string;
  url: string;
  artist: string;
  album: string | null;
  albumCover: string;
  releaseDate: string | null;
  description: string | null;
  spotifyUrl: string | null;
  youtubeUrl: string | null;
  appleMusicUrl: string | null;
  lyrics: string;
}

export default function LyricsSearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LyricsResult | null>(null);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/tools/lyrics-search?text=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan saat mencari lirik.");
      }

      if (data.status === true && data.result) {
        setResult(data.result);
        
        // Simpan ke riwayat
        try {
          const historyData = localStorage.getItem("docksidz_history");
          const history = historyData ? JSON.parse(historyData) : [];
          history.push({
            id: Date.now().toString(),
            name: `${data.result.title} - ${data.result.artist}`,
            type: "Pencarian Lirik",
            url: "", 
            timestamp: Date.now()
          });
          localStorage.setItem("docksidz_history", JSON.stringify(history));
          window.dispatchEvent(new Event("history-updated"));
        } catch (e) {}
      } else {
        throw new Error("Lagu tidak ditemukan atau respons API tidak valid.");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/#tools" className="inline-flex items-center text-muted hover:text-primary mb-8 font-bold neo-brutalist-shadow-sm bg-surface px-4 py-2 rounded-xl border-2 border-border transition-all hover:translate-y-[-2px]">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Dashboard
      </Link>

      <div className="bg-surface border-4 border-border rounded-3xl p-6 md:p-10 neo-brutalist-shadow mb-10 relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Music className="w-40 h-40" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#8B5CF6] p-4 rounded-2xl neo-brutalist-shadow-sm border-4 border-border">
              <Search className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-text tracking-tight">Pencari Lirik Lagu</h1>
              <p className="text-muted text-lg mt-1 font-medium">Temukan lirik lengkap, metadata, dan link pemutar musik instan.</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Masukkan judul lagu atau lirik... (contoh: Mawar Jingga)"
                className="w-full bg-background border-4 border-border rounded-2xl px-6 py-4 text-xl font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 neo-brutalist-shadow-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !query.trim()}
              className="py-4 px-8 text-xl h-auto"
            >
              {loading ? "Mencari..." : "Cari Lirik"}
            </Button>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-destructive/10 border-4 border-destructive rounded-xl text-destructive font-bold flex items-center"
            >
              <div className="w-2 h-2 rounded-full bg-destructive mr-3 animate-ping"></div>
              {error}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Metadata Card */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-surface border-4 border-border rounded-3xl overflow-hidden neo-brutalist-shadow">
                {result.albumCover && (
                  <div className="relative w-full aspect-square border-b-4 border-border">
                    <img 
                      src={result.albumCover} 
                      alt={result.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-black mb-1 leading-tight">{result.title}</h2>
                  <p className="text-primary font-bold text-lg mb-4">{result.artist}</p>
                  
                  <div className="space-y-3 text-sm font-medium">
                    {result.album && (
                      <div className="flex items-center gap-2">
                        <Disc className="w-4 h-4 text-muted" />
                        <span className="text-muted">Album:</span>
                        <span className="text-text">{result.album}</span>
                      </div>
                    )}
                    {result.releaseDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted" />
                        <span className="text-muted">Rilis:</span>
                        <span className="text-text">{result.releaseDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Streaming Links */}
              <div className="flex flex-col gap-3">
                {result.spotifyUrl && (
                  <a href={result.spotifyUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-4 bg-[#1DB954] hover:bg-[#1ed760] text-black font-black text-lg border-4 border-black rounded-2xl neo-brutalist-shadow transition-transform hover:-translate-y-1">
                    <div className="flex justify-center items-center gap-2">
                      <Music className="w-6 h-6" />
                      Buka di Spotify
                    </div>
                  </a>
                )}
                {result.youtubeUrl && (
                  <a href={result.youtubeUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-4 bg-[#FF0000] hover:bg-[#ff3333] text-white font-black text-lg border-4 border-black rounded-2xl neo-brutalist-shadow transition-transform hover:-translate-y-1">
                    <div className="flex justify-center items-center gap-2">
                      <PlaySquare className="w-6 h-6" />
                      Tonton di YouTube
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Lyrics Card */}
            <div className="md:col-span-2">
              <div className="bg-surface border-4 border-border rounded-3xl p-8 neo-brutalist-shadow h-full">
                <h3 className="text-2xl font-black border-b-4 border-border pb-4 mb-6">Lirik Lagu</h3>
                <div className="whitespace-pre-wrap font-medium text-lg leading-relaxed text-text">
                  {result.lyrics}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
