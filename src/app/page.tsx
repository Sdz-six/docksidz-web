import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToolsDashboard } from "@/components/sections/ToolsDashboard";
import { History } from "@/components/sections/History";
import { WebTraffic } from "@/components/sections/WebTraffic";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <ToolsDashboard />
        <History />
        <WebTraffic />
      </main>
      <Footer />
    </div>
  );
}
