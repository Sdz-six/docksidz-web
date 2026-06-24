"use client";

import Link from "next/link";
import { FileCode2, Skull } from "lucide-react";

export function Footer() {
  const triggerChaos = () => {
    // Meminta konfirmasi (meskipun orang pasti akan klik OK)
    const yakin = window.confirm("PERINGATAN: Menekan tombol ini dapat menyebabkan kerusakan visual pada struktur web. Lanjutkan?");
    if (yakin) {
      window.dispatchEvent(new CustomEvent("trigger-chaos"));
    }
  };

  return (
    <footer className="border-t-2 border-border bg-surface pt-12 pb-40 md:pb-12 mt-20 relative overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-start justify-start gap-6 md:gap-12 relative z-10 w-full sm:w-3/4 max-w-[65%] md:max-w-full">
        
        {/* Bagian Kiri: Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-surface p-2 rounded-xl border-2 border-border neo-brutalist-shadow-sm">
            <FileCode2 className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tighter shrink-0">DockSidz</span>
        </div>
        
        {/* Bagian Tengah: Teks & Link dikelompokkan ke kiri agar aman dari Maskot di kanan */}
        <div className="flex flex-col items-start gap-3 border-t-2 md:border-t-0 md:border-l-2 border-border/50 pt-4 md:pt-0 md:pl-8">
          <a href="https://www.instagram.com/sidz.six?igsh=NHNkY21obGVveTFh" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2 font-bold text-primary hover:text-primary/80 text-left">
            Ada error? Hubungi saya
          </a>
          <div className="text-muted text-sm font-medium flex flex-col items-start gap-1 text-left">
            <span>&copy; {new Date().getFullYear()} DockSidz.</span>
            <span>Dibuat oleh SidzJago <span className="text-xl">😹</span></span>
          </div>
        </div>
      </div>

      {/* Tombol Terlarang (Chaos Mode) */}
      <button 
        onClick={() => window.dispatchEvent(new CustomEvent("trigger-chaos-modal"))}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-1/2 md:top-12 z-20 flex items-center justify-center w-16 h-16 bg-red-600 border-4 border-black rounded-full shadow-[0_8px_0_#000] hover:translate-y-2 hover:shadow-[0_4px_0_#000] active:translate-y-4 active:shadow-none transition-all group"
      >
        <div className="absolute inset-2 border-2 border-black/30 rounded-full flex items-center justify-center">
          <Skull className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
        </div>
        <span className="absolute -top-12 bg-black text-white text-xs font-black px-3 py-1.5 border-2 border-white/20 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          ⚠️ JANGAN DITEKAN!
        </span>
      </button>
    </footer>
  );
}
