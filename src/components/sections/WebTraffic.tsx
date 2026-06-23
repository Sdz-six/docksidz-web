"use client";

import { useEffect, useState } from "react";
import { Activity, Globe, Monitor, MapPin, Cpu, Users, Battery, Clock, Server, LineChart } from "lucide-react";
import { motion } from "framer-motion";

export function WebTraffic() {
  const [visitorData, setVisitorData] = useState<any>(null);
  const [browserName, setBrowserName] = useState("");
  const [osName, setOsName] = useState("");
  const [hits, setHits] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState("100%");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
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

    // Fetch Global Hit Counter (Local API)
    fetch("/api/traffic")
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
            <p className="text-sm text-[#9CA3AF]">Status: Online & Secure</p>
          </motion.div>

          {/* Card 3: Network & OS */}
          <motion.div whileHover={{ scale: 1.02 }} className="bg-[#2A303C]/70 backdrop-blur-md rounded-xl p-6 flex flex-col items-center justify-center text-center text-[#E2E8F0] shadow-lg border border-white/5 hover:border-white/10 transition-all min-h-[160px]">
            <Server className="w-8 h-8 mb-4 text-[#9CA3AF]" strokeWidth={1.5} />
            <p className="font-bold text-lg mb-1">IP: {visitorData ? visitorData.ip : "Mendeteksi..."}</p>
            <p className="text-sm text-[#9CA3AF] mb-1">OS: {osName}</p>
            <p className="text-sm text-[#9CA3AF]">Browser: {browserName}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
