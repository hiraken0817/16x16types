import SurfaceQuiz from "@/components/SurfaceQuiz";
import { getQuestionsData } from "@/lib/data";

export default function SurfaceQuizPage() {
  const { part1_surface } = getQuestionsData();
  return <SurfaceQuiz questions={part1_surface} />;
}
