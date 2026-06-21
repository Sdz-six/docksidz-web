"use client";

import { useState, useEffect } from "react";
import { MessageSquareQuote, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface QuoteItem {
  link: string;
  image: string | null;
  character: string;
  anime: string;
  episode: string;
  quote: string;
}

export function AnimeQuotes() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [currentQuote, setCurrentQuote] = useState<QuoteItem | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/anime-quotes");
      const data = await res.json();
      if (data.status && data.result) {
        setQuotes(data.result);
        const randomQuote = data.result[Math.floor(Math.random() * data.result.length)];
        setCurrentQuote(randomQuote);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const nextQuote = () => {
    if (quotes.length > 0) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(randomQuote);
    }
  };

  if (!loading && !currentQuote) return null;

  return (
    <section className="pb-20 relative z-10 bg-background border-t-4 border-border">
      <div className="container mx-auto px-4 flex flex-col items-center pt-10">
        <div className="w-full max-w-3xl bg-surface border-4 border-border rounded-[36px] p-6 md:p-10 neo-brutalist-shadow relative transition-transform hover:-translate-y-1">
          <div className="absolute -top-6 -right-6 bg-primary text-white font-black px-6 py-2 border-4 border-border rounded-xl transform rotate-3 z-20 shadow-[4px_4px_0px_var(--color-border)]">
            QUOTES
          </div>

          <div className="flex items-center gap-4 mb-6">
            <MessageSquareQuote className="w-8 h-8 text-primary" />
            <h2 className="text-xl font-black uppercase">Kutipan Anime Harian</h2>
          </div>

          {loading ? (
             <div className="flex justify-center py-10"><RefreshCw className="animate-spin w-8 h-8 text-primary" /></div>
          ) : (
            <div className="flex flex-col gap-6">
              <blockquote className="text-lg md:text-xl font-bold leading-relaxed border-l-8 border-primary pl-6 py-2 italic text-text">
                "{currentQuote?.quote}"
              </blockquote>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background p-4 rounded-xl border-4 border-border shadow-[2px_2px_0px_var(--color-border)]">
                <div>
                  <p className="font-black text-md text-primary">{currentQuote?.character}</p>
                  <p className="font-bold text-muted text-xs">{currentQuote?.anime} {currentQuote?.episode ? `— ${currentQuote.episode}` : ''}</p>
                </div>
                
                <Button onClick={nextQuote} variant="secondary" className="flex-shrink-0 text-sm py-2 px-4 shadow-none">
                  <RefreshCw className="w-4 h-4 mr-2" /> Acak Lainnya
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
