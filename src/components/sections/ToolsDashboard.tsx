"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, FileImage, Files, Presentation, Layers, DownloadCloud, PlaySquare, Link2, QrCode, Globe, Sparkles, Music, MessageSquare, RefreshCw, Volume2, FileSearch, Utensils, BookOpen, Dices, Wifi, Brain } from "lucide-react";

const documentTools = [
  {
    id: "word-to-pdf",
    title: "Word ke PDF",
    description: "Ubah dokumen Word (.docx) Anda menjadi PDF yang rapi.",
    icon: FileText,
    color: "bg-[#EAE0CF]",
  },
  {
    id: "pdf-to-word",
    title: "PDF ke Word",
    description: "Konversi file PDF menjadi dokumen Word yang bisa diedit.",
    icon: Files,
    color: "bg-[#7288AE]",
  },
  {
    id: "image-to-pdf",
    title: "Gambar ke PDF",
    description: "Gabungkan gambar JPG/PNG Anda ke dalam satu file PDF.",
    icon: FileImage,
    color: "bg-[#22C55E]",
  },
  {
    id: "office-to-pdf",
    title: "Office ke PDF",
    description: "Ubah presentasi PPT atau tabel Excel Anda ke PDF.",
    icon: Presentation,
    color: "bg-[#F59E0B]",
  },
  {
    id: "merge-pdf",
    title: "Gabung PDF",
    description: "Satukan beberapa file PDF terpisah menjadi satu dokumen utuh.",
    icon: Layers,
    color: "bg-[#8B5CF6]",
  },
  {
    id: "image-converter",
    title: "Pengubah Format Gambar",
    description: "Ubah gambar JPG, PNG, atau WebP secara instan tanpa server.",
    icon: RefreshCw,
    color: "bg-[#22C55E]",
  }
];

const downloaderTools = [
  {
    id: "tiktok-downloader",
    title: "TikTok Downloader",
    description: "Unduh video TikTok tanpa watermark dengan kualitas tinggi.",
    icon: DownloadCloud,
    color: "bg-[#000000]",
  },
  {
    id: "youtube-downloader",
    title: "YouTube Downloader",
    description: "Unduh video dan audio (MP3) dari YouTube secara instan.",
    icon: PlaySquare,
    color: "bg-[#FF0000]",
  },
  {
    id: "youtube-transcript",
    title: "YouTube Transcript",
    description: "Ekstrak teks percakapan (subtitle) dari video YouTube dalam sekejap.",
    icon: MessageSquare,
    color: "bg-[#F59E0B]",
  }
];

const aiTools = [
  {
    id: "ai-image-generator",
    title: "AI Image Generator",
    description: "Hasilkan gambar visual memukau hanya dari teks imajinasi Anda.",
    icon: Sparkles,
    color: "bg-[#8B5CF6]",
  },
  {
    id: "text-to-speech",
    title: "AI Text to Speech",
    description: "Ubah tulisan panjang menjadi suara manusia yang nyata secara instan.",
    icon: Volume2,
    color: "bg-[#EF4444]",
  },
  {
    id: "text-analyzer",
    title: "AI Text Analyzer",
    description: "Bedah dan analisa statistik tulisan, kata kunci, hingga prediksi waktu baca.",
    icon: FileSearch,
    color: "bg-[#3B82F6]",
  }
];

const utilityTools = [
  {
    id: "url-shortener",
    title: "URL Shortener",
    description: "Perpendek link panjang Anda agar lebih rapi dan mudah dibagikan.",
    icon: Link2,
    color: "bg-[#3B82F6]",
  },
  {
    id: "qr-code-generator",
    title: "QR Code Generator",
    description: "Ubah teks atau link menjadi gambar QR Code yang siap dipindai.",
    icon: QrCode,
    color: "bg-[#10B981]",
  },
  {
    id: "ip-tracker",
    title: "IP & Whois Tracker",
    description: "Lacak informasi lokasi dan jaringan dari alamat IP.",
    icon: Globe,
    color: "bg-[#F59E0B]",
  },
  {
    id: "spin-wheel",
    title: "Spin the Wheel",
    description: "Roda keberuntungan untuk mengambil keputusan acak secara seru.",
    icon: Dices,
    color: "bg-[#EC4899]",
  },
  {
    id: "speed-test",
    title: "Internet Speed Test",
    description: "Uji kecepatan unduh (download) koneksi internet Anda langsung di browser.",
    icon: Wifi,
    color: "bg-[#3B82F6]",
  },
  {
    id: "focus-room",
    title: "Ruang Fokus & Pomodoro",
    description: "Timer belajar pintar dengan pemutar musik kustom untuk menemani Anda fokus.",
    icon: Brain,
    color: "bg-[#8B5CF6]",
  },
  {
    id: "text-summarizer",
    title: "Mesin Peringkas Jurnal",
    description: "Ekstrak intisari artikel atau jurnal panjang secara otomatis dan instan.",
    icon: FileText,
    color: "bg-[#10B981]",
  }
];

