"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "closing" | "covered" | "fading";

interface PortalDetail {
  href: string;
  x: number;
  y: number;
  auraRgb: string;
}

/**
 * ルートレイアウトに常駐させることで、ページ遷移をまたいでも同じDOM要素が
 * 生き続ける演出用オーバーレイ。「渦が閉じる→遷移→新画面の上でフェードアウト」の
 * 3段階。塗り色は.page-darkの背景と同じ処方にしているため、渦が閉じきった時点で
 * 既に次画面と同じ見た目になっており、そこからは形を変えず透明度だけで消える。
 */
export default function PortalTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [origin, setOrigin] = useState<{ x: number; y: number; auraRgb: string } | null>(null);
  const targetHref = useRef<string | null>(null);
  const coveredAtPathname = useRef<string | null>(null);

  useEffect(() => {
    function onStart(e: Event) {
      const detail = (e as CustomEvent<PortalDetail>).detail;
      targetHref.current = detail.href;
      setOrigin({ x: detail.x, y: detail.y, auraRgb: detail.auraRgb });
      setPhase("closing");
    }
    window.addEventListener("portal-navigate", onStart as EventListener);
    return () => window.removeEventListener("portal-navigate", onStart as EventListener);
  }, []);

  useEffect(() => {
    if (phase !== "closing") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => {
      coveredAtPathname.current = pathname;
      setPhase("covered");
      if (targetHref.current) router.push(targetHref.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, reduceMotion ? 60 : 780);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase !== "covered") return;
    if (pathname === coveredAtPathname.current) return;
    setPhase("fading");
  }, [pathname, phase]);

  useEffect(() => {
    if (phase !== "fading") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setPhase("idle"), reduceMotion ? 30 : 420);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "idle" || !origin) return null;

  return (
    <div
      className="portal-overlay"
      data-phase={phase}
      style={{ "--ox": `${origin.x}px`, "--oy": `${origin.y}px`, "--paura": origin.auraRgb } as React.CSSProperties}
    />
  );
}
