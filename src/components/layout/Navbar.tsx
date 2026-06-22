import Link from "next/link";
import { FileCode2 } from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-background border-b-4 border-border z-50 neo-brutalist-shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between relative">
        <div className="flex items-center z-10">
          <div className="bg-surface p-2 rounded-xl border-2 border-border neo-brutalist-shadow-sm">
            <FileCode2 className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          </div>
        </div>
        
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0">
          <span className="text-lg md:text-2xl font-black tracking-tighter text-text">
            DockSidz and Tools
          </span>
        </div>
        
        <div className="flex items-center gap-4 z-10">
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
