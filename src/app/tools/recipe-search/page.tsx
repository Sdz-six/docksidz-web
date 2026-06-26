"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Utensils, Search, ChefHat, Info, Globe2, PlaySquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { indonesianRecipes } from "@/data/indonesianRecipes";

interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  strTags: string;
  isTranslating?: boolean;
  translatedInstructions?: string;
}

export default function RecipeSearchPage() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translateStatus, setTranslateStatus] = useState<string | null>(null);

  // Fungsi untuk menerjemahkan teks menggunakan Google Translate API (Cocok untuk teks resep prosedural)
  const translateText = async (text: string, from: string, to: string) => {
    try {
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`);
      const data = await response.json();
      let translated = "";
      if (data && data[0]) {
        data[0].forEach((item: any) => {
          if (item[0]) translated += item[0];
        });
      }
      return translated || text;
    } catch (err) {
      console.error("Translate error:", err);
      return text; // Fallback
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setTranslateStatus("Menerjemahkan kata kunci...");
    setRecipes([]);

    try {
      // 1. Cek Pangkalan Data Lokal Nusantara Terlebih Dahulu (Offline DB)
      const qLower = query.toLowerCase();
      const localMatches = indonesianRecipes.filter(
        (r) => r.strMeal.toLowerCase().includes(qLower) || r.strTags.toLowerCase().includes(qLower)
      );

      if (localMatches.length > 0) {
        setTranslateStatus("Memuat resep dari arsip Nusantara...");
        // Gunakan timeout kecil untuk efek simulasi pencarian
        await new Promise((resolve) => setTimeout(resolve, 500));
        setRecipes(localMatches.map((m) => ({ ...m, isTranslating: false })));
        
        try {
          const historyData = localStorage.getItem("docksidz_history");
          const history = historyData ? JSON.parse(historyData) : [];
          history.push({ id: Date.now().toString(), name: `Mencari Resep Lokal: ${query}`, type: "Pencarian Resep", url: "", timestamp: Date.now() });
          localStorage.setItem("docksidz_history", JSON.stringify(history));
          window.dispatchEvent(new Event("history-updated"));
        } catch (e) {}

        setLoading(false);
        setTranslateStatus(null);
        return;
      }

      // 2. Terjemahkan kata kunci dari ID ke EN jika tidak ada di DB Lokal
      const translatedQuery = await translateText(query, "id", "en");
      setTranslateStatus(`Mencari resep internasional untuk: "${translatedQuery}"...`);

      // 3. Fetch TheMealDB (Pangkalan Data Internasional)
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(translatedQuery)}`);
      const data = await response.json();

      if (data.meals) {
        setRecipes(data.meals.map((m: any) => ({ ...m, isTranslating: false })));
        try {
          const historyData = localStorage.getItem("docksidz_history");
          const history = historyData ? JSON.parse(historyData) : [];
          history.push({ id: Date.now().toString(), name: `Mencari Resep: ${translatedQuery}`, type: "Pencarian Resep", url: "", timestamp: Date.now() });
          localStorage.setItem("docksidz_history", JSON.stringify(history));
          window.dispatchEvent(new Event("history-updated"));
        } catch (e) {}
      } else {
        // Coba cari tanpa terjemahan (siapa tahu pengguna mengetik masakan spesifik seperti "Nasi Goreng")
        const retryResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
        const retryData = await retryResponse.json();
        
        if (retryData.meals) {
          setRecipes(retryData.meals.map((m: any) => ({ ...m, isTranslating: false })));
          try {
            const historyData = localStorage.getItem("docksidz_history");
            const history = historyData ? JSON.parse(historyData) : [];
            history.push({ id: Date.now().toString(), name: `Mencari Resep: ${query}`, type: "Pencarian Resep", url: "", timestamp: Date.now() });
            localStorage.setItem("docksidz_history", JSON.stringify(history));
            window.dispatchEvent(new Event("history-updated"));
          } catch (e) {}
        } else {
          setError(`Tidak ditemukan resep untuk "${query}". Coba kata kunci atau bahan lain.`);
        }
      }
    } catch (err) {
      setError("Gagal mengambil data resep. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
      setTranslateStatus(null);
    }
  };

  const translateRecipe = async (index: number, text: string) => {
    setRecipes(prev => {
      const newR = [...prev];
      newR[index].isTranslating = true;
      return newR;
    });

    const translatedText = await translateText(text, "en", "id");

    setRecipes(prev => {
      const newR = [...prev];
      newR[index].translatedInstructions = translatedText;
      newR[index].isTranslating = false;
      return newR;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/#tools" className="inline-flex items-center text-muted hover:text-primary mb-8 font-bold neo-brutalist-shadow-sm bg-surface px-4 py-2 rounded-xl border-2 border-border transition-all hover:translate-y-[-2px]">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Dashboard
      </Link>

      <div className="bg-surface border-4 border-border rounded-3xl p-6 md:p-10 neo-brutalist-shadow mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <ChefHat className="w-40 h-40" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#F59E0B] p-4 rounded-2xl neo-brutalist-shadow-sm border-4 border-border">
              <Utensils className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">Pencari Resep Masakan</h1>
              <p className="text-muted text-lg mt-1 font-medium flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-[#3B82F6]" />
                Dilengkapi fitur Terjemahan Pintar (Bisa cari dengan Bahasa Indonesia)
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari masakan atau bahan... (contoh: Ayam Goreng, Sapi, Mie)"
                className="w-full bg-background border-4 border-border rounded-2xl px-6 py-4 text-xl font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 neo-brutalist-shadow-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !query.trim()}
              className="py-4 px-8 text-xl h-auto"
            >
              {loading ? "Memproses..." : "Cari Resep"}
            </Button>
          </form>

          {translateStatus && !error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="mt-4 text-primary font-bold animate-pulse flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              {translateStatus}
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-destructive/10 border-4 border-destructive rounded-xl text-destructive font-bold flex items-center"
            >
              <Info className="w-6 h-6 mr-3 shrink-0" />
              {error}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {recipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {recipes.map((recipe, index) => (
              <div key={recipe.idMeal} className="bg-surface border-4 border-border rounded-3xl overflow-hidden neo-brutalist-shadow flex flex-col md:flex-row">
                <div className="w-full md:w-2/5 border-b-4 md:border-b-0 md:border-r-4 border-border flex flex-col">
                  <img 
                    src={recipe.strMealThumb} 
                    alt={recipe.strMeal} 
                    className="w-full h-auto min-h-[300px] max-h-[400px] object-cover"
                  />
                  {recipe.strYoutube && (
                    <a 
                      href={recipe.strYoutube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#FF0000] text-white font-black py-4 px-6 flex items-center justify-center gap-2 hover:bg-red-700 transition-colors border-t-4 border-border"
                    >
                      <PlaySquare className="w-6 h-6" />
                      Tonton Video Tutorial
                    </a>
                  )}
                </div>
                <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col max-h-[700px]">
                  <div className="mb-4">
                    <h2 className="text-3xl font-black mb-2">{recipe.strMeal}</h2>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-primary text-white font-bold px-3 py-1 rounded-lg border-2 border-border text-sm">
                        {recipe.strCategory}
                      </span>
                      <span className={`font-bold px-3 py-1 rounded-lg border-2 border-border text-sm ${recipe.strArea === 'Malaysian' ? 'bg-[#EF4444] text-white' : 'bg-[#10B981] text-white'}`}>
                        {recipe.strArea === 'Malaysian' ? 'Asia Tenggara/Lokal' : recipe.strArea}
                      </span>
                      {recipe.strTags && recipe.strTags.split(',').slice(0,2).map(tag => (
                        <span key={tag} className="bg-background text-muted font-bold px-3 py-1 rounded-lg border-2 border-border text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-b-4 border-border pb-2 mt-4 mb-3">
                    <h3 className="text-xl font-bold">Cara Memasak</h3>
                    {!recipe.translatedInstructions && (
                      <button 
                        onClick={() => translateRecipe(index, recipe.strInstructions)}
                        disabled={recipe.isTranslating}
                        className="text-xs sm:text-sm font-bold bg-[#3B82F6] text-white px-3 py-1.5 rounded-lg border-2 border-border hover:opacity-80 transition-colors flex items-center gap-1"
                      >
                        {recipe.isTranslating ? "Menerjemahkan..." : "Terjemahkan ke (ID)"}
                      </button>
                    )}
                  </div>

                  <div className="flex-grow overflow-y-auto custom-scrollbar pr-4 relative">
                    {recipe.translatedInstructions ? (
                      <div className="bg-[#3B82F6]/10 p-4 rounded-xl border-2 border-[#3B82F6] mb-4 relative">
                        <div className="absolute top-2 right-2 flex items-center gap-1 text-[#3B82F6] text-xs font-bold opacity-70">
                          <Globe2 className="w-3 h-3" /> Terjemahan ID
                        </div>
                        <p className="whitespace-pre-wrap font-medium leading-relaxed text-text mt-2">
                          {recipe.translatedInstructions}
                        </p>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap font-medium leading-relaxed text-text">
                        {recipe.strInstructions}
                      </p>
                    )}
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
