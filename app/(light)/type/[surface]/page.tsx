import { notFound } from "next/navigation";
import DeepPortalButton from "@/components/DeepPortalButton";
import { getAllTypes, getGroup, getTypeByCode } from "@/lib/data";

export function generateStaticParams() {
  return getAllTypes().map((t) => ({ surface: t.code }));
}

export default async function TypeConfirmPage({ params }: { params: Promise<{ surface: string }> }) {
  const { surface } = await params;
  const type = getTypeByCode(surface);
  if (!type) notFound();

  const group = getGroup(type.group);

  return (
    <>
      <p className="eyebrow">表層、確定</p>
      <h1 className="h1">あなたの表層は</h1>
      <div className="mid-type">{type.code}</div>
      <p className="mid-nick">{type.role}</p>
      <p className="sub">では――その内側を、見に行こう。</p>
      <DeepPortalButton href={`/quiz/deep/${type.code}`} auraRgb={group.color_dark_rgb} />
    </>
  );
}
