"use client";

import { useSearchParams } from "next/navigation";
import type { GaugeExample } from "@/lib/types";

interface GaugeItem {
  dir: string;
  pct: number;
  labelSelf: string;
  labelOther: string;
  note?: string;
}

export default function Gauges({
  dirs,
  dirLabels,
  example,
}: {
  dirs: string[];
  dirLabels: Record<string, [string, string]>;
  example?: Record<string, GaugeExample>;
}) {
  const searchParams = useSearchParams();
  const g = searchParams.get("g"); // "E:72,S:64,F:62,J:58" 診断直後のみ付与される実測値

  const live: Record<string, number> = {};
  if (g) {
    for (const pair of g.split(",")) {
      const [dir, pct] = pair.split(":");
      if (dir && pct) live[dir] = Number(pct);
    }
  }

  const items: GaugeItem[] = dirs
    .map((dir) => {
      const [labelSelf, labelOther] = dirLabels[dir] ?? [dir, dir];
      if (dir in live) {
        return { dir, pct: live[dir], labelSelf, labelOther };
      }
      const ex = example?.[dir];
      if (ex) {
        // gauges_exampleのwinnerはself/other どちらの側もありうるため、
        // 常にlabelOther（B側）基準のバー比率に正規化する。
        const pctB = ex.winner === labelOther ? ex.pct : 100 - ex.pct;
        return { dir, pct: pctB, labelSelf, labelOther, note: ex.note };
      }
      return null;
    })
    .filter((x): x is GaugeItem => x !== null);

  if (items.length === 0) return null;

  return (
    <div className="gauges">
      {items.map((item) => (
        <div className="gauge" key={item.dir}>
          <label>
            <span>{item.labelSelf}</span>
            <span>
              {item.labelOther} {item.pct}%
            </span>
          </label>
          <div className="bar">
            <i style={{ "--w": `${item.pct}%` } as React.CSSProperties} />
          </div>
        </div>
      ))}
    </div>
  );
}
