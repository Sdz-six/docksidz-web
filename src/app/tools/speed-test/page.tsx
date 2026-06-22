"use client";

import Link from "next/link";
import { ArrowLeft, Wifi } from "lucide-react";

export default function SpeedTestPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <Link href="/#tools" className="inline-flex items-center text-muted hover:text-primary mb-8 font-bold neo-brutalist-shadow-sm bg-surface px-4 py-2 rounded-xl border-2 border-border transition-all hover:translate-y-[-2px]">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Dashboard
      </Link>

      <div className="mb-8 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
          <div className="bg-[#3B82F6] p-3 rounded-xl neo-brutalist-shadow-sm border-2 border-border">
            <Wifi className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black">Internet Speed Test</h1>
        </div>
        <p className="text-muted text-lg">Uji kecepatan unduh (download), unggah (upload), dan keterlambatan (ping) menggunakan mesin uji akurat tinggi.</p>
      </div>

      <div className="bg-surface border-4 border-border rounded-3xl p-2 md:p-6 neo-brutalist-shadow mb-10 overflow-hidden relative" style={{ minHeight: '600px' }}>
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center -z-10">
          <div className="flex flex-col items-center opacity-50">
            <Wifi className="w-16 h-16 mb-4 animate-pulse" />
            <p className="font-bold">Memuat Mesin Uji Kecepatan...</p>
          </div>
        </div>
        
        {/* OpenSpeedTest Iframe Widget - Menggantikan Opsi B yang gagal mencapai akurasi maksimal */}
        <iframe 
          src="https://openspeedtest.com/speedtest"
          width="100%" 
          height="100%" 
          className="border-0 w-full min-h-[600px] rounded-2xl z-10 relative"
          allow="autoplay; fullscreen"
          title="OpenSpeedTest Widget"
        ></iframe>
      </div>
    </div>
  );
}
