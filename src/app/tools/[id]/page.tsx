import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Converter } from "@/components/sections/Converter";
import { SosmedDownloader } from "@/components/sections/SosmedDownloader";
import { AiImageGenerator } from "@/components/sections/AiImageGenerator";
import { UrlShortener } from "@/components/sections/UrlShortener";
import { QrCodeGenerator } from "@/components/sections/QrCodeGenerator";
import { YoutubeDownloader } from "@/components/sections/YoutubeDownloader";
import { IpTracker } from "@/components/sections/IpTracker";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Validasi ID alat
  const validTools = [
    "word-to-pdf", "pdf-to-word", "image-to-pdf", "office-to-pdf", "merge-pdf", 
    "tiktok-downloader", "youtube-downloader", "ai-image-generator", 
    "url-shortener", "qr-code-generator", "ip-tracker"
  ];
  
  if (!validTools.includes(id)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Alat tidak ditemukan</h1>
        <Link href="/">
          <button className="bg-primary text-white font-bold py-3 px-6 border-4 border-border rounded-xl neo-brutalist-shadow hover:neo-brutalist-shadow-hover transition-all">
            Kembali ke Beranda
          </button>
        </Link>
      </div>
    );
  }

  // Tentukan judul berdasarkan id
  const titleMap: Record<string, string> = {
    "word-to-pdf": "Word ke PDF",
    "pdf-to-word": "PDF ke Word",
    "image-to-pdf": "Gambar ke PDF",
    "office-to-pdf": "PPT/Excel ke PDF",
    "merge-pdf": "Gabung PDF",
    "tiktok-downloader": "TikTok Downloader",
    "youtube-downloader": "YouTube Downloader",
    "ai-image-generator": "AI Image Generator",
    "url-shortener": "URL Shortener",
    "qr-code-generator": "QR Code Generator",
    "ip-tracker": "IP Tracker"
  };

  const isDocumentTool = ["word-to-pdf", "pdf-to-word", "image-to-pdf", "office-to-pdf", "merge-pdf"].includes(id);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 mb-4">
          <Link href="/#tools">
            <button className="flex items-center gap-2 font-bold text-lg bg-surface border-4 border-border rounded-xl py-2 px-4 neo-brutalist-shadow-sm hover:translate-y-1 hover:shadow-none transition-all">
              <ArrowLeft className="w-5 h-5" />
              Kembali ke Dashboard
            </button>
          </Link>
        </div>
        
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black mb-2">{titleMap[id]}</h1>
          <p className="text-muted text-lg">
            Selesaikan tugas Anda dengan cepat dan aman di perangkat Anda.
          </p>
        </div>

        {isDocumentTool && <Converter fixedTab={id as any} />}
        {id === "tiktok-downloader" && <SosmedDownloader />}
        {id === "youtube-downloader" && <YoutubeDownloader />}
        {id === "ai-image-generator" && <AiImageGenerator />}
        {id === "url-shortener" && <UrlShortener />}
        {id === "qr-code-generator" && <QrCodeGenerator />}
        {id === "ip-tracker" && <IpTracker />}
      </main>
      <Footer />
    </div>
  );
}
