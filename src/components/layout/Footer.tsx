import Link from "next/link";
import { FileCode2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-surface py-12 mt-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 items-center gap-6 relative z-10">
        
        {/* Kiri: Logo */}
        <div className="flex items-center justify-center md:justify-start gap-3">
          <div className="bg-surface p-2 rounded-xl border-2 border-border neo-brutalist-shadow-sm">
            <FileCode2 className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tighter">DockSidz and Tools</span>
        </div>
        
        {/* Tengah: Link Kontak */}
        <div className="flex justify-center text-sm text-muted">
          <a href="https://www.instagram.com/sidz.six?igsh=NHNkY21obGVveTFh" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2 font-bold text-primary hover:text-primary/80">
            Ada error atau bug hubungi saya
          </a>
        </div>

        {/* Kanan: Copyright (Diberi margin/padding besar agar tak tertutup maskot) */}
        <div className="flex justify-center md:justify-end md:pr-48">
          <p className="text-muted text-sm font-medium flex items-center gap-1 text-center md:text-right">
            &copy; {new Date().getFullYear()} DockSidz and Tools. Dibuat oleh SidzJago <span className="text-xl">😹</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
