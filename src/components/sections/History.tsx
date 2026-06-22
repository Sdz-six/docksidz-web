"use client";

import { useState, useEffect } from "react";
import { Clock, Download, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface HistoryItem {
  id: string;
  name: string;
  type: string;
  url: string;
  timestamp: number;
}

export function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem("docksidz_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadHistory();
    window.addEventListener("focus", loadHistory);
    window.addEventListener("history-updated", loadHistory);
    return () => {
      window.removeEventListener("focus", loadHistory);
      window.removeEventListener("history-updated", loadHistory);
    };
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("docksidz_history");
    setHistory([]);
  };

  if (history.length === 0) return null;

  return (
    <section className="pb-10 md:pb-20 relative z-10">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="w-full max-w-3xl bg-surface border-4 border-border rounded-2xl sm:rounded-[36px] p-4 sm:p-6 md:p-10 neo-brutalist-shadow-sm">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              Riwayat Aktivitas Alat
            </h2>
            <Button variant="ghost" size="sm" onClick={clearHistory} className="text-muted hover:text-error">
              <Trash2 className="w-4 h-4 mr-2" />
              Bersihkan
            </Button>
          </div>

          <div className="space-y-2 sm:space-y-4">
            {history.sort((a, b) => b.timestamp - a.timestamp).map((item) => (
              <div key={item.id} className="flex flex-row items-center justify-between bg-background p-2 sm:p-4 rounded-lg sm:rounded-xl border-2 border-border gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-4 overflow-hidden w-full">
                  <div className="bg-surface p-1.5 sm:p-3 rounded-md sm:rounded-lg border-2 border-border flex-shrink-0">
                    <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="overflow-hidden min-w-0 flex-grow">
                    <h4 className="font-bold text-xs sm:text-base truncate leading-tight" title={item.name}>{item.name}</h4>
                    <p className="text-[9px] sm:text-xs text-muted truncate mt-0.5">
                      {new Date(item.timestamp).toLocaleDateString("id-ID")} • {item.type}
                    </p>
                  </div>
                </div>
                <a href={item.url} download={item.name} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 cursor-pointer">
                  <Button variant="primary" className="w-8 h-8 sm:h-auto sm:w-auto sm:px-4 p-0 flex items-center justify-center rounded-md sm:rounded-lg">
                    <Download className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline text-sm font-bold">Unduh</span>
                  </Button>
                </a>
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-muted mt-6">
            Tautan file di atas disimpan sementara oleh CloudConvert dan akan kedaluwarsa secara otomatis dalam 24 jam.
          </p>
        </div>
      </div>
    </section>
  );
}
