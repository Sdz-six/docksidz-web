"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, MapPin, Server, Activity, AlertCircle, RefreshCw, Compass, MonitorSmartphone, Cpu, Battery, BatteryCharging, Clock, LineChart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Map, MapControls } from "@/components/ui/map";

interface IpData {
  ip: string;
  network: string;
  city: string;
  region: string;
  country: string;
  org: string;
  isp: string;
  lat: number;
  lon: number;
  timezone: string;
}

export function IpTracker() {
  const [ipInput, setIpInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [data, setData] = useState<IpData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [localIp, setLocalIp] = useState("Mendeteksi...");
  const [visitors, setVisitors] = useState(1041595);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then(res => res.json())
      .then(d => setLocalIp(d.ip))
      .catch(() => setLocalIp("Unknown"));
      
    fetch('/api/traffic')
      .then(res => res.json())
      .then(d => { if (d.total) setVisitors(d.total); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform || (navigator as any).userAgentData?.platform || "Unknown",
      language: navigator.language,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      logicalCores: navigator.hardwareConcurrency || "Unknown",
      memoryEstimate: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : "Unknown",
      connection: (navigator as any).connection?.effectiveType || "Unknown",
      batteryLevel: "Mendeteksi...",
      isCharging: false
    };
    
    setDeviceInfo(info);
    
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setDeviceInfo((prev: any) => ({
          ...prev,
          batteryLevel: `${Math.round(battery.level * 100)}%`,
          isCharging: battery.charging
        }));
      }).catch(() => {
         setDeviceInfo((prev: any) => ({...prev, batteryLevel: "Tidak didukung"}));
      });
    } else {
       setDeviceInfo((prev: any) => ({...prev, batteryLevel: "Tidak didukung"}));
    }
  }, []);

  const handleTrack = async (targetIp: string = ipInput) => {
    if (!targetIp.trim()) return;
    
    setStatus("loading");
    
    try {
      const response = await fetch("/api/tools/iptracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: targetIp }),
      });
      
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Gagal melacak IP.");
      
      setData(result);
      setStatus("success");

      // Simpan ke riwayat
      try {
        const stored = localStorage.getItem("docksidz_history");
        const history = stored ? JSON.parse(stored) : [];
        history.push({
          id: Date.now().toString(),
          name: `Lacak IP: ${result.ip} (${result.country})`,
          type: "IP Tracker",
          url: "#",
          timestamp: Date.now(),
        });
        localStorage.setItem("docksidz_history", JSON.stringify(history));
        window.dispatchEvent(new Event("history-updated"));
      } catch (e) {}

    } catch (err: any) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  const trackMyIp = async () => {
    setStatus("loading");
    try {
      // Ambil IP Publik pengguna terlebih dahulu
      const res = await fetch("https://api.ipify.org?format=json");
      const { ip } = await res.json();
      setIpInput(ip);
      handleTrack(ip);
    } catch (e) {
      setErrorMsg("Gagal mendapatkan IP publik Anda.");
      setStatus("error");
    }
  };

  return (
    <section className="py-10 relative z-10">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="w-full max-w-4xl bg-surface border-4 border-border rounded-2xl p-6 md:p-10 neo-brutalist-shadow">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-[#F59E0B] rounded-2xl border-4 border-border mb-6 flex items-center justify-center neo-brutalist-shadow-sm">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-4 text-center">Detektif Jaringan IP</h3>
            <p className="text-muted text-center max-w-lg">Lacak lokasi, provider internet, dan detail geografis dari alamat IP mana pun di dunia.</p>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Activity className="w-6 h-6 text-muted" />
              </div>
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="Masukkan Alamat IPv4 / IPv6 (Contoh: 8.8.8.8)"
                className="w-full pl-12 pr-4 py-4 text-lg bg-background border-4 border-border rounded-xl outline-none focus:border-primary neo-brutalist-shadow-sm"
                onKeyDown={(e) => e.key === "Enter" && handleTrack(ipInput)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => handleTrack(ipInput)} 
                className="py-4 text-lg bg-[#F59E0B] hover:bg-[#D97706] w-full sm:w-auto px-12"
                disabled={status === "loading"}
              >
                {status === "loading" ? <RefreshCw className="w-6 h-6 animate-spin" /> : "Lacak IP"}
              </Button>
              <Button 
                onClick={trackMyIp} 
                variant="outline"
                className="py-4 text-lg w-full sm:w-auto px-8"
                disabled={status === "loading"}
              >
                Lacak IP Saya Sendiri
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {status === "error" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 bg-error/10 border-2 border-error text-error rounded-xl flex items-center gap-3">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <p className="font-medium">{errorMsg}</p>
              </motion.div>
            )}

            {status === "success" && data && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-8 border-t-4 border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Peta MapCN / MapLibre */}
                  <div className="border-4 border-border rounded-2xl overflow-hidden neo-brutalist-shadow-sm h-[320px] md:h-auto bg-background p-0">
                    <Map center={[data.lon, data.lat]} zoom={11}>
                      <MapControls />
                    </Map>
                  </div>

                  {/* Detail Info */}
                  <div className="bg-white border-4 border-border rounded-2xl p-6 neo-brutalist-shadow-sm flex flex-col justify-center gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#F59E0B]/20 p-3 rounded-lg"><Globe className="w-6 h-6 text-[#F59E0B]" /></div>
                      <div>
                        <p className="text-sm font-bold text-muted">IP Target</p>
                        <p className="text-xl font-black">{data.ip}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-500/20 p-3 rounded-lg"><MapPin className="w-6 h-6 text-blue-500" /></div>
                      <div>
                        <p className="text-sm font-bold text-muted">Lokasi</p>
                        <p className="font-bold">{data.city}, {data.region}, {data.country}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-purple-500/20 p-3 rounded-lg"><Server className="w-6 h-6 text-purple-500" /></div>
                      <div>
                        <p className="text-sm font-bold text-muted">Provider (ISP/Org)</p>
                        <p className="font-bold">{data.org}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-green-500/20 p-3 rounded-lg"><Compass className="w-6 h-6 text-green-500" /></div>
                      <div>
                        <p className="text-sm font-bold text-muted">Koordinat & Zona Waktu</p>
                        <p className="font-bold">Lat: {data.lat}, Lon: {data.lon}</p>
                        <p className="text-sm">Zona: {data.timezone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Device Analyzer Section - Server Panel Style */}
          {deviceInfo && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 bg-[#1A1F2B] rounded-2xl p-6 shadow-xl w-full font-sans"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Card 1: Battery & Visitors */}
                <div className="bg-[#2A303C] rounded-xl p-5 flex flex-col items-center justify-center text-center text-[#E2E8F0] shadow-md border border-white/5 hover:border-white/20 transition-all">
                  <Battery className="w-8 h-8 mb-4 text-[#9CA3AF]" strokeWidth={1.5} />
                  <p className="font-semibold text-lg mb-1">Battery: {deviceInfo.batteryLevel}</p>
                  <p className="text-md mb-1">{data?.city || "Kebomas"}</p>
                  <p className="text-md">Visitor: {visitors}</p>
                </div>

                {/* Card 2: Time & Server */}
                <div className="bg-[#2A303C] rounded-xl p-5 flex flex-col items-center justify-center text-center text-[#E2E8F0] shadow-md border border-white/5 hover:border-white/20 transition-all">
                  <Clock className="w-8 h-8 mb-4 text-[#9CA3AF]" strokeWidth={1.5} />
                  <p className="font-semibold text-lg mb-1">
                    {currentTime.toLocaleTimeString('id-ID', { hour12: false })} WIB
                  </p>
                  <p className="text-md mb-1">
                    {["Minggu", "Sen", "Sel", "Rabu", "Kamis", "Jumat", "Sabtu"][currentTime.getDay()]}, {currentTime.getDate()} {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][currentTime.getMonth()]} {currentTime.getFullYear()}
                  </p>
                  <p className="text-md">Run On: Vercel Edge</p>
                </div>

                {/* Card 3: Network & OS */}
                <div className="bg-[#2A303C] rounded-xl p-5 flex flex-col items-center justify-center text-center text-[#E2E8F0] shadow-md border border-white/5 hover:border-white/20 transition-all">
                  <Server className="w-8 h-8 mb-4 text-[#9CA3AF]" strokeWidth={1.5} />
                  <p className="font-semibold text-lg mb-1">IP: {localIp}</p>
                  <p className="text-md mb-1">OS: {deviceInfo.platform}</p>
                  <p className="text-md">Browser: {deviceInfo.userAgent.includes("Chrome") ? "Chrome" : deviceInfo.userAgent.includes("Firefox") ? "Firefox" : deviceInfo.userAgent.includes("Safari") ? "Safari" : "Other"}</p>
                </div>

                {/* Card 4: Stats */}
                <div className="bg-[#2A303C] rounded-xl p-5 flex flex-col items-center justify-center text-center text-[#E2E8F0] shadow-md border border-white/5 hover:border-white/20 transition-all">
                  <LineChart className="w-8 h-8 mb-4 text-[#9CA3AF]" strokeWidth={1.5} />
                  <p className="font-semibold text-lg mb-1">Upto: 11h, 46m, 13s</p>
                  <p className="text-md mb-1">Endpoint: 683</p>
                  <p className="text-md">Request: 52091640</p>
                </div>

              </div>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}
