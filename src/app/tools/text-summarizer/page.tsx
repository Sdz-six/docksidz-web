"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Sparkles, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Indonesian Stopwords (Kata hubung umum yang tidak penting untuk skor)
const stopWords = new Set(["dan", "atau", "tetapi", "karena", "sebab", "sehingga", "maka", "untuk", "dari", "ke", "di", "yang", "dengan", "ini", "itu", "adalah", "merupakan", "dalam", "pada", "sebuah", "sebagai", "bahwa", "juga", "oleh", "akan", "telah", "bisa", "dapat", "ada", "tidak", "bukan"]);

export default function TextSummarizerPage() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [ratio, setRatio] = useState(30); // Persentase ringkasan
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Algoritma Extractive Summarization Bawaan (Berjalan 100% Offline di Browser)
  const summarizeText = () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    setSummary("");

    setTimeout(() => {
      try {
        // 1. Pisahkan menjadi kalimat
        // Menggunakan regex sederhana untuk titik, tanda tanya, atau seru diikuti spasi.
        const sentences = inputText.match(/[^.!?]+[.!?]+/g) || [inputText];
        
        if (sentences.length <= 1) {
          setSummary(inputText);
          setIsProcessing(false);
          return;
        }

        // 2. Hitung frekuensi kata
        const wordFrequencies: Record<string, number> = {};
        const words = inputText.toLowerCase().match(/\b\w+\b/g) || [];
        
        let maxFreq = 0;
        for (const word of words) {
          if (!stopWords.has(word)) {
            wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
            if (wordFrequencies[word] > maxFreq) {
              maxFreq = wordFrequencies[word];
            }
          }
        }

        // Normalisasi frekuensi
        for (const word in wordFrequencies) {
          wordFrequencies[word] = wordFrequencies[word] / maxFreq;
        }

        // 3. Beri skor pada setiap kalimat
        const sentenceScores: { text: string; score: number; index: number }[] = [];
        
        sentences.forEach((sentence, index) => {
          let score = 0;
          const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
          
          for (const word of sentenceWords) {
            if (wordFrequencies[word]) {
              score += wordFrequencies[word];
            }
          }
          
          // Penalti kalimat yang terlalu panjang agar tidak mendominasi
          if (sentenceWords.length > 0) {
             score = score / sentenceWords.length;
          }

          sentenceScores.push({ text: sentence.trim(), score, index });
        });

        // 4. Pilih kalimat terbaik berdasarkan rasio
        // Urutkan berdasarkan skor tertinggi
        sentenceScores.sort((a, b) => b.score - a.score);
        
        const numSentencesToKeep = Math.max(1, Math.ceil((ratio / 100) * sentences.length));
        const topSentences = sentenceScores.slice(0, numSentencesToKeep);

        // 5. Urutkan kembali sesuai kemunculan aslinya di teks
        topSentences.sort((a, b) => a.index - b.index);

        const finalSummary = topSentences.map(s => s.text).join(" ");
        setSummary(finalSummary);
      } catch (e) {
        setSummary("Gagal meringkas teks. Pastikan format teks valid.");
      }
      
      setIsProcessing(false);
    }, 800); // Simulasi delay agar terlihat bekerja (animasi)
  };

  const copyToClipboard = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <Link href="/#tools" className="inline-flex items-center text-muted hover:text-primary mb-8 font-bold neo-brutalist-shadow-sm bg-surface px-4 py-2 rounded-xl border-2 border-border transition-all hover:translate-y-[-2px]">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Dashboard
      </Link>

      <div className="mb-8 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
          <div className="bg-[#8B5CF6] p-3 rounded-xl neo-brutalist-shadow-sm border-2 border-border">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black">Mesin Peringkas Jurnal</h1>
        </div>
        <p className="text-muted text-lg">Ekstrak intisari dari artikel, jurnal, atau esai yang sangat panjang dalam hitungan detik. 100% Berjalan Offline di Browser Anda.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel: Input */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="bg-surface border-4 border-border rounded-3xl p-6 neo-brutalist-shadow h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b-2 border-border pb-3">
              1. Masukkan Teks Asli
            </h2>
            <textarea 
              className="flex-1 bg-background border-4 border-border rounded-xl p-4 resize-none outline-none focus:border-[#8B5CF6] font-mono text-sm leading-relaxed min-h-[300px]"
              placeholder="Tempel (Paste) teks jurnal, berita, atau materi kuliah yang panjang di sini..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></textarea>
            
            <div className="mt-6">
              <label className="text-sm font-bold block mb-2 flex justify-between">
                <span>Panjang Ringkasan (Rasio)</span>
                <span className="text-[#8B5CF6]">{ratio}% dari teks asli</span>
              </label>
              <input 
                type="range" 
                min="10" 
                max="80" 
                step="10"
                value={ratio}
                onChange={(e) => setRatio(Number(e.target.value))}
                className="w-full accent-[#8B5CF6]"
              />
            </div>

            <Button 
              onClick={summarizeText} 
              disabled={isProcessing || !inputText.trim()}
              className="mt-6 w-full py-4 text-lg bg-[#8B5CF6] hover:bg-[#7C3AED] neo-brutalist-shadow-sm flex items-center justify-center gap-2"
            >
              {isProcessing ? <Sparkles className="w-6 h-6 animate-pulse" /> : <Sparkles className="w-6 h-6" />}
              {isProcessing ? "Mengekstrak Intisari..." : "Ringkas Teks!"}
            </Button>
          </div>
        </div>

        {/* Right Panel: Output */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="bg-[#1A1F2B] border-4 border-border rounded-3xl p-6 neo-brutalist-shadow h-full flex flex-col relative overflow-hidden">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b-2 border-border/50 pb-3 text-white">
              2. Hasil Ringkasan
            </h2>
            
            <div className="flex-1 bg-black/50 border-2 border-border/50 rounded-xl p-6 text-[#E2E8F0] font-sans text-base leading-loose overflow-y-auto min-h-[300px]">
              {isProcessing ? (
                <div className="h-full flex flex-col items-center justify-center text-muted">
                  <div className="w-8 h-8 border-4 border-t-[#8B5CF6] border-r-transparent border-b-[#8B5CF6] border-l-transparent rounded-full animate-spin mb-4"></div>
                  <p className="font-mono text-sm animate-pulse">Menghitung frekuensi kata... Mengevaluasi skor kalimat...</p>
                </div>
              ) : summary ? (
                <p>{summary}</p>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted opacity-50">
                  <FileText className="w-16 h-16 mb-4" />
                  <p className="font-bold">Hasil ringkasan akan muncul di sini</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <Button 
                onClick={copyToClipboard}
                disabled={!summary || isProcessing}
                variant="outline"
                className="bg-transparent border-2 border-white/20 text-white hover:bg-white/10 hover:text-white transition-colors"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" /> : <Copy className="w-5 h-5 mr-2" />}
                {copied ? "Tersalin!" : "Salin Hasil"}
              </Button>
            </div>
            
            {/* Dekorasi neo-brutalist corner */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#8B5CF6] transform translate-x-8 -translate-y-8 rotate-45 border-b-4 border-border"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
