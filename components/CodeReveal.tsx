"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = ["E", "I", "N", "S", "T", "F", "J", "P"];

/**
 * 表層-深層コードをスロットのように左から確定させていく演出。
 * prefers-reduced-motionでは即座に本来の文字列を表示する。
 */
export default function CodeReveal({ code, startDelay = 0 }: { code: string; startDelay?: number }) {
  const [display, setDisplay] = useState(() => code.replace(/[A-Z]/g, "・"));
  const lockedRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(code);
      return;
    }

    const letterIndexes: number[] = [];
    [...code].forEach((c, i) => {
      if (/[A-Z]/.test(c)) letterIndexes.push(i);
    });

    let tickId: ReturnType<typeof setInterval> | undefined;
    let lockId: ReturnType<typeof setInterval> | undefined;

    const startId = setTimeout(() => {
      tickId = setInterval(() => {
        const chars = code.split("");
        letterIndexes.forEach((idx, order) => {
          if (order >= lockedRef.current) {
            chars[idx] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        });
        setDisplay(chars.join(""));
      }, 55);

      lockId = setInterval(() => {
        lockedRef.current += 1;
        if (lockedRef.current >= letterIndexes.length) {
          if (tickId) clearInterval(tickId);
          if (lockId) clearInterval(lockId);
          setDisplay(code);
        }
      }, 150);
    }, startDelay);

    return () => {
      clearTimeout(startId);
      if (tickId) clearInterval(tickId);
      if (lockId) clearInterval(lockId);
    };
  }, [code, startDelay]);

  return <span className="code-reel">{display}</span>;
}
