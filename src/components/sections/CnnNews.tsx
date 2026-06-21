"use client";

import { useState, useEffect } from "react";
import { Newspaper, ExternalLink, RefreshCw } from "lucide-react";

interface NewsItem {
  title: string;
  url: string;
}

export function CnnNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cnn-news");
      const data = await res.json();
      if (data.status && data.result) {
        setNews(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const formatTitle = (raw: string) => {
    const parts = raw.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    
    if (parts.length >= 3) {
      return { number: parts[0], title: parts[1], category: parts[2] };
    }
    if (parts.length === 2) {
      return { number: "", title: parts[0], category: parts[1] };
    }
    
    return { number: "", title: raw.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(), category: "Berita" };
  };

  if (!loading && news.length === 0) return null;

  return (
    <section className="py-20 relative z-10 bg-background border-t-4 border-border">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="w-full max-w-5xl bg-surface border-4 border-border rounded-[36px] p-6 md:p-10 neo-brutalist-shadow relative transition-transform hover:-translate-y-1">
          
          <div className="absolute -top-5 -left-5 bg-error text-white font-black px-4 py-1 border-4 border-border rounded-xl transform -rotate-3 z-20 text-sm shadow-[2px_2px_0px_var(--color-border)]">
            UPDATE TERBARU
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 mt-2">
            <h2 className="text-2xl font-black uppercase flex items-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/CNN.svg" alt="CNN Logo" className="h-8 w-auto object-contain bg-white px-2 py-1 rounded border-2 border-border" />
              Berita Terkini
            </h2>
            <button onClick={fetchNews} className="flex items-center gap-2 text-sm font-bold bg-background border-2 border-border px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors neo-brutalist-shadow-sm cursor-pointer">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Segarkan
            </button>
          </div>

          {loading ? (
             <div className="flex justify-center py-10"><RefreshCw className="animate-spin w-8 h-8 text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {news.map((item, idx) => {
                const { number, title, category } = formatTitle(item.title);
                return (
                  <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="block bg-background border-4 border-border p-5 rounded-2xl shadow-[4px_4px_0px_var(--color-border)] hover:-translate-y-2 hover:shadow-[6px_6px_0px_var(--color-border)] transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-black bg-primary text-white px-2 py-1 rounded border-2 border-border shadow-[1px_1px_0px_var(--color-border)]">
                        {category}
                      </span>
                      <ExternalLink className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-3">
                      {number && <span className="text-primary mr-1 font-black">{number}.</span>}
                      {title}
                    </h3>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
