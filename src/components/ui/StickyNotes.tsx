"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, PaintBucket, GripHorizontal, Pin } from "lucide-react";

type Note = {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
};

// Palet warna pastel retro
const COLORS = ["#FEF08A", "#BBF7D0", "#BFDBFE", "#FBCFE8", "#E9D5FF", "#FFFFFF"];

export function StickyNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [inputText, setInputText] = useState("");
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  // Load from Global Database API (or fallback to local storage if fail)
  useEffect(() => {
    setIsMounted(true);
    const fetchNotes = async () => {
      try {
        const res = await fetch('/api/notes', { cache: 'no-store' });
        const data = await res.json();
        
        if (!data.error) {
          setIsOnline(true);
          const parsedNotes = typeof data.notes === 'string' ? JSON.parse(data.notes) : data.notes;
          if (parsedNotes && Array.isArray(parsedNotes)) setNotes(parsedNotes);
        } else {
          setIsOnline(false);
          const saved = localStorage.getItem("docksidz_stickynotes");
          if (saved) setNotes(JSON.parse(saved));
        }
      } catch (e) {
        setIsOnline(false);
        const saved = localStorage.getItem("docksidz_stickynotes");
        if (saved) setNotes(JSON.parse(saved));
      }
    };
    fetchNotes();

    // Auto-refresh setiap 10 detik agar pengunjung lain bisa melihat updatenya
    const interval = setInterval(fetchNotes, 10000);
    return () => clearInterval(interval);
  }, []);

  // Sync to Global API (debounced) and Local Storage (instant)
  useEffect(() => {
    if (!isMounted || notes.length === 0) return;

    // Selalu simpan ke local storage sebagai backup
    localStorage.setItem("docksidz_stickynotes", JSON.stringify(notes));

    const saveToDB = async () => {
      setIsSaving(true);
      try {
        await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes }),
        });
      } catch (e) {
        console.error("Gagal sinkronisasi ke database", e);
      }
      setIsSaving(false);
    };

    // Debounce save 1 detik agar tidak spam request API saat digeser
    const timeout = setTimeout(saveToDB, 1000);
    return () => clearTimeout(timeout);
  }, [notes, isMounted]);

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Posisi awal acak agar tidak numpuk di satu tempat
    const randomX = Math.floor(Math.random() * (typeof window !== 'undefined' ? window.innerWidth / 2 : 400));
    const randomY = Math.floor(Math.random() * 300) + 100;
    const randomRotation = Math.floor(Math.random() * 14) - 7; // -7 deg to 7 deg

    const newNote: Note = {
      id: Date.now().toString(),
      text: inputText,
      color: activeColor,
      x: randomX,
      y: randomY,
      rotation: randomRotation
    };

    setNotes([...notes, newNote]);
    setInputText("");
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const updateNotePosition = (id: string, info: any) => {
    setNotes(notes.map(n => {
      if (n.id === id) {
        return { ...n, x: n.x + info.offset.x, y: n.y + info.offset.y };
      }
      return n;
    }));
  };

  if (!isMounted) return null;

  return (
    <div className="relative w-full min-h-[85vh] bg-surface rounded-3xl border-4 border-border overflow-hidden neo-brutalist-shadow flex flex-col items-center p-6">
      
      {/* Background retro pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }} />

      {/* Papan Kontrol */}
      <div className="relative z-20 w-full max-w-2xl bg-background border-4 border-border p-6 rounded-2xl neo-brutalist-shadow-sm flex flex-col gap-6 mt-4">
        
        {/* Status Sinkronisasi */}
        <div className="absolute -top-4 right-4 text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full border-2 border-border neo-brutalist-shadow-sm flex items-center gap-2 bg-surface text-text">
          <div className={`w-2.5 h-2.5 rounded-full ${isSaving ? 'bg-yellow-500 animate-pulse' : (isOnline ? 'bg-green-500' : 'bg-red-500 animate-pulse')}`} />
          {isSaving ? "Menyinkronkan..." : (isOnline ? "Online (Global)" : "Offline (Lokal)")}
        </div>

        <div className="flex items-center gap-3 border-b-4 border-border pb-4">
          <Pin className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-2xl font-black">PAPAN CORETAN TAMU</h2>
            <p className="text-muted font-bold text-sm">Tinggalkan pesan, geser layaknya kertas asli. Semua tersimpan otomatis.</p>
          </div>
        </div>
        
        <form onSubmit={addNote} className="flex flex-col gap-4">
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tulis pesan rahasia, pengingat, atau curhatan Anda di sini..."
            className="w-full h-32 p-4 border-4 border-border rounded-xl resize-none font-bold focus:outline-none focus:border-primary bg-surface text-text shadow-inner"
            maxLength={180}
          />
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 p-2 bg-surface border-4 border-border rounded-xl">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveColor(c)}
                  className={`w-8 h-8 rounded-full border-4 transition-transform ${activeColor === c ? 'border-primary scale-110' : 'border-border scale-90 hover:scale-100'}`}
                  style={{ backgroundColor: c }}
                  title="Pilih Warna Kertas"
                />
              ))}
            </div>
            <button 
              type="submit"
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-black border-4 border-border rounded-xl hover:-translate-y-1 active:translate-y-0 transition-transform neo-brutalist-shadow-sm"
            >
              <Plus className="w-5 h-5"/> TEMPELKAN
            </button>
          </div>
        </form>
      </div>

      {/* Render Sticky Notes */}
      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {notes.map(note => {
            // Pastikan tidak tembus layar HP (clamp X position)
            const safeX = typeof window !== 'undefined' ? Math.max(10, Math.min(note.x, window.innerWidth - 240)) : note.x;

            return (
            <motion.div
              key={note.id}
              drag
              dragMomentum={false}
              onDragEnd={(e, info) => updateNotePosition(note.id, info)}
              initial={{ opacity: 0, scale: 0.5, x: safeX, y: note.y - 50, rotate: note.rotation }}
              animate={{ opacity: 1, scale: 1, x: safeX, y: note.y, rotate: note.rotation }}
              exit={{ opacity: 0, scale: 0.5, rotate: note.rotation + 20 }}
              whileDrag={{ scale: 1.05, cursor: "grabbing", zIndex: 999 }}
              className="absolute w-56 h-56 p-4 border-4 border-black flex flex-col shadow-[8px_8px_0_rgba(0,0,0,0.8)] cursor-grab pointer-events-auto transition-shadow"
              style={{ 
                backgroundColor: note.color, 
                color: '#000000',
              }}
            >
              {/* Lakban Atas (Visual detail) */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/50 backdrop-blur-sm border-2 border-black/20 -rotate-2" />

              <div className="flex justify-between items-start mb-2 border-b-2 border-black/20 pb-2 relative z-10">
                <GripHorizontal className="w-5 h-5 text-black/40" />
                <button 
                  onClick={() => deleteNote(note.id)}
                  className="p-1 hover:bg-black/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-black" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pointer-events-none scrollbar-hide">
                <p className="font-bold text-lg leading-snug font-mono whitespace-pre-wrap break-words">
                  {note.text}
                </p>
              </div>
              <span className="text-[10px] text-black/40 font-black text-right uppercase mt-2">
                DockSidz
              </span>
            </motion.div>
          )})}
        </AnimatePresence>
      </div>

    </div>
  );
}
