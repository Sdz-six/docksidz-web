"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Download, Scissors, Loader2, Image as ImageIcon, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { removeBackground } from "@imgly/background-removal";

export default function RemoveBg() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup URLs on unmount to prevent memory leaks
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setProgress(0);
    setStatusText("");
  };

  const processImage = async () => {
    if (!imageFile) return;
    
    setIsProcessing(true);
    setProgress(0);
    setStatusText("Mengunduh Mesin AI (Hanya sekali)...");

    try {
      const config = {
        model: "small", // Model "small" agar ringan untuk HP kentang
        progress: (key: string, current: number, total: number) => {
          if (key.includes("fetch")) {
             const percent = Math.round((current / total) * 100) || 0;
             setProgress(percent);
             setStatusText(`Mengunduh AI: ${percent}%`);
          } else if (key.includes("compute")) {
             setStatusText("Memotong gambar secara ajaib...");
             setProgress(100);
          }
        }
      };

      const imageBlob = await removeBackground(imageFile, config);
      const newUrl = URL.createObjectURL(imageBlob);
      setResultUrl(newUrl);
    } catch (error) {
      console.error("Gagal memproses gambar:", error);
      alert("Terjadi kesalahan. Pastikan koneksi internet stabil karena sistem perlu mengunduh AI saat pertama kali digunakan.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `DockSidz_RemoveBG_${Date.now()}.png`; // Selalu unduh sebagai PNG agar transparan
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </Link>

        <div className="bg-surface rounded-2xl p-6 md:p-10 border-2 border-border neo-brutalist-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-red-500/20 p-3 rounded-xl border-2 border-red-500/50 text-red-500">
              <Scissors className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Hapus Latar Belakang</h1>
              <p className="text-muted">Potong background otomatis dengan kualitas asli 100% (No Compression)</p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-primary/10 border-2 border-primary/20 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted">
              <strong>Info Penting:</strong> Fitur ini berjalan sepenuhnya di HP/PC Anda tanpa dikirim ke server. 
              Saat <strong>pertama kali digunakan</strong>, sistem akan memakan waktu untuk mendownload file AI. 
              Mohon bersabar jika loading terasa lama (terutama di HP kentang).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Kolom Kiri: Input */}
            <div className="space-y-6">
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer hover:border-primary hover:bg-primary/5 ${previewUrl ? 'border-primary bg-primary/5' : 'border-border'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/png, image/jpeg, image/webp" 
                  className="hidden" 
                />
                
                {previewUrl ? (
                  <div className="relative aspect-square w-full max-w-[250px] mx-auto rounded-lg overflow-hidden border-2 border-border shadow-lg">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center space-y-4">
                    <div className="bg-background p-4 rounded-full border-2 border-border shadow-sm">
                      <Upload className="w-8 h-8 text-muted" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Pilih Foto</p>
                      <p className="text-sm text-muted">Mendukung JPG, PNG, WebP</p>
                    </div>
                  </div>
                )}
              </div>

              <Button 
                onClick={processImage} 
                disabled={!imageFile || isProcessing || !!resultUrl}
                className="w-full h-14 text-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : resultUrl ? (
                  <>
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Selesai Dipotong!
                  </>
                ) : (
                  <>
                    <Scissors className="w-5 h-5 mr-2" />
                    Potong Gambar Sekarang
                  </>
                )}
              </Button>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-primary">{statusText}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-3 w-full bg-surface border-2 border-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Kolom Kanan: Output */}
            <div className="space-y-6">
              <div className="border-2 border-border rounded-xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center bg-[url('https://transparenttextures.com/patterns/cubes.png')] bg-surface/50 relative overflow-hidden">
                {resultUrl ? (
                  <div className="relative w-full max-w-[300px] mx-auto z-10">
                    <img src={resultUrl} alt="Result" className="w-full h-auto drop-shadow-2xl" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted opacity-50 space-y-4 relative z-10">
                    <ImageIcon className="w-16 h-16" />
                    <p className="font-medium">Hasil Potongan akan muncul di sini</p>
                  </div>
                )}
                {/* Background Checkerboard untuk area transparan */}
                <div className="absolute inset-0 z-0 opacity-10" style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #ffffff 25%, #ffffff 75%, #000 75%, #000)',
                  backgroundPosition: '0 0, 10px 10px',
                  backgroundSize: '20px 20px',
                }}></div>
              </div>

              {resultUrl && (
                <Button 
                  onClick={handleDownload} 
                  variant="outline" 
                  className="w-full h-14 text-lg border-2 border-primary text-primary hover:bg-primary/10"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Unduh Resolusi Asli (PNG)
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
