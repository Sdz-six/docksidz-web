import { PlaygroundScreen } from "@/components/ui/PlaygroundScreen";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Playground | DockSidz",
  description: "Ruang santai dengan kumpulan mainan interaktif untuk menghilangkan penat.",
};

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen bg-background text-text flex flex-col font-sans overflow-x-hidden selection:bg-primary selection:text-surface">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <PlaygroundScreen />
      </div>
      <Footer />
    </main>
  );
}
