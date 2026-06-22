"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, FileSearch, Hash, AlignLeft, Clock, Type, BarChart2 } from "lucide-react";

export default function TextAnalyzerPage() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    charsNoSpaces: 0,
    paragraphs: 0,
    sentences: 0,
    readingTime: 0, // in minutes
  });
  const [keywords, setKeywords] = useState<{word: string, count: number}[]>([]);

  useEffect(() => {
    // Menghitung statistik teks secara real-time
    const textTrimmed = text.trim();
    
    // Words
    const wordsArr = textTrimmed ? textTrimmed.split(/\s+/).filter(word => word.length > 0) : [];
    const words = wordsArr.length;
    
    // Chars
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    
    // Paragraphs
    const paragraphs = textTrimmed ? textTrimmed.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
    
    // Sentences
    const sentences = textTrimmed ? textTrimmed.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    
    // Reading Time (rata-rata kecepatan baca 200 kata/menit)
    const readingTime = Math.ceil(words / 200);

    setStats({ words, chars, charsNoSpaces, paragraphs, sentences, readingTime });

    // Menghitung Kepadatan Kata Kunci (Keyword Density)
    if (wordsArr.length > 0) {
      const stopWords = ["dan", "atau", "di", "ke", "dari", "yang", "ini", "itu", "untuk", "dengan", "dalam"];
      const wordCounts: Record<string, number> = {};
      
      wordsArr.forEach(w => {
        const cleanWord = w.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (cleanWord.length > 2 && !stopWords.includes(cleanWord)) {
          wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
        }
      });
      
      const sortedKeywords = Object.entries(wordCounts)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Ambil top 5
        
      setKeywords(sortedKeywords);
    } else {
      setKeywords([]);
    }

  }, [text]);

  const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
    <div className={`bg-surface border-4 border-border rounded-2xl p-6 flex items-center gap-4 neo-brutalist-shadow-sm transition-transform hover:-translate-y-1`}>
      <div className={`w-14 h-14 rounded-xl border-4 border-border flex items-center justify-center ${color}`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div>
        <div className="text-3xl font-black">{value}</div>
        <div className="text-muted font-bold text-sm uppercase tracking-wider">{title}</div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/#tools" className="inline-flex items-center text-muted hover:text-primary mb-8 font-bold neo-brutalist-shadow-sm bg-surface px-4 py-2 rounded-xl border-2 border-border transition-all hover:translate-y-[-2px]">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Dashboard
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Kolom Input */}
        <div className="flex-1 bg-surface border-4 border-border rounded-3xl p-6 md:p-8 neo-brutalist-shadow flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#3B82F6] p-3 rounded-2xl border-4 border-border neo-brutalist-shadow-sm">
              <FileSearch className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black">AI Text Analyzer</h1>
              <p className="text-muted font-medium">Bedah artikel Anda layaknya seorang editor profesional.</p>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tempel artikel atau esai Anda di sini untuk dianalisa secara instan..."
            className="w-full flex-grow min-h-[400px] bg-background border-4 border-border rounded-2xl p-6 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 neo-brutalist-shadow-sm resize-none custom-scrollbar"
          ></textarea>
        </div>

        {/* Kolom Hasil Analisa */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <StatCard title="Kata" value={stats.words} icon={Type} color="bg-[#8B5CF6]" />
            <StatCard title="Karakter" value={stats.chars} icon={Hash} color="bg-[#10B981]" />
            <StatCard title="Paragraf" value={stats.paragraphs} icon={AlignLeft} color="bg-[#F59E0B]" />
            <StatCard title="Menit Baca" value={stats.readingTime} icon={Clock} color="bg-[#EF4444]" />
          </div>

          <div className="bg-surface border-4 border-border rounded-3xl p-6 neo-brutalist-shadow-sm flex-grow">
            <div className="flex items-center gap-3 mb-6 border-b-4 border-border pb-4">
              <BarChart2 className="w-8 h-8" />
              <h3 className="text-xl font-black">Kepadatan Kata (Top 5)</h3>
            </div>
            
            <div className="space-y-4">
              {keywords.length > 0 ? (
                keywords.map((kw, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-bold text-lg">{kw.word}</span>
                    <span className="bg-primary text-white font-black px-3 py-1 rounded-lg border-2 border-border">
                      {kw.count}x
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted font-medium py-8">
                  Belum ada kata kunci yang terdeteksi.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
