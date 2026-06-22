"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Download, RefreshCw, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AiImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [imageUrl, setImageUrl] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setStatus("loading");
    
    // Gunakan Pollinations API (Gratis, tanpa key)
    const encodedPrompt = encodeURIComponent(prompt.trim());
    const randomSeed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${randomSeed}`;
    
    // Preload gambar agar tidak terlihat patah-patah saat dimuat
    const img = new Image();
    img.onload = () => {
      setImageUrl(url);
      setStatus("success");
      
      // Simpan ke riwayat
      try {
        const stored = localStorage.getItem("docksidz_history");
        const history = stored ? JSON.parse(stored) : [];
        history.push({
          id: Date.now().toString(),
          name: prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt,
          type: "AI Image Generator",
          url: url,
          timestamp: Date.now(),
        });
        localStorage.setItem("docksidz_history", JSON.stringify(history));
        window.dispatchEvent(new Event("history-updated"));
      } catch (e) {}
    };
    img.src = url;
  };

  return (
    <section className="py-10 relative z-10">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="w-full max-w-4xl bg-surface border-4 border-border rounded-2xl p-6 md:p-10 neo-brutalist-shadow">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-[#8B5CF6] rounded-2xl border-4 border-border mb-6 flex items-center justify-center neo-brutalist-shadow-sm">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <p className="text-muted text-center max-w-lg">Ketik apa pun yang ada di imajinasi Anda, dan biarkan AI melukisnya dalam hitungan detik!</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: Seekor kucing memakai kacamata hitam di kota cyberpunk..."
              className="flex-grow py-4 px-6 text-lg bg-background border-4 border-border rounded-xl outline-none focus:border-primary neo-brutalist-shadow-sm"
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
            <Button 
              onClick={handleGenerate} 
              className="py-4 px-8 text-lg bg-[#8B5CF6] hover:bg-[#7344e6]"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Melukis..." : "Buat Gambar"}
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {status === "loading" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-12">
                <RefreshCw className="w-16 h-16 text-[#8B5CF6] animate-spin mb-4" />
                <h3 className="text-xl font-bold">AI sedang berimajinasi...</h3>
                <p className="text-muted text-sm">Ini biasanya memakan waktu sekitar 5-10 detik.</p>
              </motion.div>
            )}

            {status === "success" && imageUrl && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                <div className="w-full max-w-2xl border-4 border-border rounded-2xl overflow-hidden neo-brutalist-shadow mb-6 bg-background">
                  <img src={imageUrl} alt={prompt} className="w-full h-auto object-cover" />
                </div>
                <div className="flex gap-4">
                  <a href={`/api/download/proxy?url=${encodeURIComponent(imageUrl)}`} target="_blank" rel="noopener noreferrer">
                    <Button className="px-8 flex items-center gap-2 text-lg">
                      <Download className="w-5 h-5" />
                      Unduh Gambar (HD)
                    </Button>
                  </a>
                  <Button variant="outline" onClick={() => setStatus("idle")}>Buat Baru</Button>
                </div>
              </motion.div>
            )}

            {status === "idle" && (
              <div className="py-12 flex flex-col items-center text-muted opacity-50">
                <ImageIcon className="w-24 h-24 mb-4" />
                <p className="font-bold">Kanvas masih kosong</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
