"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { GroupEntry, TypeEntry } from "@/lib/types";

interface BeastDexProps {
  types: TypeEntry[];
  groups: Record<string, GroupEntry>;
  descriptions: Record<string, string>;
}

export default function BeastDex({ types, groups, descriptions }: BeastDexProps) {
  const [selected, setSelected] = useState<TypeEntry | null>(null);

  useEffect(() => {
    if (!selected) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <>
      <div className="dex-grid">
        {types.map((t) => {
          const group = groups[t.group];
          return (
            <button
              key={t.code}
              type="button"
              className="dex-card"
              style={{ "--aura": group.color_dark_rgb } as React.CSSProperties}
              onClick={() => setSelected(t)}
            >
              <Image src={`/${t.image}`} alt={t.beast} width={160} height={110} unoptimized />
              <b>{t.beast}</b>
              <span>
                {t.code}｜{t.role}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="dex-modal-backdrop" onClick={() => setSelected(null)}>
          <div
            className="dex-modal"
            style={{ "--aura": groups[selected.group].color_dark_rgb, "--accent": groups[selected.group].accent_on_dark } as React.CSSProperties}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="dex-modal-close" onClick={() => setSelected(null)} aria-label="閉じる">
              ×
            </button>
            <div className="dex-modal-aura" />
            <Image
              className="dex-modal-img"
              src={`/${selected.image}`}
              alt={selected.beast}
              width={220}
              height={220}
              unoptimized
            />
            <p className="dex-modal-code">
              {selected.code}｜{selected.role}
            </p>
            <h2 className="dex-modal-name">{selected.beast}</h2>
            <p className="dex-modal-desc">{descriptions[selected.code] ?? "この幻獣の解説は、ただいま準備中です。"}</p>
          </div>
        </div>
      )}
    </>
  );
}
