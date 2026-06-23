import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ToolsDashboard } from "@/components/sections/ToolsDashboard";
import { History } from "@/components/sections/History";
import { WebTraffic } from "@/components/sections/WebTraffic";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <section className="container mx-auto px-4 mb-8 flex justify-center">
          <Link href="/void" className="inline-block px-4 py-1.5 bg-[#ff003c] hover:bg-[#cc0030] text-white font-bold text-xs tracking-wider border-2 border-border neo-brutalist-shadow-sm hover:neo-brutalist-shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group">
            <span className="flex items-center gap-1">
              <span className="group-hover:animate-pulse">[ ENTER THE VOID ]</span>
            </span>
          </Link>
        </section>
        <ToolsDashboard />
        <History />
        <WebTraffic />
      </main>
      <Footer />
    </div>
  );
}
