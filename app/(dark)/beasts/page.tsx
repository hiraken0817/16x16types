import Link from "next/link";
import BeastDex from "@/components/BeastDex";
import { getAllTypes, getTypesData } from "@/lib/data";
import beastsJson from "@/content/beasts.json";

export const metadata = {
  title: "幻獣図鑑 | 16² — 256 TYPES",
  description: "十六幻獣、全て。",
};

export default function BeastsPage() {
  const types = getAllTypes();
  const { groups } = getTypesData();

  return (
    <>
      <p className="eyebrow">全十六幻獣</p>
      <h1 className="h1">幻獣図鑑</h1>
      <p className="sub">気になる幻獣をタップすると、解説が読めます</p>
      <BeastDex types={types} groups={groups} descriptions={beastsJson} />
      <Link href="/" className="next-btn dex-back">
        とじる
      </Link>
    </>
  );
}
