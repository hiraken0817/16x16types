import { notFound } from "next/navigation";
import DeepQuiz from "@/components/DeepQuiz";
import FantasyAura from "@/components/FantasyAura";
import { getAllTypes, getGroup, getQuestionsData, getTypeByCode } from "@/lib/data";

export function generateStaticParams() {
  return getAllTypes().map((t) => ({ surface: t.code }));
}

export default async function DeepQuizPage({ params }: { params: Promise<{ surface: string }> }) {
  const { surface } = await params;
  const type = getTypeByCode(surface);
  if (!type) notFound();

  const group = getGroup(type.group);
  const { part2_deep } = getQuestionsData();

  return (
    <div
      style={
        {
          "--aura": group.color_dark_rgb,
          "--accent": group.accent_on_dark,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        } as React.CSSProperties
      }
    >
      <FantasyAura />
      <div className="deep-quiz-enter" style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <DeepQuiz surfaceType={type.code} questionsByDir={part2_deep} />
      </div>
    </div>
  );
}
