"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Pin, UserCircle2, Clock } from "lucide-react";

type Note = {
  id: string;
  text: string;
  color: string;
  date?: string;
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

    // Debounce save 1 detik agar tidak spam request API
    const timeout = setTimeout(saveToDB, 1000);
    return () => clearTimeout(timeout);
  }, [notes, isMounted]);

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      text: inputText,
      color: activeColor,
      date: new Date().toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric' })
    };

    setNotes([...notes, newNote]);
    setInputText("");

    // Simpan ke riwayat
    try {
      const historyData = localStorage.getItem("docksidz_history");
      const history = historyData ? JSON.parse(historyData) : [];
      history.push({ 
        id: Date.now().toString(), 
        name: "Menulis Coretan Tamu", 
        type: "Guestbook", 
        url: "", 
        timestamp: Date.now() 
      });
      localStorage.setItem("docksidz_history", JSON.stringify(history));
      window.dispatchEvent(new Event("history-updated"));
    } catch (e) {}
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  if (!isMounted) return null;

  return (
    <div className="w-full flex flex-col gap-8">
      
      {/* Papan Kontrol */}
      <div className="relative w-full bg-background border-4 border-border p-6 rounded-2xl neo-brutalist-shadow-sm flex flex-col gap-6">
        
        {/* Status Sinkronisasi */}
        <div className="absolute -top-4 right-4 text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full border-2 border-border neo-brutalist-shadow-sm flex items-center gap-2 bg-surface text-text">
          <div className={`w-2.5 h-2.5 rounded-full ${isSaving ? 'bg-yellow-500 animate-pulse' : (isOnline ? 'bg-green-500' : 'bg-red-500 animate-pulse')}`} />
          {isSaving ? "Menyinkronkan..." : (isOnline ? "Online (Global)" : "Offline (Lokal)")}
        </div>

        <div className="flex items-center gap-3 border-b-4 border-border pb-4">
          <Pin className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-2xl font-black">PAPAN CORETAN TAMU</h2>
            <p className="text-muted font-bold text-sm">Tinggalkan pesan untuk dilihat oleh semua pengunjung.</p>
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
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-2">
            <div className="flex gap-2 p-2 bg-surface border-4 border-border rounded-xl">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveColor(c)}
                  className={`w-8 h-8 rounded-full border-4 transition-transform ${activeColor === c ? 'border-primary scale-110' : 'border-border scale-90 hover:scale-100'}`}
                  style={{ backgroundColor: c }}
                  title="Pilih Tema Kartu"
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

      {/* Grid Susunan Catatan */}
      <div className="w-full">
        {notes.length === 0 ? (
          <div className="text-center py-20 text-muted font-bold text-lg border-4 border-dashed border-border rounded-2xl">
            Belum ada catatan masuk. Jadilah yang pertama!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {/* Kita reverse() agar yang terbaru muncul di awal (kiri atas) */}
              {[...notes].reverse().map(note => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative bg-[#1E232E] border-4 border-black p-5 rounded-xl shadow-[6px_6px_0_rgba(0,0,0,1)] flex flex-col gap-4 overflow-hidden group"
                >
                  {/* Garis Aksen Warna Pilihan */}
                  <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: note.color }} />

                  {/* Header Kartu */}
                  <div className="flex justify-between items-start mt-2 border-b-2 border-white/5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center shrink-0" style={{ backgroundColor: note.color }}>
                        <UserCircle2 className="w-6 h-6 text-black/60" />
                      </div>
                      <div>
                        <div className="font-black text-white">Anonim</div>
                        <div className="text-xs text-gray-400 font-semibold flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {note.date || "Beberapa waktu lalu"}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteNote(note.id)}
                      className="p-1 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Hapus Pesan"
                    >
                      <X className="w-5 h-5 text-gray-400 hover:text-red-400" />
                    </button>
                  </div>

                  {/* Isi Pesan */}
                  <div className="flex-1 text-gray-200 font-bold text-base leading-relaxed whitespace-pre-wrap break-words">
                    "{note.text}"
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

    </div>
  );
}
