"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2, Play, Square, Settings, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function TextToSpeechPage() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      // Coba pilih suara bahasa Indonesia secara default jika ada
      const idVoice = availableVoices.find(v => v.lang.includes("id") || v.lang.includes("ID"));
      if (idVoice) {
        setSelectedVoice(idVoice.name);
      } else if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleSpeak = () => {
    if (!text.trim()) return;
    
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    window.speechSynthesis.cancel(); // Stop anything playing currently
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const handleDownloadAudio = async () => {
    if (!text.trim()) return;
    
    setIsDownloading(true);
    
    try {
      // Potong teks jika terlalu panjang (Google TTS limit ~200 chars untuk direct URL)
      const safeText = text.substring(0, 200);
      
      // Deteksi bahasa dari suara yang dipilih
      let lang = "id";
      if (selectedVoice) {
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) {
          lang = voice.lang.split('-')[0]; // misal "id-ID" -> "id", "en-US" -> "en"
        }
      }

      const fileName = `TTS_${lang}_${new Date().getTime()}.mp3`;

      // Generate Google TTS Audio URL melalui Proxy Backend kita agar tidak diblokir CORS browser
      const audioUrl = `/api/tts?text=${encodeURIComponent(safeText)}&lang=${lang}`;
      
      // Fetch data blob untuk mendownloadnya dari server lokal kita
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error("Gagal mengambil audio dari server");
      const blob = await response.blob();
      
      // Buat virtual link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Gagal mengunduh audio:", err);
      alert("Gagal mengunduh audio. Silakan periksa koneksi internet Anda.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/#tools" className="inline-flex items-center text-muted hover:text-primary mb-8 font-bold neo-brutalist-shadow-sm bg-surface px-4 py-2 rounded-xl border-2 border-border transition-all hover:translate-y-[-2px]">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Dashboard
      </Link>

      <div className="bg-surface border-4 border-border rounded-3xl p-6 md:p-10 neo-brutalist-shadow mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Volume2 className="w-40 h-40" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-[#8B5CF6] p-4 rounded-2xl neo-brutalist-shadow-sm border-4 border-border">
              <Volume2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">AI Text to Speech</h1>
              <p className="text-muted text-lg mt-1 font-medium">Biar AI yang membacakan cerita atau artikel panjang Anda.</p>
            </div>
          </div>

          <div className="bg-background border-4 border-border rounded-2xl p-4 neo-brutalist-shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
            <Settings className="w-6 h-6 text-muted" />
            <div className="font-bold whitespace-nowrap">Pilih Suara:</div>
            <select 
              className="w-full bg-surface border-2 border-border rounded-xl px-4 py-3 font-medium outline-none focus:border-primary"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
              {voices.length === 0 && <option>Memuat suara mesin...</option>}
            </select>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ketik atau tempelkan teks apa pun di sini..."
            className="w-full h-64 bg-background border-4 border-border rounded-2xl p-6 text-xl font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 neo-brutalist-shadow-sm resize-none custom-scrollbar"
          ></textarea>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button 
              onClick={isSpeaking ? handlePause : handleSpeak}
              disabled={!text.trim()}
              className="flex-1 py-6 text-xl flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#1ea950] border-black text-black"
            >
              {isSpeaking ? (
                <>
                  <div className="flex gap-1 items-center justify-center">
                    <span className="w-1.5 h-6 bg-black animate-pulse rounded-full" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-8 bg-black animate-pulse rounded-full" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-4 bg-black animate-pulse rounded-full" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="ml-2">Jeda Membaca</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 fill-current" />
                  {isPaused ? "Lanjutkan Baca" : "Mulai Membaca"}
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleStop}
              disabled={!isSpeaking && !isPaused}
              variant="outline"
              className="py-6 px-8 text-xl flex items-center justify-center gap-2 hover:bg-destructive hover:text-white hover:border-destructive"
            >
              <Square className="w-6 h-6 fill-current" />
              Stop
            </Button>

            <Button 
              onClick={handleDownloadAudio}
              disabled={!text.trim() || isDownloading}
              className="py-6 px-8 text-xl flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#2563eb] text-white"
            >
              <Download className={`w-6 h-6 ${isDownloading ? "animate-bounce" : ""}`} />
              {isDownloading ? "Mengunduh..." : "Unduh MP3"}
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted font-medium text-center">
            *Catatan: Khusus untuk unduhan MP3, teks akan dibatasi maksimal 200 karakter pertama agar sistem stabil.
          </p>
        </div>
      </div>
    </div>
  );
}
