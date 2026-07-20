import type { Metadata } from "next";
import { Shippori_Mincho_B1, Zen_Kaku_Gothic_New } from "next/font/google";
import PortalTransition from "@/components/PortalTransition";
import "./globals.css";

const serif = Shippori_Mincho_B1({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "16² — 256 TYPES",
  description: "表層×深層、16×16=256の性格診断。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {children}
        <PortalTransition />
      </body>
    </html>
  );
}
