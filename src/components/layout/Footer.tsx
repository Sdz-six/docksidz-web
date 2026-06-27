"use client";

import Link from "next/link";
import { FileCode2 } from "lucide-react";

export function Footer() {
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
          <Link href="/playground" className="hover:text-white transition-colors flex items-center gap-2 font-bold text-text hover:text-text/80 text-left bg-primary/10 px-4 py-2 rounded-xl w-fit mb-2">
            🎮 Ruang Santai (Playground)
          </Link>
          <a href="https://www.instagram.com/sidz.six?igsh=NHNkY21obGVveTFh" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2 font-bold text-primary hover:text-primary/80 text-left">
            Ada error? Hubungi saya
          </a>
          <div className="text-muted text-sm font-medium flex flex-col items-start gap-1 text-left">
            <span>&copy; {new Date().getFullYear()} DockSidz.</span>
            <span>Dibuat oleh SidzJago <span className="text-xl">😹</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
