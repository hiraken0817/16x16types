"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { scoreSurface, type Answer } from "@/lib/scoring";
import type { SurfaceQuestion } from "@/lib/types";

const CHOICES: { side: Answer["side"]; intensity: Answer["intensity"]; pre: string }[] = [
  { side: "a", intensity: 1, pre: "" },
  { side: "a", intensity: 0.5, pre: "どちらかといえば" },
  { side: "b", intensity: 0.5, pre: "どちらかといえば" },
  { side: "b", intensity: 1, pre: "" },
];

export default function SurfaceQuiz({ questions }: { questions: SurfaceQuestion[] }) {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [swap, setSwap] = useState(false);

  const q = questions[idx];
  const progress = (idx / questions.length) * 100;

  function answer(side: Answer["side"], intensity: Answer["intensity"]) {
    const next = [...answers, { side, intensity }];
    setSwap(true);
    setTimeout(() => {
      setSwap(false);
      if (idx + 1 < questions.length) {
        setAnswers(next);
        setIdx(idx + 1);
      } else {
        const { code } = scoreSurface(questions, next);
        router.push(`/type/${code}`);
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
          第 {idx + 1} 問 ／ {questions.length}
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
