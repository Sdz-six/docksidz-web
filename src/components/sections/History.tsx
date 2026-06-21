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
              Riwayat Konversi
            </h2>
            <Button variant="ghost" size="sm" onClick={clearHistory} className="text-muted hover:text-error">
              <Trash2 className="w-4 h-4 mr-2" />
              Bersihkan
            </Button>
          </div>

          <div className="space-y-4">
            {history.sort((a, b) => b.timestamp - a.timestamp).map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-background p-3 sm:p-4 rounded-xl border-2 border-border gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <div className="bg-surface p-2 sm:p-3 rounded-lg border-2 border-border flex-shrink-0">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="overflow-hidden min-w-0">
                    <h4 className="font-bold text-sm sm:text-base truncate" title={item.name}>{item.name}</h4>
                    <p className="text-[10px] sm:text-xs text-muted truncate">
                      {new Date(item.timestamp).toLocaleString("id-ID")} • {item.type}
                    </p>
                  </div>
                </div>
                <a href={item.url} download={item.name} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 cursor-pointer">
                  <Button variant="primary" size="sm" className="w-full sm:w-auto">
                    <Download className="w-4 h-4 mr-2" />
                    Unduh
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
