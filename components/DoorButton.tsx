"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DoorButton() {
  const router = useRouter();
  const [opening, setOpening] = useState(false);

  function handleClick() {
    if (opening) return;
    setOpening(true);
    setTimeout(() => router.push("/start"), 750);
  }

  return (
    <>
      <div className={`logo${opening ? " absorb" : ""}`} aria-hidden={opening}>
        16<sup>²</sup>
      </div>
      <div className={`fade-rest${opening ? " hidden" : ""}`}>
        <p className="tagline">256 TYPES</p>
        <p className="concept">
          あなたの内には、<em>もう一つの姿</em>が眠っている。
          <br />
          表の顔の、その奥へ。
        </p>
        <button className="door-btn" onClick={handleClick}>
          扉をひらく
        </button>
        <p className="top-note">所要時間 約3分</p>
      </div>
    </>
  );
}
