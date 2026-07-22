import fs from "node:fs";
import path from "node:path";
import typesJson from "@/data/types.json";
import questionsJson from "@/data/questions.json";
import beastsJson from "@/content/beasts.json";
import rolesJson from "@/content/roles.json";
import type { GroupEntry, QuestionsData, ResultContent, TypeEntry, TypesData } from "./types";

const typesData = typesJson as TypesData;
const questionsData = questionsJson as QuestionsData;
const beastDescriptions = beastsJson as Record<string, string>;
const roleDescriptions = rolesJson as Record<string, string>;

export function getTypesData(): TypesData {
  return typesData;
}

export function getAllTypes(): TypeEntry[] {
  return typesData.types;
}

export function getTypeByCode(code: string): TypeEntry | undefined {
  return typesData.types.find((t) => t.code === code.toUpperCase());
}

export function getGroup(code: string): GroupEntry {
  return typesData.groups[code as keyof TypesData["groups"]];
}

export function getQuestionsData(): QuestionsData {
  return questionsData;
}

export function getBeastDescription(code: string): string | undefined {
  return beastDescriptions[code.toUpperCase()];
}

export function getRoleDescription(code: string): string | undefined {
  return roleDescriptions[code.toUpperCase()];
}

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getResultContent(id: string): ResultContent | null {
  const file = path.join(CONTENT_DIR, `${id}.json`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  return JSON.parse(raw) as ResultContent;
}

export function hasResultContent(id: string): boolean {
  return fs.existsSync(path.join(CONTENT_DIR, `${id}.json`));
}

export function getAllResultIds(): string[] {
  const ids: string[] = [];
  for (const surface of typesData.types) {
    for (const deep of typesData.types) {
      ids.push(`${surface.code}-${deep.code}`);
    }
  }
  return ids;
}
