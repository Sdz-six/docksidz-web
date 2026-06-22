"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Scissors, Copy, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function UrlShortener() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [shortUrl, setShortUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    if (!url.trim()) return;
    
    setStatus("loading");
    setCopied(false);
    
    try {
      const response = await fetch("/api/tools/shortener", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Gagal memendekkan tautan.");
      
      setShortUrl(data.shorturl);
      setStatus("success");

      // Simpan ke riwayat
      try {
        const stored = localStorage.getItem("docksidz_history");
        const history = stored ? JSON.parse(stored) : [];
        history.push({
          id: Date.now().toString(),
          name: `URL: ${data.shorturl}`,
          type: "URL Shortener",
          url: data.shorturl,
          timestamp: Date.now(),
        });
        localStorage.setItem("docksidz_history", JSON.stringify(history));
        window.dispatchEvent(new Event("history-updated"));
      } catch (e) {}

    } catch (err: any) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-10 relative z-10">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="w-full max-w-4xl bg-surface border-4 border-border rounded-2xl p-6 md:p-10 neo-brutalist-shadow">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-[#3B82F6] rounded-2xl border-4 border-border mb-6 flex items-center justify-center neo-brutalist-shadow-sm">
              <Scissors className="w-10 h-10 text-white" />
            </div>
            <p className="text-muted text-center max-w-lg">Ubah tautan super panjang yang berantakan menjadi tautan pendek yang elegan.</p>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Link2 className="w-6 h-6 text-muted" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Tempel tautan panjang Anda di sini..."
                className="w-full pl-12 pr-4 py-4 text-lg bg-background border-4 border-border rounded-xl outline-none focus:border-primary neo-brutalist-shadow-sm"
                onKeyDown={(e) => e.key === "Enter" && handleShorten()}
              />
            </div>
            <Button 
              onClick={handleShorten} 
              className="py-4 text-lg bg-[#3B82F6] hover:bg-[#2563EB] w-full sm:w-auto self-center px-12"
              disabled={status === "loading"}
            >
              {status === "loading" ? <RefreshCw className="w-6 h-6 animate-spin" /> : "Perpendek Tautan"}
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {status === "error" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 bg-error/10 border-2 border-error text-error rounded-xl flex items-center gap-3">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <p className="font-medium">{errorMsg}</p>
              </motion.div>
            )}

            {status === "success" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-8 border-t-4 border-border flex flex-col items-center text-center">
                <h3 className="text-2xl font-bold mb-6">Tautan Anda Sudah Siap!</h3>
                <div className="w-full max-w-lg flex items-center bg-white border-4 border-border rounded-xl p-2 neo-brutalist-shadow-sm">
                  <div className="flex-grow text-xl font-bold text-primary px-4 truncate select-all">
                    {shortUrl}
                  </div>
                  <Button onClick={handleCopy} className="flex-shrink-0 px-6 py-4 flex items-center gap-2">
                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copied ? "Tersalin" : "Salin"}
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
