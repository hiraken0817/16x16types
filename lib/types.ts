export type GroupCode = "nt" | "nf" | "sj" | "sp";

export interface GroupEntry {
  code: string;
  jp: string;
  jp_note?: string;
  color_dark: string;
  color_dark_rgb: string;
  accent_on_dark: string;
  color_light: string;
}

export interface TypeEntry {
  code: string;
  role: string;
  beast: string;
  group: GroupCode;
  image: string;
}

export interface TypesData {
  groups: Record<GroupCode, GroupEntry>;
  types: TypeEntry[];
  naming: {
    title_format: string;
    code_format: string;
    example: { surface: string; deep: string; title: string; codes: string };
  };
}

export type Axis = "EI" | "SN" | "TF" | "JP";
export type Letter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export interface SurfaceQuestion {
  axis: Axis;
  w: number;
  t: string;
  a: string;
  b: string;
}

export interface DeepQuestion {
  w: number;
  t: string;
  a: string;
  b: string;
}

export interface QuestionsData {
  scoring: {
    choices: string[];
    intensity: { 強: number; 弱: number };
    rule: string;
  };
  part1_surface: SurfaceQuestion[];
  part2_deep: Record<Letter, DeepQuestion[]>;
  deep_direction_labels: Record<Letter, [string, string]>;
  deep_selection_rule: string;
}

export interface GaugeExample {
  winner: string;
  pct: number;
  note: string;
}

export interface ResultContent {
  id: string;
  surface: string;
  deep: string;
  title: string;
  codes: string;
  catch: string;
  lead: string[];
  dynamics: string[];
  strength: string;
  shadow: string;
  stress: string;
  tale: string[];
  share: string;
  gauges_example?: Record<string, GaugeExample>;
  paid_toc: string[];
}
