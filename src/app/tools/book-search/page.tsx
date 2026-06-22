"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Search, Library, User, Calendar, Book, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  description?: string; // Sinopsis setelah dimuat
  loadingSynopsis?: boolean; // State loading per buku
  errorSynopsis?: boolean;
}

interface Manga {
  mal_id: number;
  title: string;
  authors: { name: string }[];
  published: { prop: { from: { year: number } } };
  images: { jpg: { image_url: string } };
  synopsis: string;
  chapters: number;
  volumes: number;
  score: number;
  url: string;
  isTranslating?: boolean;
}

type SearchMode = "book" | "manga";

export default function BookSearchPage() {
  const [mode, setMode] = useState<SearchMode>("book");
  const [query, setQuery] = useState("");
  
  const [books, setBooks] = useState<Book[]>([]);
  const [mangas, setMangas] = useState<Manga[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translateText = async (text: string) => {
    try {
      // Membagi teks jika terlalu panjang (MyMemory punya limit ~500 chars per request)
      // Namun untuk sinopsis normal biasanya aman. Kita gunakan MyMemory API (Neural/DeepL backend).
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.substring(0, 500))}&langpair=en|id`);
      const data = await response.json();
      
      if (data && data.responseData && data.responseData.translatedText) {
        let result = data.responseData.translatedText;
        if (text.length > 500) {
           result += "... (Terjemahan dipotong karena batas karakter)";
        }
        return result;
      }
      return text;
    } catch (err) {
      console.error("Translate error:", err);
      return text;
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setBooks([]);
    setMangas([]);

    try {
      if (mode === "book") {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`);
        const data = await response.json();
        if (data.docs && data.docs.length > 0) {
          setBooks(data.docs.map((d: any) => ({ ...d, loadingSynopsis: false })));
        } else {
          setError(`Tidak ditemukan buku dengan judul "${query}".`);
        }
      } else {
        const response = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=10`);
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setMangas(data.data.map((m: any) => ({ ...m, isTranslating: false })));
        } else {
          setError(`Tidak ditemukan manga/komik dengan judul "${query}".`);
        }
      }
    } catch (err) {
      setError(`Gagal mengambil data ${mode === "book" ? "buku" : "manga"}. Periksa koneksi internet Anda.`);
    } finally {
      setLoading(false);
    }
  };

  const loadSynopsis = async (index: number, key: string) => {
    // Set status loading untuk buku ini
    setBooks(prev => {
      const newBooks = [...prev];
      newBooks[index].loadingSynopsis = true;
      return newBooks;
    });

    try {
      const response = await fetch(`https://openlibrary.org${key}.json`);
      const data = await response.json();
      
      let synopsisText = "Sinopsis tidak tersedia di database OpenLibrary untuk edisi ini.";
      if (data.description) {
        synopsisText = typeof data.description === 'string' 
          ? data.description 
          : data.description.value || synopsisText;
      }

      // Translate ke Bahasa Indonesia otomatis
      const translatedSynopsis = await translateText(synopsisText);

      setBooks(prev => {
        const newBooks = [...prev];
        newBooks[index].description = translatedSynopsis;
        newBooks[index].loadingSynopsis = false;
        return newBooks;
      });
    } catch (err) {
      setBooks(prev => {
        const newBooks = [...prev];
        newBooks[index].loadingSynopsis = false;
        newBooks[index].errorSynopsis = true;
        newBooks[index].description = "Gagal memuat sinopsis. Silakan coba lagi nanti.";
        return newBooks;
      });
    }
  };

  const translateMangaSynopsis = async (index: number, text: string) => {
    setMangas(prev => {
      const newMangas = [...prev];
      newMangas[index].isTranslating = true;
      return newMangas;
    });

    const translatedText = await translateText(text);

    setMangas(prev => {
      const newMangas = [...prev];
      newMangas[index].synopsis = translatedText;
      newMangas[index].isTranslating = false;
      return newMangas;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/#tools" className="inline-flex items-center text-muted hover:text-primary mb-8 font-bold neo-brutalist-shadow-sm bg-surface px-4 py-2 rounded-xl border-2 border-border transition-all hover:translate-y-[-2px]">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Dashboard
      </Link>

      <div className="bg-surface border-4 border-border rounded-3xl p-6 md:p-10 neo-brutalist-shadow mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Library className="w-40 h-40" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-[#10B981] p-4 rounded-2xl neo-brutalist-shadow-sm border-4 border-border">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">Pencari Buku & Manga</h1>
                <p className="text-muted text-lg mt-1 font-medium">Jelajahi literatur dunia dan baca sinopsisnya langsung di sini.</p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-background border-4 border-border rounded-2xl p-1 neo-brutalist-shadow-sm self-stretch md:self-auto">
              <button
                onClick={() => setMode("book")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold transition-all ${mode === "book" ? "bg-primary text-white border-2 border-black neo-brutalist-shadow-sm" : "text-muted hover:text-text hover:bg-surface"}`}
              >
                <Book className="w-5 h-5" />
                Buku
              </button>
              <button
                onClick={() => setMode("manga")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold transition-all ${mode === "manga" ? "bg-[#F59E0B] text-black border-2 border-black neo-brutalist-shadow-sm" : "text-muted hover:text-text hover:bg-surface"}`}
              >
                <BookOpen className="w-5 h-5" />
                Manga
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="mt-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={mode === "book" ? "Cari judul buku atau pengarang..." : "Cari judul manga, manhwa, komik..."}
                className="w-full bg-background border-4 border-border rounded-2xl px-6 py-4 text-xl font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 neo-brutalist-shadow-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !query.trim()}
              className={`py-4 px-8 text-xl h-auto ${mode === "manga" ? "bg-[#F59E0B] hover:bg-[#d98b09]" : ""}`}
            >
              {loading ? "Mencari..." : "Cari"}
            </Button>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-destructive/10 border-4 border-destructive rounded-xl text-destructive font-bold flex items-center"
            >
              <div className="w-2 h-2 rounded-full bg-destructive mr-3 animate-ping"></div>
              {error}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Render Books */}
        {mode === "book" && books.length > 0 && (
          <motion.div
            key="books"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {books.map((book, index) => (
              <div key={book.key + index} className="bg-surface border-4 border-border rounded-3xl overflow-hidden neo-brutalist-shadow flex flex-col transition-all">
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="w-full sm:w-1/3 bg-background border-b-4 sm:border-b-0 sm:border-r-4 border-border p-4 flex items-center justify-center shrink-0">
                    {book.cover_i ? (
                      <img 
                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`} 
                        alt={book.title} 
                        className="w-full h-auto max-h-[250px] object-contain shadow-lg border-2 border-border"
                      />
                    ) : (
                      <div className="w-full h-48 max-w-[150px] bg-surface border-2 border-border flex items-center justify-center text-muted font-bold text-center p-2">
                        Tanpa Sampul
                      </div>
                    )}
                  </div>
                  <div className="w-full sm:w-2/3 p-6 flex flex-col">
                    <h2 className="text-xl font-black mb-2 line-clamp-2">{book.title}</h2>
                    
                    <div className="space-y-2 mb-4">
                      {book.author_name && (
                        <div className="flex items-start gap-2 text-sm font-bold text-primary">
                          <User className="w-4 h-4 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{book.author_name.join(", ")}</span>
                        </div>
                      )}
                      {book.first_publish_year && (
                        <div className="flex items-center gap-2 text-sm font-medium text-muted">
                          <Calendar className="w-4 h-4 shrink-0" />
                          <span>Terbit: {book.first_publish_year}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Sinopsis Area */}
                    <div className="mt-auto">
                      {book.description ? (
                        <div className="bg-background border-4 border-border rounded-xl p-4 max-h-[200px] overflow-y-auto custom-scrollbar">
                          <h4 className="font-black mb-2 text-sm flex items-center gap-2">
                            <span>Sinopsis (Bahasa Indonesia):</span>
                          </h4>
                          <p className="text-sm font-medium whitespace-pre-wrap">{book.description}</p>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => loadSynopsis(index, book.key)}
                          disabled={book.loadingSynopsis}
                          variant="outline"
                          className="w-full font-bold flex items-center justify-center gap-2 py-3"
                        >
                          {book.loadingSynopsis ? (
                            <span className="animate-pulse">Menyedot & Menerjemahkan...</span>
                          ) : (
                            <>
                              <ChevronDown className="w-5 h-5" />
                              Baca Sinopsis (ID)
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Tombol Eksternal Buku */}
                    <div className="flex flex-col xl:flex-row gap-3 mt-4 pt-4 border-t-4 border-border">
                      <a 
                        href={`https://openlibrary.org${book.key}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-background border-4 border-border font-bold py-2 px-4 rounded-xl neo-brutalist-shadow-sm hover:bg-border transition-colors text-sm"
                      >
                        Lihat di OpenLibrary
                      </a>
                      <a 
                        href={`https://www.google.com/search?q=${encodeURIComponent(book.title + " book")}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-primary text-white border-4 border-border font-bold py-2 px-4 rounded-xl neo-brutalist-shadow-sm hover:opacity-90 transition-colors text-sm"
                      >
                        Cari di Google
                      </a>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Render Manga */}
        {mode === "manga" && mangas.length > 0 && (
          <motion.div
            key="mangas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {mangas.map((manga, index) => (
              <div key={`${manga.mal_id}-${index}`} className="bg-surface border-4 border-border rounded-3xl overflow-hidden neo-brutalist-shadow flex flex-col transition-all">
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="w-full sm:w-1/3 bg-background border-b-4 sm:border-b-0 sm:border-r-4 border-border p-4 flex items-center justify-center shrink-0">
                    <img 
                      src={manga.images.jpg.image_url} 
                      alt={manga.title} 
                      className="w-full h-auto max-h-[250px] object-contain shadow-lg border-2 border-border"
                    />
                  </div>
                  <div className="w-full sm:w-2/3 p-6 flex flex-col">
                    <h2 className="text-xl font-black mb-2 line-clamp-2">{manga.title}</h2>
                    
                    <div className="space-y-2 mb-4">
                      {manga.authors && manga.authors.length > 0 && (
                        <div className="flex items-start gap-2 text-sm font-bold text-[#F59E0B]">
                          <User className="w-4 h-4 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{manga.authors.map(a => a.name).join(", ")}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm font-medium text-muted">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>Rilis: {manga.published.prop.from.year || "Tidak diketahui"}</span>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <span className="bg-background border-2 border-border text-xs font-bold px-2 py-1 rounded-md">⭐ {manga.score || "N/A"}</span>
                        <span className="bg-background border-2 border-border text-xs font-bold px-2 py-1 rounded-md">Vol: {manga.volumes || "?"}</span>
                        <span className="bg-background border-2 border-border text-xs font-bold px-2 py-1 rounded-md">Ch: {manga.chapters || "?"}</span>
                      </div>
                    </div>
                    
                    {/* Sinopsis Area Manga */}
                    <div className="mt-auto bg-background border-4 border-border rounded-xl p-4 max-h-[160px] overflow-y-auto custom-scrollbar relative group">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-black text-sm">Sinopsis:</h4>
                        {manga.synopsis && !manga.synopsis.includes("Terjemahan selesai") && (
                          <button 
                            onClick={() => translateMangaSynopsis(index, manga.synopsis)}
                            disabled={manga.isTranslating}
                            className="text-xs font-bold bg-primary text-white px-2 py-1 rounded-md border-2 border-border hover:bg-primary/80 transition-colors"
                          >
                            {manga.isTranslating ? "Menerjemahkan..." : "Terjemahkan (ID)"}
                          </button>
                        )}
                      </div>
                      <p className="text-sm font-medium whitespace-pre-wrap">
                        {manga.synopsis || "Sinopsis tidak tersedia."}
                      </p>
                    </div>

                    {/* Tombol Eksternal */}
                    <div className="flex flex-col xl:flex-row gap-3 mt-4 pt-4 border-t-4 border-border">
                      <a 
                        href={manga.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-background border-4 border-border font-bold py-2 px-4 rounded-xl neo-brutalist-shadow-sm hover:bg-border transition-colors text-sm"
                      >
                        Lihat di MyAnimeList
                      </a>
                      <a 
                        href={`https://www.google.com/search?q=${encodeURIComponent(manga.title + " manga")}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-[#F59E0B] text-black border-4 border-border font-bold py-2 px-4 rounded-xl neo-brutalist-shadow-sm hover:opacity-90 transition-colors text-sm"
                      >
                        Cari di Google
                      </a>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
