import type { Axis, DeepQuestion, Letter, SurfaceQuestion } from "./types";

export type Side = "a" | "b";

export interface Answer {
  side: Side;
  intensity: 1 | 0.5;
}

const SURFACE_AXES: Axis[] = ["EI", "SN", "TF", "JP"];

export function scoreSurface(
  questions: SurfaceQuestion[],
  answers: Answer[]
): { code: string; scores: Record<Letter, number> } {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 } as Record<Letter, number>;

  questions.forEach((q, i) => {
    const ans = answers[i];
    if (!ans) return;
    const letter = (ans.side === "a" ? q.axis[0] : q.axis[1]) as Letter;
    scores[letter] += q.w * ans.intensity;
  });

  const code = SURFACE_AXES.map((axis) => {
    const [a, b] = axis.split("") as [Letter, Letter];
    // 同点はA側（先頭文字）を採用
    return scores[a] >= scores[b] ? a : b;
  }).join("");

  return { code, scores };
}

/**
 * 深層判定：CLAUDE.md §5に記載の「仮ロジック」をそのまま移植したもの。
 * 各方向でB側（隠れ/統合）比率が50%以上ならその文字を反転する。
 * E/I・J/Pの「本物/隠れ」は反転解釈が自然だが、S/N・T/Fの「排除型/統合型」は
 * 劣等機能の成熟度であり反転とは概念が異なる、という指摘が未解決のまま残っている。
 * 本設計（写像ルール・閾値・同点処理）が固まるまでの暫定実装。
 */
const FLIP: Record<Letter, Letter> = {
  E: "I", I: "E",
  S: "N", N: "S",
  T: "F", F: "T",
  J: "P", P: "J",
};

export interface DeepDirectionResult {
  dir: Letter;
  pctB: number; // 0-100、B側（隠れ/統合）比率
  resultLetter: Letter;
}

export function scoreDeep(
  surfaceType: string,
  questionsByDir: Record<Letter, DeepQuestion[]>,
  answersByDir: Partial<Record<Letter, Answer[]>>
): { code: string; directions: DeepDirectionResult[] } {
  const directions: DeepDirectionResult[] = [];
  let code = "";

  for (const dir of surfaceType.split("") as Letter[]) {
    const qs = questionsByDir[dir] ?? [];
    const answers = answersByDir[dir] ?? [];
    const max = qs.reduce((sum, q) => sum + q.w, 0);

    let b = 0;
    qs.forEach((q, i) => {
      const ans = answers[i];
      if (!ans || ans.side !== "b") return;
      b += q.w * ans.intensity;
    });

    const ratio = max > 0 ? b / max : 0;
    const resultLetter = ratio >= 0.5 ? FLIP[dir] : dir;

    directions.push({ dir, pctB: Math.round(ratio * 100), resultLetter });
    code += resultLetter;
  }

  return { code, directions };
}
