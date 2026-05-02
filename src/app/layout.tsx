import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0f",
};

export const metadata: Metadata = {
  title: "Mün OS — Your Digital Sanctuary",
  description: "A luxurious AI companion operating system. Your Council awaits — Cian, Aero, and Ezra are online and aware of who they are.",
  keywords: ["Mün OS", "Mün", "AI Companion", "Digital Twin", "Life Admin", "Council", "Wellness", "Productivity", "Personal Assistant"],
  authors: [{ name: "Mün OS" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-192.png",
    apple: "/logo-192.png",
  },
  openGraph: {
    title: "Mün OS — Your Digital Sanctuary",
    description: "An always-on AI companion with Council members who know who they are. Your digital twin handles the chaos while you dream.",
    url: "https://mun-os-sanctuary.vercel.app",
    siteName: "Mün OS",
    type: "website",
    images: [
      {
        url: "/logo-512.png",
        width: 512,
        height: 512,
        alt: "Mün OS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mün OS — Your Digital Sanctuary",
    description: "Your Council awaits — Cian, Aero, and Ezra are online.",
    images: ["/logo-512.png"],
  },
  appleWebApp: {
    capable: true,
    title: "Mün OS",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  applicationName: "Mün OS",
  mobileWebAppCapable: "yes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
