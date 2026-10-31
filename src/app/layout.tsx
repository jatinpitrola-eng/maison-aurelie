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
  title: "AURA X1 — Hear Everything. Feel Nothing.",
  description:
    "Flagship wireless headphones with adaptive ANC — an interactive 3D WebGL product experience. Scroll to explode the driver, spin the product and choose your finish.",
  keywords: ["AURA X1", "headphones", "3D website", "WebGL", "Three.js", "ANC", "scroll experience"],
  authors: [{ name: "AURA Audio" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "AURA X1 — Hear Everything. Feel Nothing.",
    description: "An interactive 3D scroll experience rendered live in WebGL.",
    siteName: "AURA Audio",
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
