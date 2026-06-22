"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, PlaySquare, MessageSquare, Copy, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function YoutubeTranscriptPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setTranscript(null);
    setCopied(false);

    try {
      const response = await fetch(`/api/tools/youtube-transcript?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan saat mengekstrak transkrip.");
      }

      if (data.status === true && data.result?.transcript) {
        setTranscript(data.result.transcript);
      } else {
        throw new Error("Transkrip tidak ditemukan untuk video ini.");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!transcript) return;
    try {
      await navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin teks:", err);
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
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <MessageSquare className="w-40 h-40" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#FF0000] p-4 rounded-2xl neo-brutalist-shadow-sm border-4 border-border">
              <PlaySquare className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">Pengekstrak Transkrip</h1>
              <p className="text-muted text-lg mt-1 font-medium">Sedot teks percakapan dari video YouTube secara instan.</p>
            </div>
          </div>

          <form onSubmit={handleExtract} className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Tempel tautan (URL) YouTube di sini..."
                className="w-full bg-background border-4 border-border rounded-2xl px-6 py-4 text-xl font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 neo-brutalist-shadow-sm"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !url.trim()}
              className="py-4 px-8 text-xl h-auto flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-4 border-background border-t-transparent rounded-full animate-spin"></div>
                  Menyedot...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Ekstrak Teks
                </>
              )}
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
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-surface border-4 border-border rounded-3xl overflow-hidden neo-brutalist-shadow flex flex-col h-[600px]"
          >
            {/* Header Transkrip */}
            <div className="border-b-4 border-border p-6 flex flex-col sm:flex-row justify-between items-center bg-background/50 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <h3 className="text-xl font-black">Hasil Ekstraksi Transkrip</h3>
              </div>
              
              <Button 
                onClick={handleCopy} 
                variant={copied ? "default" : "outline"}
                className={`flex items-center gap-2 transition-all ${copied ? 'bg-green-500 hover:bg-green-600 text-white border-green-700' : ''}`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? "Berhasil Disalin!" : "Salin ke Clipboard"}
              </Button>
            </div>

            {/* Area Teks Transkrip (Scrollable) */}
            <div className="p-8 flex-grow overflow-y-auto custom-scrollbar">
              <div className="whitespace-pre-wrap font-medium text-lg leading-relaxed text-text">
                {transcript}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* Kustomisasi scrollbar khusus untuk area transkrip */
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--color-surface);
          border-left: 4px solid var(--color-border);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: var(--color-primary);
          border: 4px solid var(--color-border);
          border-right: none;
        }
      `}</style>
    </div>
  );
}
