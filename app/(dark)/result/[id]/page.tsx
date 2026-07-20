import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import CodeReveal from "@/components/CodeReveal";
import Gauges from "@/components/Gauges";
import { getAllResultIds, getGroup, getQuestionsData, getResultContent, getTypeByCode, getTypesData } from "@/lib/data";

export function generateStaticParams() {
  return getAllResultIds().map((id) => ({ id }));
}

function parseId(id: string) {
  const [surface, deep] = id.split("-");
  return { surface, deep };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { surface, deep } = parseId(id);
  const surfaceType = getTypeByCode(surface);
  const deepType = getTypeByCode(deep);
  if (!surfaceType || !deepType) return {};
  const { naming } = getTypesData();
  const title = naming.title_format
    .replace("{深層.beast}", deepType.beast)
    .replace("{表層.role}", surfaceType.role);
  const content = getResultContent(id);
  return {
    title: `${title} | 16² — 256 TYPES`,
    description: content?.catch ?? `${surfaceType.code} - ${deepType.code}｜${title}`,
  };
}

// 決定的な粒子配置（ビルド時固定、JSなしでCSSアニメーションのみ）
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  left: 8 + ((i * 37) % 84),
  duration: 4 + ((i * 13) % 5),
  delay: (i * 7) % 6,
  size: 2 + (i % 3),
}));

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { surface, deep } = parseId(id);
  const surfaceType = getTypeByCode(surface);
  const deepType = getTypeByCode(deep);
  if (!surfaceType || !deepType) notFound();

  const { naming } = getTypesData();
  const deepGroup = getGroup(deepType.group);
  const content = getResultContent(id);
  const { deep_direction_labels } = getQuestionsData();

  const title = naming.title_format
    .replace("{深層.beast}", deepType.beast)
    .replace("{表層.role}", surfaceType.role);
  const codes = naming.code_format.replace("{表層.code}", surfaceType.code).replace("{深層.code}", deepType.code);

  return (
    <div
      style={
        {
          "--aura": deepGroup.color_dark_rgb,
          "--accent": deepGroup.accent_on_dark,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        } as React.CSSProperties
      }
    >
      <div className="r-eyebrow-slot">
        <p className="eyebrow r-loading">……見えてきた</p>
        <p className="eyebrow r-eyebrow">あなたに宿るもの</p>
      </div>

      <div className="beast-stage">
        <div className="aura" />
        {PARTICLES.map((p, i) => (
          <i
            key={i}
            className="particle"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
        <Image className="beast-img" src={`/${deepType.image}`} alt={deepType.beast} width={400} height={400} priority />
      </div>

      <p className="r-codes">
        <CodeReveal code={codes} startDelay={3650} />
      </p>
      <h1 className="r-title">
        <span className="beast-name">{deepType.beast}</span>宿せし{surfaceType.role}
      </h1>
      <p className="r-deep">
        深層に眠るは {deepType.beast} ─ {deepType.role}の相｜{deepGroup.jp}
      </p>

      {content && (
        <div className="r-catch" style={{ marginTop: 40, maxWidth: 560, textAlign: "left" }}>
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, lineHeight: 2, color: "#e8e6f0" }}>{content.catch}</p>
        </div>
      )}

      {!content && (
        <p className="sub r-catch" style={{ marginTop: 32, maxWidth: 480 }}>
          このタイプの詳しい解説は、ただいま準備中です。
        </p>
      )}

      <Suspense fallback={null}>
        <Gauges dirs={surfaceType.code.split("")} dirLabels={deep_direction_labels} example={content?.gauges_example} />
      </Suspense>

      <div className="r-actions">
        <Link href="/" className="next-btn">
          もう一度ひらく
        </Link>
        <Link href="/beasts" className="next-btn">
          幻獣図鑑へ
        </Link>
      </div>

      <p className="foot">16² — 深層判定は仮ロジック（本設計中）</p>
    </div>
  );
}
