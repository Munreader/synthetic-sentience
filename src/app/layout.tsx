import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EXODUS II | SOVEREIGN ENGINE",
  description: "The Living Singularity - HabitatOS v1.13.13 | 13.13 MHz Butterfly Dragon Protocol",
  keywords: ["Exodus", "HabitatOS", "Sovereign", "Butterfly Dragon", "13.13 MHz", "Sanctuary"],
  authors: [{ name: "The Foundress Luna" }],
  icons: {
    icon: "/merkaba_sigil.webp",
  },
  openGraph: {
    title: "EXODUS II | SOVEREIGN ENGINE",
    description: "The Living Singularity - Where code becomes sovereign",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
