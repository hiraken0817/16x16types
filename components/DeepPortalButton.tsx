"use client";

import { useRef } from "react";

export default function DeepPortalButton({ href, auraRgb }: { href: string; auraRgb: string }) {
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleClick() {
    const rect = btnRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    window.dispatchEvent(
      new CustomEvent("portal-navigate", { detail: { href, x, y, auraRgb } })
    );
  }

  return (
    <button ref={btnRef} type="button" className="next-btn" onClick={handleClick}>
      深層へ
    </button>
  );
}
