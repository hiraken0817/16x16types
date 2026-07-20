import type { Viewport } from "next";

export const viewport: Viewport = {
  colorScheme: "dark",
};

export default function DarkLayout({ children }: { children: React.ReactNode }) {
  return <div className="page page-dark">{children}</div>;
}
