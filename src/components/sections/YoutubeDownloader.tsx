"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlaySquare, Download, RefreshCw, AlertCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DownloadResult {
  title: string;
  thumbnail: string;
  urls: {
    url: string;
    ext: string;
    quality: string;
  }[];
}

export function YoutubeDownloader() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDownload = async () => {
    if (!url.trim()) return;
    
    setStatus("loading");
    setResult(null);
    
    try {
      const response = await fetch("/api/download/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan saat memproses link.");
      }
      
      setResult(data.result);
      setStatus("success");
    } catch (err: any) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  return (
    <section className="py-10 relative z-10">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="w-full max-w-4xl bg-surface border-4 border-border rounded-2xl p-6 md:p-10 neo-brutalist-shadow">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-[#FF0000] rounded-2xl border-4 border-border mb-6 flex items-center justify-center neo-brutalist-shadow-sm">
              <PlaySquare className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-4 text-center">Tarik Video dari YouTube</h3>
            <p className="text-muted text-center max-w-lg">Tempelkan link YouTube apa saja, dan unduh videonya ke perangkat Anda.</p>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <PlayCircle className="w-6 h-6 text-muted" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Contoh: https://www.youtube.com/watch?v=..."
                className="w-full pl-12 pr-4 py-4 text-lg bg-background border-4 border-border rounded-xl outline-none focus:border-primary neo-brutalist-shadow-sm"
                onKeyDown={(e) => e.key === "Enter" && handleDownload()}
              />
            </div>
            <Button 
              onClick={handleDownload} 
              className="py-4 text-lg bg-[#FF0000] hover:bg-[#CC0000] w-full sm:w-auto self-center px-12"
              disabled={status === "loading"}
            >
              {status === "loading" ? <RefreshCw className="w-6 h-6 animate-spin" /> : "Proses Link"}
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {status === "error" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 bg-error/10 border-2 border-error text-error rounded-xl flex items-center gap-3">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <p className="font-medium">{errorMsg}</p>
              </motion.div>
            )}

            {status === "success" && result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-8 border-t-4 border-border flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="w-full md:w-1/2 flex-shrink-0">
                  <div className="border-4 border-border rounded-2xl overflow-hidden neo-brutalist-shadow-sm bg-background">
                    {result.thumbnail ? (
                      <img src={result.thumbnail} alt="Thumbnail" className="w-full aspect-video object-cover" />
                    ) : (
                      <div className="w-full aspect-video bg-muted flex items-center justify-center">
                        <PlaySquare className="w-12 h-12 text-background opacity-50" />
                      </div>
                    )}
                  </div>
                  <h4 className="mt-4 font-bold text-lg line-clamp-2">{result.title}</h4>
                </div>
                
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                  {result.urls.map((item, idx) => (
                    <a 
                      key={idx} 
                      href={`/api/download/proxy?url=${encodeURIComponent(item.url)}`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full"
                      onClick={() => {
                        try {
                          const stored = localStorage.getItem("docksidz_history");
                          const history = stored ? JSON.parse(stored) : [];
                          history.push({
                            id: Date.now().toString(),
                            name: result.title || "Video YouTube",
                            type: "YouTube Downloader",
                            url: item.url,
                            timestamp: Date.now(),
                          });
                          localStorage.setItem("docksidz_history", JSON.stringify(history));
                          window.dispatchEvent(new Event("history-updated"));
                        } catch (e) {}
                      }}
                    >
                      <Button className="w-full py-6 flex items-center justify-center gap-3 text-lg bg-[#FF0000] hover:bg-[#CC0000]">
                        <Download className="w-6 h-6" />
                        Unduh {item.quality}
                      </Button>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
