"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Image as ImageIcon, Upload, Download, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDropzone } from "react-dropzone";

type TargetFormat = "image/jpeg" | "image/png" | "image/webp";

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<TargetFormat>("image/webp");
  const [isConverting, setIsConverting] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedExt, setConvertedExt] = useState<string>("webp");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"]
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const selected = acceptedFiles[0];
        setFile(selected);
        setPreviewUrl(URL.createObjectURL(selected));
        setConvertedUrl(null);
      }
    }
  });

  const handleConvert = async () => {
    if (!file || !previewUrl || !canvasRef.current) return;
    
    setIsConverting(true);
    setConvertedUrl(null);

    // Simulasi delay kecil untuk UX yang lebih baik
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const img = new window.Image();
      img.src = previewUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) throw new Error("Canvas tidak didukung");

      canvas.width = img.width;
      canvas.height = img.height;

      // Jika konversi ke JPG dan gambar asal transparan (PNG), beri background putih
      if (targetFormat === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      // Konversi ke format yang dipilih
      const dataUrl = canvas.toDataURL(targetFormat, 0.9);
      setConvertedUrl(dataUrl);

      // Ekstrak nama ekstensi untuk didownload
      const ext = targetFormat === "image/jpeg" ? "jpg" : targetFormat === "image/png" ? "png" : "webp";
      setConvertedExt(ext);

      // Simpan ke riwayat
      try {
        const historyData = localStorage.getItem("docksidz_history");
        const history = historyData ? JSON.parse(historyData) : [];
        history.push({
          id: Date.now().toString(),
          name: file.name,
          type: `Konversi ke ${ext.toUpperCase()}`,
          url: "", // Tautan lokal canvas tidak persisten
          timestamp: Date.now()
        });
        localStorage.setItem("docksidz_history", JSON.stringify(history));
        window.dispatchEvent(new Event("history-updated"));
      } catch (e) {}
    } catch (err) {
      console.error("Gagal mengonversi gambar", err);
      alert("Gagal mengonversi gambar.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setConvertedUrl(null);
  };

  // Bersihkan memory saat komponen di-unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/#tools" className="inline-flex items-center text-muted hover:text-primary mb-8 font-bold neo-brutalist-shadow-sm bg-surface px-4 py-2 rounded-xl border-2 border-border transition-all hover:translate-y-[-2px]">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Dashboard
      </Link>

      <div className="bg-surface border-4 border-border rounded-3xl p-6 md:p-10 neo-brutalist-shadow mb-10 relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ImageIcon className="w-40 h-40" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#22C55E] p-4 rounded-2xl neo-brutalist-shadow-sm border-4 border-border">
              <RefreshCw className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">Pengubah Format Gambar</h1>
              <p className="text-muted text-lg mt-1 font-medium">Ubah gambar ke JPG, PNG, atau WebP super kilat tanpa upload.</p>
            </div>
          </div>

          {!file ? (
            <div className="mt-8">
              <div 
                {...getRootProps()} 
                className={`w-full border-4 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 outline-none
                  ${isDragActive ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-border bg-background hover:bg-surface'}`}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 bg-background border-4 border-border rounded-full flex items-center justify-center mb-6 neo-brutalist-shadow-sm">
                  <Upload className="w-10 h-10 text-muted" />
                </div>
                <h3 className="text-2xl font-black mb-2 text-center">Tarik & Lepas Gambar Di Sini</h3>
                <p className="text-muted text-center font-medium">Atau klik untuk memilih file dari komputer Anda</p>
                <p className="text-sm text-muted/70 mt-4">(Mendukung JPG, PNG, WebP)</p>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-background border-4 border-border rounded-2xl p-6 neo-brutalist-shadow-sm flex flex-col md:flex-row gap-8 items-center"
            >
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <h3 className="text-lg font-bold mb-4">Gambar Asli</h3>
                <div className="w-full aspect-square bg-surface border-4 border-border rounded-xl overflow-hidden relative">
                  <img src={previewUrl!} alt="Preview" className="w-full h-full object-contain" />
                </div>
                <p className="mt-3 text-sm font-bold truncate w-full text-center">{file.name}</p>
                <p className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>

              <div className="w-full md:w-2/3 flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-bold mb-3">Pilih Format Target:</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "image/jpeg", label: "JPG" },
                      { id: "image/png", label: "PNG" },
                      { id: "image/webp", label: "WebP" }
                    ].map((format) => (
                      <button
                        key={format.id}
                        onClick={() => setTargetFormat(format.id as TargetFormat)}
                        className={`py-3 px-4 rounded-xl border-4 font-black transition-all ${
                          targetFormat === format.id 
                            ? 'bg-primary text-white border-primary neo-brutalist-shadow-sm translate-y-[-2px]' 
                            : 'bg-surface text-muted border-border hover:border-primary/50'
                        }`}
                      >
                        {format.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-auto">
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 py-6 text-lg"
                  >
                    Batal
                  </Button>
                  <Button 
                    onClick={handleConvert}
                    disabled={isConverting}
                    className="flex-[2] py-6 text-lg"
                  >
                    {isConverting ? "Mengonversi..." : "Mulai Konversi"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Kanvas tersembunyi untuk pemrosesan */}
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
      </div>

      <AnimatePresence>
        {convertedUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#22C55E] border-4 border-black rounded-3xl p-8 neo-brutalist-shadow flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4 text-white">
              <div className="bg-white/20 p-3 rounded-xl border-2 border-white/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black">Konversi Selesai!</h3>
                <p className="font-medium text-white/90">Gambar Anda berhasil diubah ke format {convertedExt.toUpperCase()}.</p>
              </div>
            </div>
            
            <a 
              href={convertedUrl} 
              download={`Converted_Image.${convertedExt}`}
              className="bg-white text-black hover:bg-gray-100 font-black text-xl py-4 px-8 rounded-2xl border-4 border-black neo-brutalist-shadow-sm transition-transform hover:-translate-y-1 flex items-center gap-3 w-full md:w-auto justify-center"
            >
              <Download className="w-6 h-6" />
              Unduh Hasil
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
