import Link from "next/link";
import { FileCode2 } from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-background border-b-4 border-border z-50 neo-brutalist-shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-surface p-2 rounded-xl border-2 border-border neo-brutalist-shadow-sm">
            <FileCode2 className="w-8 h-8 text-primary" />
          </div>
          <span className="text-2xl font-black tracking-tight text-text">
            DockSidz
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
