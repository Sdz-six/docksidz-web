"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Download, Link2, Type } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function QrCodeGenerator() {
  const [input, setInput] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  const handleGenerate = () => {
    if (!input.trim()) return;
    
    // Gunakan qrserver API
    const encodedData = encodeURIComponent(input.trim());
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodedData}&margin=20`;
    setQrUrl(url);

    // Simpan ke riwayat
    try {
      const stored = localStorage.getItem("docksidz_history");
      const history = stored ? JSON.parse(stored) : [];
      history.push({
        id: Date.now().toString(),
        name: `QR Code: ${input.length > 20 ? input.substring(0, 20) + "..." : input}`,
        type: "QR Code Generator",
        url: url,
        timestamp: Date.now(),
      });
      localStorage.setItem("docksidz_history", JSON.stringify(history));
      window.dispatchEvent(new Event("history-updated"));
    } catch (e) {}
  };

  return (
    <section className="py-10 relative z-10">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="w-full max-w-4xl bg-surface border-4 border-border rounded-2xl p-6 md:p-10 neo-brutalist-shadow">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-[#10B981] rounded-2xl border-4 border-border mb-6 flex items-center justify-center neo-brutalist-shadow-sm">
              <QrCode className="w-10 h-10 text-white" />
            </div>
            <p className="text-muted text-center max-w-lg">Ubah teks, nomor kontak, atau tautan apa pun menjadi QR Code secara instan!</p>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Type className="w-6 h-6 text-muted" />
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Masukkan teks atau URL (Contoh: https://google.com)"
                className="w-full pl-12 pr-4 py-4 text-lg bg-background border-4 border-border rounded-xl outline-none focus:border-primary neo-brutalist-shadow-sm"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>
            <Button 
              onClick={handleGenerate} 
              className="py-4 text-lg bg-[#10B981] hover:bg-[#0da06f] w-full sm:w-auto self-center px-12"
            >
              Buat QR Code
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {qrUrl && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center pt-8 border-t-4 border-border">
                <div className="bg-white p-4 border-4 border-border rounded-2xl neo-brutalist-shadow mb-6">
                  <img src={qrUrl} alt="QR Code" className="w-48 h-48 md:w-64 md:h-64" />
                </div>
                <div className="flex gap-4">
                  <a href={`/api/download/proxy?url=${encodeURIComponent(qrUrl)}`} target="_blank" rel="noopener noreferrer">
                    <Button className="px-8 flex items-center gap-2 text-lg">
                      <Download className="w-5 h-5" />
                      Unduh QR Code (PNG)
                    </Button>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
