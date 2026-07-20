import Link from "next/link";
import TypeGrid from "@/components/TypeGrid";
import { getAllTypes } from "@/lib/data";

export default function StartPage() {
  const types = getAllTypes();
  return (
    <>
      <p className="eyebrow">STEP 1 / 表層</p>
      <h1 className="h1">あなたの表層タイプは？</h1>
      <p className="sub">すでに知っている4文字を選んでください</p>
      <TypeGrid types={types} />
      <Link href="/quiz/surface" className="alt-link">
        わからない／測り直したい → 簡易診断（12問）
      </Link>
    </>
  );
}
