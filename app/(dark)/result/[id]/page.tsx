import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import CodeReveal from "@/components/CodeReveal";
import Gauges from "@/components/Gauges";
import {
  getAllResultIds,
  getBeastDescription,
  getGroup,
  getQuestionsData,
  getResultContent,
  getRoleDescription,
  getTypeByCode,
  getTypesData,
} from "@/lib/data";

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

  const { naming, groups } = getTypesData();
  const surfaceGroup = getGroup(surfaceType.group);
  const deepGroup = getGroup(deepType.group);
  const content = getResultContent(id);
  const { deep_direction_labels } = getQuestionsData();
  const roleDesc = getRoleDescription(surfaceType.code);
  const beastDesc = getBeastDescription(deepType.code);

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
        <div
          className="beast-img"
          role="img"
          aria-label={deepType.beast}
          style={
            {
              "--beast-src": `url(/${deepType.image})`,
              "--surface-tint": surfaceGroup.color_dark_rgb,
            } as React.CSSProperties
          }
        />
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

      <main className="r-main">
        {content && (
          <section className="r-section r-lead-section">
            <p className="r-sec-label">LEAD</p>
            <p className="r-body r-catch-line">{content.catch}</p>
            {content.lead.map((p, i) => (
              <p className="r-body" key={i}>
                {p}
              </p>
            ))}
          </section>
        )}

        {!content && (
          <section className="r-section">
            <p className="sub">このタイプの詳しい解説は、ただいま準備中です。</p>
          </section>
        )}

        <section className="r-section">
          <p className="r-sec-label">TWO LAYERS</p>
          <h2 className="r-h2">ふたつの相</h2>
          <div className="duo">
            <div className="duo-card" style={{ "--card-aura": surfaceGroup.color_dark_rgb } as React.CSSProperties}>
              <h3>{surfaceType.role}</h3>
              <span className="duo-tag">
                表層 ─ {surfaceType.code}｜{groups[surfaceType.group].jp}
              </span>
              <p>{roleDesc}</p>
            </div>
            <div className="duo-card" style={{ "--card-aura": deepGroup.color_dark_rgb } as React.CSSProperties}>
              <h3>{deepType.beast}</h3>
              <span className="duo-tag">
                深層 ─ {deepType.code}｜{deepGroup.jp}
              </span>
              <p>{beastDesc}</p>
            </div>
          </div>
        </section>

        {content && (
          <>
            <section className="r-section">
              <p className="r-sec-label">DYNAMICS</p>
              <h2 className="r-h2">表層と深層の力学</h2>
              {content.dynamics.map((p, i) => (
                <p className="r-body" key={i}>
                  {p}
                </p>
              ))}
            </section>

            <section className="r-section">
              <p className="r-sec-label">LIGHT &amp; SHADOW</p>
              <h2 className="r-h2">強みと、影</h2>
              <div className="pair">
                <div className="pair-card pair-light">
                  <h3>強みの方程式</h3>
                  <p>{content.strength}</p>
                </div>
                <div className="pair-card">
                  <h3>影とつまずき</h3>
                  <p>{content.shadow}</p>
                </div>
                <div className="pair-card">
                  <h3>ストレス下で起きること</h3>
                  <p>{content.stress}</p>
                </div>
              </div>
            </section>
          </>
        )}

        <section className="r-section">
          <p className="r-sec-label">DEPTH READING</p>
          <h2 className="r-h2">深層のよみとき</h2>
          <Suspense fallback={null}>
            <Gauges dirs={surfaceType.code.split("")} dirLabels={deep_direction_labels} example={content?.gauges_example} />
          </Suspense>
        </section>

        {content && (
          <>
            <section className="r-section">
              <p className="r-sec-label">TALE</p>
              <h2 className="r-h2">幻獣の物語</h2>
              <div className="r-tale">
                {content.tale.map((p, i) => (
                  <p className={i === content.tale.length - 1 ? "r-tale-fin" : ""} key={i}>
                    {p}
                  </p>
                ))}
              </div>
            </section>

            <section className="r-section">
              <p className="r-sec-label">FULL EDITION</p>
              <div className="r-locked">
                <div className="r-lock">🔒</div>
                <h3>解説書『{title}』</h3>
                <ul>
                  {content.paid_toc.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="r-locked-note">解説書は準備中です</p>
              </div>
            </section>

            <hr className="r-sep" />

            <section className="r-section r-share-section">
              <p className="r-sec-label" style={{ textAlign: "center" }}>
                SHARE
              </p>
              <p className="r-share-quote">「{content.share}」</p>
            </section>
          </>
        )}
      </main>

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
