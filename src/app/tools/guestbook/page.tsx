import { StickyNotes } from "@/components/ui/StickyNotes";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GuestbookPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/#tools" 
        className="inline-flex items-center gap-2 px-6 py-3 bg-surface text-text font-black border-4 border-border rounded-xl mb-8 hover:-translate-x-2 active:translate-x-0 transition-transform neo-brutalist-shadow-sm"
      >
        <ArrowLeft className="w-5 h-5" /> KEMBALI
      </Link>
      
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Papan Coretan Tamu</h1>
        <p className="text-xl text-muted font-bold max-w-2xl">
          Tinggalkan jejak Anda! Buat catatan, pilih warna, dan tempelkan di mana saja.
        </p>
      </div>

      <StickyNotes />
    </div>
  );
}
