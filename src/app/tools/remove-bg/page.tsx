"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Download, Scissors, Loader2, Image as ImageIcon, ArrowLeft, Info, Key } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function RemoveBg() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem("remove_bg_api_key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup URLs on unmount to prevent memory leaks
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    localStorage.setItem("remove_bg_api_key", e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl(null);
  };

  const processImage = async () => {
    if (!imageFile) return;
    
    if (!apiKey.trim()) {
      alert("Silakan masukkan API Key Remove.bg terlebih dahulu!");
      return;
    }
    
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("image_file", imageFile);
      formData.append("size", "auto"); // Resolusi tinggi maksimal dari API

      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": apiKey.trim()
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.errors?.[0]?.title || "Gagal menghubungi server API. Pastikan API Key benar dan koneksi stabil.");
      }

      const imageBlob = await response.blob();
      const newUrl = URL.createObjectURL(imageBlob);
      setResultUrl(newUrl);
    } catch (error: any) {
      console.error("Gagal memproses gambar:", error);
      alert(`Terjadi kesalahan: ${error.message}`);
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
        <Link href="/#tools" className="inline-flex items-center text-muted hover:text-primary mb-8 font-bold neo-brutalist-shadow-sm bg-surface px-4 py-2 rounded-xl border-2 border-border transition-all hover:translate-y-[-2px]">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Dashboard
        </Link>

        <div className="bg-surface rounded-2xl p-6 md:p-10 border-2 md:border-4 border-border neo-brutalist-shadow relative overflow-hidden">
          {/* Dekorasi Background */}
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Scissors className="w-40 h-40" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#8B5CF6] p-4 rounded-2xl border-4 border-border neo-brutalist-shadow-sm text-white">
                <SparklesIcon className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text">Hapus Latar Belakang</h1>
                <p className="text-muted text-lg mt-1 font-medium">Potong background foto instan dan sempurna menggunakan Remove.bg API</p>
              </div>
            </div>

            <div className="mb-8 p-6 bg-surface border-4 border-border rounded-2xl neo-brutalist-shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <Key className="w-6 h-6 text-[#8B5CF6] shrink-0 mt-1" />
                <div className="flex-grow">
                  <label className="block font-bold text-lg mb-2">API Key Remove.bg</label>
                  <input 
                    type="text" 
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    placeholder="Masukkan API Key Anda di sini..." 
                    className="w-full bg-background border-4 border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors font-medium"
                  />
                  <p className="text-sm text-muted mt-2 font-medium">
                    Dapatkan API Key gratis (50 foto/bulan) di <a href="https://www.remove.bg/api" target="_blank" rel="noreferrer" className="text-primary hover:underline font-bold">www.remove.bg/api</a>. Key Anda hanya disimpan di *browser* ini dan tidak dikirim ke *server* kami.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Kolom Kiri: Input */}
              <div className="space-y-6">
                <div 
                  className={`border-4 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer outline-none hover:bg-surface
                    ${previewUrl ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-border bg-background'}`}
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
                    <div className="relative aspect-square w-full max-w-[250px] mx-auto rounded-xl overflow-hidden border-4 border-border neo-brutalist-shadow-sm">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center justify-center space-y-4">
                      <div className="w-20 h-20 bg-background p-4 rounded-full border-4 border-border shadow-sm flex items-center justify-center neo-brutalist-shadow-sm">
                        <Upload className="w-10 h-10 text-muted" />
                      </div>
                      <div>
                        <h3 className="font-black text-xl mb-1">Pilih Foto</h3>
                        <p className="text-sm text-muted font-medium">Mendukung JPG, PNG, WebP</p>
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={processImage} 
                  disabled={!imageFile || isProcessing || !!resultUrl}
                  className="w-full h-16 text-xl font-bold rounded-xl neo-brutalist-shadow"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                      Memotong di Server...
                    </>
                  ) : resultUrl ? (
                    <>
                      <ImageIcon className="w-6 h-6 mr-2" />
                      Selesai Dipotong!
                    </>
                  ) : (
                    <>
                      <Scissors className="w-6 h-6 mr-2" />
                      Hapus Background
                    </>
                  )}
                </Button>
              </div>

              {/* Kolom Kanan: Output */}
              <div className="space-y-6">
                <div className="border-4 border-border rounded-2xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden bg-background">
                  {/* Background Checkerboard untuk area transparan */}
                  <div className="absolute inset-0 z-0 opacity-20" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #ffffff 25%, #ffffff 75%, #000 75%, #000)',
                    backgroundPosition: '0 0, 10px 10px',
                    backgroundSize: '20px 20px',
                  }}></div>
                  
                  {resultUrl ? (
                    <div className="relative w-full max-w-[300px] mx-auto z-10 neo-brutalist-shadow-sm">
                      <img src={resultUrl} alt="Result" className="w-full h-auto drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] border-4 border-border rounded-xl" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted opacity-50 space-y-4 relative z-10">
                      <ImageIcon className="w-16 h-16" />
                      <p className="font-bold text-lg">Hasil akan muncul di sini</p>
                    </div>
                  )}
                </div>

                {resultUrl && (
                  <Button 
                    onClick={handleDownload} 
                    variant="outline" 
                    className="w-full h-16 text-xl font-bold border-4 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white rounded-xl neo-brutalist-shadow transition-all"
                  >
                    <Download className="w-6 h-6 mr-2" />
                    Unduh Gambar (PNG)
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
