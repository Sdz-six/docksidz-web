import { StickyNotes } from "@/components/ui/StickyNotes";

export default function GuestbookPage() {
  return (
    <div className="container mx-auto px-4 py-8">
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