const entertainmentTools = [
  {
    id: "lyrics-search",
    title: "Pencari Lirik Lagu",
    description: "Cari lirik, gambar sampul album, dan tautan lagu instan.",
    icon: Music,
    color: "bg-[#1DB954]",
  },
  {
    id: "recipe-search",
    title: "Pencari Resep Kuliner",
    description: "Jelajahi panduan memasak untuk ribuan hidangan lezat di dunia.",
    icon: Utensils,
    color: "bg-[#F59E0B]",
  },
  {
    id: "book-search",
    title: "Pencari Buku & Manga",
    description: "Temukan sinopsis buku dan detail komik/manga seluruh dunia.",
    icon: BookOpen,
    color: "bg-[#10B981]",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export function ToolsDashboard() {
  return (
    <section id="tools" className="py-10 md:py-20 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black mb-4">Pilih Alat Anda</h2>
          <p className="text-muted text-lg">Semua yang Anda butuhkan untuk memanipulasi dokumen dan media ada di sini.</p>
        </div>

        {/* Seksi Alat Dokumen */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8 max-w-6xl mx-auto">
            <div className="h-2 flex-grow bg-border rounded-full hidden sm:block"></div>
            <h3 className="text-2xl md:text-3xl font-black bg-surface px-6 py-2 border-4 border-border rounded-xl neo-brutalist-shadow-sm">
              Alat Dokumen
            </h3>
            <div className="h-2 flex-grow bg-border rounded-full hidden sm:block"></div>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 max-w-6xl mx-auto"
          >
            {documentTools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.id}`} className="block h-full outline-none">
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full bg-surface border-2 md:border-4 border-border rounded-xl md:rounded-2xl p-3 md:p-6 neo-brutalist-shadow-sm md:neo-brutalist-shadow transition-shadow duration-300 hover:neo-brutalist-shadow-hover flex flex-col items-center text-center group cursor-pointer"
                >
                  <div className={`w-12 h-12 md:w-20 md:h-20 rounded-xl border-2 md:border-4 border-border mb-6 flex items-center justify-center neo-brutalist-shadow-sm group-hover:scale-110 transition-transform duration-300 ${tool.color}`}>
                    <tool.icon className="w-6 h-6 md:w-10 md:h-10 text-[#111844]" />
                  </div>
                  <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-3 leading-tight group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-muted text-[10px] md:text-sm flex-grow leading-tight md:leading-normal">{tool.description}</p>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-8 max-w-6xl mx-auto">
            <div className="h-2 flex-grow bg-border rounded-full hidden sm:block"></div>
            <h3 className="text-2xl md:text-3xl font-black bg-surface px-6 py-2 border-4 border-border rounded-xl neo-brutalist-shadow-sm">
              Alat Pengunduh
            </h3>
            <div className="h-2 flex-grow bg-border rounded-full hidden sm:block"></div>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 max-w-6xl mx-auto"
          >
            {downloaderTools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.id}`} className="block h-full outline-none">
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full bg-surface border-2 md:border-4 border-border rounded-xl md:rounded-2xl p-3 md:p-6 neo-brutalist-shadow-sm md:neo-brutalist-shadow transition-shadow duration-300 hover:neo-brutalist-shadow-hover flex flex-col items-center text-center group cursor-pointer"
                >
                  <div className={`w-12 h-12 md:w-20 md:h-20 rounded-xl border-2 md:border-4 border-border mb-6 flex items-center justify-center neo-brutalist-shadow-sm group-hover:scale-110 transition-transform duration-300 ${tool.color}`}>
                    <tool.icon className="w-6 h-6 md:w-10 md:h-10 text-white" />
                  </div>
                  <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-3 leading-tight group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-muted text-[10px] md:text-sm flex-grow leading-tight md:leading-normal">{tool.description}</p>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Seksi Kecerdasan Buatan (AI) */}
        <div className="mb-16 mt-16">
          <div className="flex items-center gap-4 mb-8 max-w-6xl mx-auto">
            <div className="h-2 flex-grow bg-border rounded-full hidden sm:block"></div>
            <h3 className="text-2xl md:text-3xl font-black bg-surface px-6 py-2 border-4 border-border rounded-xl neo-brutalist-shadow-sm">
              Kecerdasan Buatan (AI)
            </h3>
            <div className="h-2 flex-grow bg-border rounded-full hidden sm:block"></div>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 max-w-6xl mx-auto"
          >
            {aiTools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.id}`} className="block h-full outline-none">
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full bg-surface border-2 md:border-4 border-border rounded-xl md:rounded-2xl p-3 md:p-6 neo-brutalist-shadow-sm md:neo-brutalist-shadow transition-shadow duration-300 hover:neo-brutalist-shadow-hover flex flex-col items-center text-center group cursor-pointer"
                >
                  <div className={`w-12 h-12 md:w-20 md:h-20 rounded-xl border-2 md:border-4 border-border mb-6 flex items-center justify-center neo-brutalist-shadow-sm group-hover:scale-110 transition-transform duration-300 ${tool.color}`}>
                    <tool.icon className="w-6 h-6 md:w-10 md:h-10 text-white" />
                  </div>
                  <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-3 leading-tight group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-muted text-[10px] md:text-sm flex-grow leading-tight md:leading-normal">{tool.description}</p>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Seksi Alat Utilitas & Jaringan */}
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-8 max-w-6xl mx-auto">
            <div className="h-2 flex-grow bg-border rounded-full hidden sm:block"></div>
            <h3 className="text-2xl md:text-3xl font-black bg-surface px-6 py-2 border-4 border-border rounded-xl neo-brutalist-shadow-sm">
              Utilitas & Jaringan
            </h3>
            <div className="h-2 flex-grow bg-border rounded-full hidden sm:block"></div>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 max-w-6xl mx-auto"
          >
            {utilityTools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.id}`} className="block h-full outline-none">
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full bg-surface border-2 md:border-4 border-border rounded-xl md:rounded-2xl p-3 md:p-6 neo-brutalist-shadow-sm md:neo-brutalist-shadow transition-shadow duration-300 hover:neo-brutalist-shadow-hover flex flex-col items-center text-center group cursor-pointer"
                >
                  <div className={`w-12 h-12 md:w-20 md:h-20 rounded-xl border-2 md:border-4 border-border mb-6 flex items-center justify-center neo-brutalist-shadow-sm group-hover:scale-110 transition-transform duration-300 ${tool.color}`}>
                    <tool.icon className="w-6 h-6 md:w-10 md:h-10 text-white" />
                  </div>
                  <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-3 leading-tight group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-muted text-[10px] md:text-sm flex-grow leading-tight md:leading-normal">{tool.description}</p>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Seksi Hiburan & Pencarian */}
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-8 max-w-6xl mx-auto">
            <div className="h-2 flex-grow bg-border rounded-full hidden sm:block"></div>
            <h3 className="text-2xl md:text-3xl font-black bg-surface px-6 py-2 border-4 border-border rounded-xl neo-brutalist-shadow-sm">
              Hiburan & Pencarian
            </h3>
            <div className="h-2 flex-grow bg-border rounded-full hidden sm:block"></div>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 max-w-6xl mx-auto"
          >
            {entertainmentTools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.id}`} className="block h-full outline-none">
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full bg-surface border-2 md:border-4 border-border rounded-xl md:rounded-2xl p-3 md:p-6 neo-brutalist-shadow-sm md:neo-brutalist-shadow transition-shadow duration-300 hover:neo-brutalist-shadow-hover flex flex-col items-center text-center group cursor-pointer"
                >
                  <div className={`w-12 h-12 md:w-20 md:h-20 rounded-xl border-2 md:border-4 border-border mb-6 flex items-center justify-center neo-brutalist-shadow-sm group-hover:scale-110 transition-transform duration-300 ${tool.color}`}>
                    <tool.icon className="w-6 h-6 md:w-10 md:h-10 text-white" />
                  </div>
                  <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-3 leading-tight group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-muted text-[10px] md:text-sm flex-grow leading-tight md:leading-normal">{tool.description}</p>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
