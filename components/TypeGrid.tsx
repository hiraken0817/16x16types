import Link from "next/link";
import type { TypeEntry } from "@/lib/types";

export default function TypeGrid({ types }: { types: TypeEntry[] }) {
  return (
    <div className="type-grid">
      {types.map((t) => (
        <Link key={t.code} href={`/type/${t.code}`} className={`type-cell g-${t.group}`}>
          <b>{t.code}</b>
          <span>{t.role}</span>
        </Link>
      ))}
    </div>
  );
}
