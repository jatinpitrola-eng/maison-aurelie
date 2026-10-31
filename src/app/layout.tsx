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
  title: "AURÉLIE — Haute Joaillerie · Paris",
  description:
    "Rare diamonds and untamed coloured gems, composed by hand in our Paris atelier. An interactive 3D journey through five one-of-a-kind pieces — ring, necklace, earrings, bangle and tiara.",
  keywords: ["AURÉLIE", "haute joaillerie", "high jewelry", "diamonds", "3D website", "WebGL", "Paris"],
  authors: [{ name: "Maison Aurélie" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "AURÉLIE — Haute Joaillerie · Paris",
    description: "Light, set in stone. A 3D scroll journey through the maison's five masterpieces.",
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
      <body
        className="antialiased bg-background text-foreground"
        style={{ background: "transparent" }}
      >{children}</body>
    </html>
  );
}
