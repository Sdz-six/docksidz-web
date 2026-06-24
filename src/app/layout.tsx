import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

import { WelcomeScreen } from "@/components/ui/WelcomeScreen";
import { SplashCursor } from "@/components/ui/SplashCursor";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { FastRain } from "@/components/ui/FastRain";
import { Mascot } from "@/components/ui/Mascot";
import { NeoRadio } from "@/components/ui/NeoRadio";
import { ChaosMode } from "@/components/ui/ChaosMode";

export const metadata: Metadata = {
  title: "DockSidz and Tools - Anti Ribet Club",
  description: "Koleksi utilitas super lengkap buat ngebantu harimu. Konversi PDF, unduh video, AI, sampai cari resep masakan ada di sini! Didesain pake Neo-Brutalism.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="monochrome">
      <body
        className={`${spaceGrotesk.variable} antialiased bg-background text-text selection:bg-primary selection:text-white`}
      >
        <FastRain />
        <WelcomeScreen />
        <SplashCursor />
        <CustomCursor />
        <Mascot />
        <NeoRadio />
        <ChaosMode />
        {children}
      </body>
    </html>
  );
}
