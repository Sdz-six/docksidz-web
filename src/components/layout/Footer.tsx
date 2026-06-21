import Link from "next/link";
import { FileCode2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-surface py-12 mt-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-2">
          <FileCode2 className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">DockSidz</span>
        </div>
        
        <div className="flex space-x-6 text-sm text-muted">
          <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
          <Link href="#" className="hover:text-white transition-colors">Ketentuan</Link>
          <Link href="#" className="hover:text-white transition-colors">Kontak</Link>
        </div>

        <div className="text-sm text-muted">
          &copy; 2026 DockSidz. Hak Cipta Dilindungi.
        </div>
      </div>
    </footer>
  );
}
