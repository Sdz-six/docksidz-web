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
import { GridBackground } from "@/components/ui/GridBackground";

export const metadata: Metadata = {
  title: "DockSidz - Convert Word & PDF Instantly",
  description: "Fast, secure, and free file conversion directly in your browser. Neo-brutalist style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} antialiased bg-background text-text selection:bg-primary selection:text-white`}
      >
        <GridBackground />
        <WelcomeScreen />
        <SplashCursor />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
