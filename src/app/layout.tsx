import type { Metadata } from "next";
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600.css'
import '@fontsource/cormorant-garamond/400-italic.css'
import '@fontsource/cormorant-garamond/500-italic.css'
import '@fontsource/jost/300.css'
import '@fontsource/jost/400.css'
import '@fontsource/jost/500.css'
import "./globals.css";

export const metadata: Metadata = {
  title: "AURÉLIE — Fine Jewellery · Est. 1962",
  description:
    "A luxury jewellery maison — rare diamonds, Colombian emeralds and hand-crafted 22k gold. Explore our collections of rings, necklaces, earrings and bangles, and book a private viewing.",
  keywords: ["AURÉLIE", "jewellery", "fine jewelry", "diamonds", "emerald", "gold", "bridal jewellery", "luxury"],
  authors: [{ name: "Maison Aurélie" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "AURÉLIE — Fine Jewellery · Est. 1962",
    description: "Rare stones, hand-forged gold. Jewels that outlive time.",
    siteName: "Maison Aurélie",
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
      <body className="antialiased bg-noir text-ivory">{children}</body>
    </html>
  );
}
