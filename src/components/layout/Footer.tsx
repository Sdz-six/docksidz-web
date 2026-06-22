import Link from "next/link";
import { FileCode2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-surface py-12 mt-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3 mb-6 md:mb-0">
          <div className="bg-surface p-2 rounded-xl border-2 border-border neo-brutalist-shadow-sm">
            <FileCode2 className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tighter">DockSidz and Tools</span>
        </div>
        
        <div className="flex space-x-6 text-sm text-muted">
          <a href="https://www.instagram.com/sidz.six?igsh=NHNkY21obGVveTFh" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
            Kontak / Instagram
          </a>
        </div>

        <p className="text-muted text-sm font-medium flex items-center justify-center md:justify-start gap-1">
          &copy; {new Date().getFullYear()} DockSidz and Tools. Dibuat oleh SidzJago <span className="text-xl">😿</span>
        </p>
      </div>
    </footer>
  );
}
