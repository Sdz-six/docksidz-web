"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DownloadCloud, AlertCircle, RefreshCw, Link2, Film, Music, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "loading" | "success" | "error";

interface DownloadResult {
  title?: string;
  thumbnail?: string;
  media: {
    url: string;
    type: "video" | "audio" | "image";
    quality?: string;
  }[];
}

export function SosmedDownloader() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<DownloadResult | null>(null);

  const handleDownload = async () => {
    if (!url.trim()) {
      setErrorMsg("Mohon masukkan link video terlebih dahulu.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    setResult(null);

    try {
      const response = await fetch("/api/download/sosmed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan saat memproses link.");
      }

      // Format response based on Sanka Vollerei API structure
      // AIO usually returns data in data.result
      const apiResult = data.result;
      
      const formattedResult: DownloadResult = {
        title: apiResult.title || "Video Sosmed",
        thumbnail: apiResult.thumbnail,
        media: [],
      };

      // Handle media links
      if (apiResult.urls && Array.isArray(apiResult.urls)) {
        apiResult.urls.forEach((item: any) => {
          formattedResult.media.push({
            url: item.url,
            type: item.ext === "mp3" || item.ext === "m4a" ? "audio" : "video",
            quality: item.quality || item.ext,
          });
        });
      } else if (apiResult.url) {
        // Fallback if it's a single URL
        formattedResult.media.push({
          url: apiResult.url,
          type: "video",
        });
      }

      if (formattedResult.media.length === 0) {
        throw new Error("Tidak dapat menemukan link unduhan untuk media ini.");
      }

      setResult(formattedResult);
      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "Gagal memproses link tersebut.");
    }
  };

  const handleReset = () => {
    setUrl("");
    setStatus("idle");
    setErrorMsg("");
    setResult(null);
  };

  return (
    <section className="py-10 md:py-20 relative z-10 perspective-1000">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="w-full max-w-4xl bg-surface border-4 border-border rounded-2xl sm:rounded-[36px] p-4 sm:p-6 md:p-10 neo-brutalist-shadow transition-shadow duration-300">
          
          <AnimatePresence mode="wait">
            {status === "idle" || status === "error" ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-[#FF5A5F] rounded-2xl border-4 border-border mb-6 flex items-center justify-center neo-brutalist-shadow-sm">
                  <DownloadCloud className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black mb-4 text-center">Tempel Tautan Di Sini</h3>
                <p className="text-muted text-center mb-8 max-w-lg">Saat ini API Gratis kami HANYA mendukung unduhan video dari <b>TikTok</b> (Tanpa Watermark).</p>

                <div className="w-full max-w-2xl relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Link2 className="w-6 h-6 text-muted" />
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Contoh: https://vt.tiktok.com/xxxx/"
                    className="w-full pl-12 pr-4 py-4 sm:py-5 text-base sm:text-lg font-medium bg-background border-4 border-border rounded-xl outline-none focus:border-primary transition-colors neo-brutalist-shadow-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleDownload()}
                  />
                </div>

                <Button 
                  onClick={handleDownload}
                  className="px-10 py-4 text-lg bg-[#FF5A5F] hover:bg-[#e0484d]"
                >
                  Proses Link
                </Button>

                {status === "error" && (
                  <div className="mt-8 p-4 bg-error/10 border-2 border-error text-error rounded-xl flex items-center gap-3 w-full max-w-2xl">
                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                    <p className="font-medium">{errorMsg}</p>
                  </div>
                )}
              </motion.div>

            ) : status === "loading" ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center"
              >
                <RefreshCw className="w-16 h-16 text-[#FF5A5F] animate-spin mb-6" />
                <h3 className="text-2xl font-bold mb-2">Mengekstrak Video...</h3>
                <p className="text-muted mb-8">Mohon tunggu sebentar, sistem sedang membersihkan watermark dan menyiapkan file.</p>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-12 h-12 text-success" />
                </div>
                <h3 className="text-3xl font-bold mb-2 text-center">Berhasil Diekstrak!</h3>
                <p className="text-muted mb-8 text-center">{result?.title || "Video siap diunduh."}</p>
                
                <div className="w-full max-w-2xl flex flex-col gap-4">
                  {result?.media.map((item, idx) => (
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
                          const newItem = {
                            id: Date.now().toString(),
                            name: result?.title || "Video TikTok",
                            type: "TikTok Downloader",
                            url: item.url,
                            timestamp: Date.now(),
                          };
                          history.push(newItem);
                          localStorage.setItem("docksidz_history", JSON.stringify(history));
                          window.dispatchEvent(new Event("history-updated"));
                        } catch (e) {
                          console.error("Gagal menyimpan riwayat", e);
                        }
                      }}
                    >
                      <Button className={`w-full py-6 flex items-center justify-center gap-3 text-lg ${item.type === 'audio' ? 'bg-[#8B5CF6] hover:bg-[#7344e6]' : 'bg-[#FF5A5F] hover:bg-[#e0484d]'}`}>
                        {item.type === 'audio' ? <Music className="w-6 h-6" /> : <Film className="w-6 h-6" />}
                        Unduh {item.type === 'audio' ? 'Audio (MP3)' : 'Video (MP4)'} {item.quality && ` - ${item.quality}`}
                      </Button>
                    </a>
                  ))}

                  <Button variant="outline" onClick={handleReset} className="w-full py-4 mt-4">
                    Download Video Lain
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>
    </section>
  );
}
