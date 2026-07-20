import type { Viewport } from "next";

export const viewport: Viewport = {
  colorScheme: "light",
};

export default function LightLayout({ children }: { children: React.ReactNode }) {
  return <div className="page page-light">{children}</div>;
}
