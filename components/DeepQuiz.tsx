"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { scoreDeep, type Answer } from "@/lib/scoring";
import type { DeepQuestion, Letter } from "@/lib/types";

const CHOICES: { side: Answer["side"]; intensity: Answer["intensity"]; pre: string }[] = [
  { side: "a", intensity: 1, pre: "" },
  { side: "a", intensity: 0.5, pre: "どちらかといえば" },
  { side: "b", intensity: 0.5, pre: "どちらかといえば" },
  { side: "b", intensity: 1, pre: "" },
];

interface FlatQuestion extends DeepQuestion {
  dir: Letter;
}

export default function DeepQuiz({
  surfaceType,
  questionsByDir,
}: {
  surfaceType: string;
  questionsByDir: Record<Letter, DeepQuestion[]>;
}) {
  const router = useRouter();

  const deepList: FlatQuestion[] = useMemo(() => {
    const dirs = surfaceType.split("") as Letter[];
    return dirs.flatMap((dir) => questionsByDir[dir].map((q) => ({ ...q, dir })));
  }, [surfaceType, questionsByDir]);

  const [idx, setIdx] = useState(0);
  const [answersByDir, setAnswersByDir] = useState<Partial<Record<Letter, Answer[]>>>({});
  const [swap, setSwap] = useState(false);

  const q = deepList[idx];
  const progress = (idx / deepList.length) * 100;

  function answer(side: Answer["side"], intensity: Answer["intensity"]) {
    const dirAnswers = [...(answersByDir[q.dir] ?? []), { side, intensity }];
    const next = { ...answersByDir, [q.dir]: dirAnswers };
    setSwap(true);
    setTimeout(() => {
      setSwap(false);
      if (idx + 1 < deepList.length) {
        setAnswersByDir(next);
        setIdx(idx + 1);
      } else {
        const { code, directions } = scoreDeep(surfaceType, questionsByDir, next);
        const g = directions.map((d) => `${d.dir}:${d.pctB}`).join(",");
        router.push(`/result/${surfaceType}-${code}?g=${encodeURIComponent(g)}`);
      }
    }, 300);
  }

  return (
    <>
      <div className="progress">
        <i style={{ width: `${progress}%` }} />
      </div>
      <div className={`q-wrap${swap ? " swap" : ""}`}>
        <p className="q-count">
          深層 {idx + 1} ／ {deepList.length}
        </p>
        <p className="q-text">{q.t}</p>
        <div className="choices">
          {CHOICES.map((c, i) => (
            <button key={i} className="choice" onClick={() => answer(c.side, c.intensity)}>
              {c.pre && <small>{c.pre}</small>}
              {c.side === "a" ? q.a : q.b}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
