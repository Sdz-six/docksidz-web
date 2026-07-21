"use client";

import { useEffect, useState } from "react";
import { Activity, Server, Clock, Battery, CloudRain, Users, StickyNote } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function WebTraffic() {
  const [visitorData, setVisitorData] = useState<any>(null);
  const [browserName, setBrowserName] = useState("");
  const [osName, setOsName] = useState<string>("Unknown");
  const [rainIntensity, setRainIntensity] = useState<string>("normal");
  const [selectedMascot, setSelectedMascot] = useState<string>("off");
  const [hits, setHits] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState("100%");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Eksplisit mendaftarkan Service Worker untuk PWABuilder
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Get Browser Info
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent;
      let browser = "Unknown";
      if (ua.indexOf("Firefox") > -1) browser = "Firefox";
      else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
      else if (ua.indexOf("Trident") > -1) browser = "IE";
      else if (ua.indexOf("Edge") > -1) browser = "Edge";
      else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
      else if (ua.indexOf("Safari") > -1) browser = "Safari";
      
      let os = "Unknown";
      if (/Android/.test(ua)) os = "Mobile (Android)";
      else if (/iPhone|iPad|iPod/.test(ua)) os = "Mobile (iOS)";
      else if (navigator.platform.includes("Win")) os = "Desktop (Win)";
      else if (navigator.platform.includes("Mac")) os = "Desktop (Mac)";
      else if (navigator.platform.includes("Linux")) os = "Linux (Desktop)";

      setBrowserName(browser);
      setOsName(os);

      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          setBatteryLevel(`${Math.round(battery.level * 100)}%`);
        }).catch(() => setBatteryLevel("100%"));
      }
    }

    // Fetch Global Hit Counter (Global API)
    fetch("/api/traffic", { cache: "no-store" })
      .then(res => res.json())
      .then(data => setHits(data.hits))
      .catch(() => setHits(999));

    // Fetch IP and Location Data (Tangguh dengan Fallback)
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        if (data && data.ip) {
          setVisitorData({
            ip: data.ip,
            city: data.city,
            country: data.country_name,
            connection: { isp: data.org }
          });
        } else {
          throw new Error("Gagal IPAPI");
        }
      })
      .catch(() => {
        // Fallback to ipwho.is
        fetch("https://ipwho.is/")
          .then(res => res.json())
          .then(data => {
            if (data && data.success) {
              setVisitorData(data);
            } else {
              setVisitorData({ ip: "Tersembunyi (AdBlock)", city: "Anonim", country: "Bumi", connection: { isp: "Jaringan Rahasia" } });
            }
          })
          .catch(() => {
             setVisitorData({ ip: "Tersembunyi (AdBlock)", city: "Anonim", country: "Bumi", connection: { isp: "Jaringan Pribadi" } });
          });
      });
  }, []);

  const changeRainIntensity = (intensity: string) => {
    setRainIntensity(intensity);
    localStorage.setItem("docksidz_rain", intensity);
    window.dispatchEvent(new CustomEvent("rain-intensity-changed", { detail: intensity }));
  };

  const changeMascot = (mascotPath: string) => {
    setSelectedMascot(mascotPath);
    window.dispatchEvent(new CustomEvent("mascot-changed", { detail: mascotPath }));
  };

  useEffect(() => {
    const savedMascot = localStorage.getItem("docksidz_mascot");
    if (savedMascot) {
      setSelectedMascot(savedMascot);
    }
    const savedRain = localStorage.getItem("docksidz_rain");
    if (savedRain) {
      setRainIntensity(savedRain);
    }
  }, []);

  return (
    <section className="py-20 bg-background border-t-4 border-border relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary text-white border-4 border-border rounded-xl mb-4 neo-brutalist-shadow-sm rotate-3">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight">Pusat Radar</h2>
          <p className="text-xl text-muted max-w-2xl font-bold">Laporan lalu lintas pengunjung dan sistem deteksi jaringan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full font-sans">
          {/* Card 1: Battery & Visitors */}
          <motion.div whileHover={{ scale: 1.02 }} className="bg-[#2A303C]/70 backdrop-blur-md rounded-xl p-6 flex flex-col items-center justify-center text-center text-[#E2E8F0] shadow-lg border border-white/5 hover:border-white/10 transition-all min-h-[160px]">
            <Battery className="w-8 h-8 mb-4 text-[#9CA3AF]" strokeWidth={1.5} />
            <p className="font-bold text-lg mb-1">Battery: {batteryLevel}</p>
            <p className="text-sm text-[#9CA3AF] mb-1">{visitorData ? visitorData.city : "Mendeteksi..."}</p>
            <p className="text-sm text-[#9CA3AF]">Visitor: {hits !== null ? hits : "..."}</p>
          </motion.div>

          {/* Card 2: Time & Server */}
          <motion.div whileHover={{ scale: 1.02 }} className="bg-[#2A303C]/70 backdrop-blur-md rounded-xl p-6 flex flex-col items-center justify-center text-center text-[#E2E8F0] shadow-lg border border-white/5 hover:border-white/10 transition-all min-h-[160px]">
            <Clock className="w-8 h-8 mb-4 text-[#9CA3AF]" strokeWidth={1.5} />
            <p className="font-bold text-lg mb-1">{mounted ? `${currentTime.toLocaleTimeString('id-ID', { hour12: false })} WIB` : "Memuat Waktu..."}</p>
            <p className="text-sm text-[#9CA3AF] mb-1">{mounted ? `${["Minggu", "Sen", "Sel", "Rabu", "Kamis", "Jumat", "Sabtu"][currentTime.getDay()]}, ${currentTime.getDate()} ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][currentTime.getMonth()]} ${currentTime.getFullYear()}` : "..."}</p>
            <p className="text-sm text-[#9CA3AF]">Zona Waktu: {mounted ? Intl.DateTimeFormat().resolvedOptions().timeZone : "..."}</p>
          </motion.div>

          {/* Card 3: Network & OS */}
          <motion.div whileHover={{ scale: 1.02 }} className="bg-[#2A303C]/70 backdrop-blur-md rounded-xl p-6 flex flex-col items-center justify-center text-center text-[#E2E8F0] shadow-lg border border-white/5 hover:border-white/10 transition-all min-h-[160px]">
            <Server className="w-8 h-8 mb-4 text-[#9CA3AF]" strokeWidth={1.5} />
            <p className="font-bold text-lg mb-1">IP: {visitorData ? visitorData.ip : "Mendeteksi..."}</p>
            <p className="text-sm text-[#9CA3AF] mb-1">OS: {osName}</p>
            <p className="text-sm text-[#9CA3AF]">Browser: {browserName}</p>
          </motion.div>
        </div>

        {/* Rain Intensity Controller */}
        <div className="mt-12 max-w-lg mx-auto bg-[#2A303C]/70 backdrop-blur-md rounded-xl p-4 border border-white/5 flex flex-col items-center shadow-lg">
          <div className="flex items-center gap-2 mb-3 text-[#E2E8F0] font-bold">
            <CloudRain className="w-5 h-5 text-primary" />
            <span>Kontrol Cuaca: Intensitas Hujan</span>
          </div>
          <div className="flex flex-wrap bg-black/40 rounded-lg p-1 w-full relative">
            <button
              onClick={() => changeRainIntensity("off")}
              className={`flex-1 min-w-[70px] py-2 text-sm font-semibold rounded-md transition-all z-10 ${rainIntensity === "off" ? "bg-red-500 text-white shadow-md" : "text-[#9CA3AF] hover:text-white"}`}
            >
              Mati
            </button>
            <button
              onClick={() => changeRainIntensity("gerimis")}
              className={`flex-1 min-w-[70px] py-2 text-sm font-semibold rounded-md transition-all z-10 ${rainIntensity === "gerimis" ? "bg-primary text-white shadow-md" : "text-[#9CA3AF] hover:text-white"}`}
            >
              Gerimis
            </button>
            <button
              onClick={() => changeRainIntensity("normal")}
              className={`flex-1 min-w-[70px] py-2 text-sm font-semibold rounded-md transition-all z-10 ${rainIntensity === "normal" ? "bg-primary text-white shadow-md" : "text-[#9CA3AF] hover:text-white"}`}
            >
              Normal
            </button>
            <button
              onClick={() => changeRainIntensity("badai")}
              className={`flex-1 min-w-[70px] py-2 text-sm font-semibold rounded-md transition-all z-10 ${rainIntensity === "badai" ? "bg-primary text-white shadow-md" : "text-[#9CA3AF] hover:text-white"}`}
            >
              Badai
            </button>
          </div>
        </div>

        {/* Waifu / Mascot Controller telah dihapus */}

        {/* Papan Coretan Tamu (Spesial UI) */}
        <div className="mt-12 max-w-2xl mx-auto">
          <Link href="/tools/guestbook" className="block outline-none group relative">
            <div className="absolute -inset-1 bg-primary rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="relative bg-surface border-4 border-primary rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 neo-brutalist-shadow hover:shadow-[0_15px_0_#000] transition-all duration-300"
            >
              <div className="w-20 h-20 shrink-0 bg-primary rounded-xl border-4 border-black flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform duration-300 shadow-[4px_4px_0_#000]">
                <StickyNote className="w-10 h-10 text-white" />
              </div>
              <div className="text-center sm:text-left flex-grow">
                <h3 className="text-2xl md:text-3xl font-black mb-2 text-text group-hover:text-primary transition-colors">
                  Papan Coretan Tamu
                </h3>
                <p className="text-muted font-bold text-sm md:text-base">
                  Area khusus pengunjung! Tinggalkan jejak, keluh kesah, atau pesan rahasia di papan interaktif ini. Posisi kertas tersimpan selamanya di browser Anda.
                </p>
              </div>
              <div className="shrink-0 bg-black text-white px-6 py-3 rounded-xl font-black border-2 border-transparent group-hover:border-primary group-hover:bg-primary transition-colors hidden sm:block">
                Tulis Pesan &rarr;
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
}
