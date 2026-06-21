"use client";

import { useEffect, useState } from "react";
import { Activity, Globe, Monitor, MapPin, Cpu, Users } from "lucide-react";
import { motion } from "framer-motion";

export function WebTraffic() {
  const [visitorData, setVisitorData] = useState<any>(null);
  const [browserInfo, setBrowserInfo] = useState("");
  const [hits, setHits] = useState<number | null>(null);

  useEffect(() => {
    // Get Browser Info
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent;
      let browser = "Unknown Browser";
      if (ua.indexOf("Firefox") > -1) browser = "Mozilla Firefox";
      else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
      else if (ua.indexOf("Trident") > -1) browser = "Internet Explorer";
      else if (ua.indexOf("Edge") > -1) browser = "Microsoft Edge";
      else if (ua.indexOf("Chrome") > -1) browser = "Google Chrome";
      else if (ua.indexOf("Safari") > -1) browser = "Apple Safari";
      
      const os = navigator.platform || "Unknown OS";
      setBrowserInfo(`${browser} pada ${os}`);
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Global Traffic Counter */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#1e1e1e] border-4 border-border rounded-2xl p-8 neo-brutalist-shadow flex flex-col justify-center items-center text-center text-green-400 font-mono"
          >
            <Users className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-2xl font-bold mb-6 uppercase tracking-widest">Total Kunjungan</h3>
            <div className="bg-transparent border-4 border-green-400/30 p-4 rounded-xl flex items-center justify-center w-full min-h-[140px]">
              {/* Hit Counter Text */}
              <div className="text-7xl md:text-8xl font-black tracking-tighter">
                {hits !== null ? hits.toLocaleString() : "..."}
              </div>
            </div>
            <p className="text-sm text-green-400/60 font-bold mt-4">DIHITUNG SECARA REAL-TIME DARI SELURUH DUNIA</p>
          </motion.div>

          {/* Local Visitor Details Terminal */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#1e1e1e] border-4 border-border rounded-2xl p-6 md:p-8 neo-brutalist-shadow text-green-400 font-mono flex flex-col justify-between"
          >
            <div className="flex items-center justify-between border-b-2 border-green-400/30 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-green-400" />
                <span className="font-bold tracking-widest uppercase">Deteksi Jaringan Lokal</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-error"></div>
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                <div className="w-3 h-3 rounded-full bg-success"></div>
              </div>
            </div>

            <div className="space-y-4 text-sm md:text-base">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="opacity-60 text-xs uppercase mb-1">Alamat IP Anda</p>
                  <p className="font-bold">{visitorData ? visitorData.ip : "Mendeteksi..."}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="opacity-60 text-xs uppercase mb-1">Lokasi Server</p>
                  <p className="font-bold">{visitorData ? `${visitorData.city}, ${visitorData.country}` : "Menyisir satelit..."}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="opacity-60 text-xs uppercase mb-1">Penyedia Internet (ISP)</p>
                  <p className="font-bold">{visitorData ? visitorData.connection?.isp : "Menganalisis..."}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Cpu className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="opacity-60 text-xs uppercase mb-1">Sistem Perangkat</p>
                  <p className="font-bold">{browserInfo || "Memindai perangkat..."}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
