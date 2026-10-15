export type BlockKind =
  | 'intro' | 'h2' | 'h3' | 'p' | 'list' | 'warning'
  | 'example' | 'flstudio' | 'steps' | 'beforeAfter'
  | 'mistakes' | 'summary' | 'tryit' | 'checklist' | 'table' | 'myth';

export interface ContentBlock {
  kind: BlockKind;
  heading?: string;
  text?: string;
  items?: string[];
  // for table: header + rows encoded in items as "a | b | c"
  tableHead?: string[];
  tableRows?: string[][];
  caption?: string;
  flLabel?: string; // "ภาพจำลองเพื่อการเรียนรู้" etc
}

export interface TeacherNotes {
  objectives: string[];
  timing: string;
  questions: string[];
  misconceptions: string[];
  demo: string[];
  answers: string[];
  checklist: string[];
  backup: string;
}

export interface Lesson {
  id: string;
  day: number;
  slug: string;
  title: string;
  titleEn: string;
  durationMin: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  objectives: string[];
  blocks: ContentBlock[];
  biteIds: string[];
  quizIds: string[];
  teacher: TeacherNotes;
  refs: string[];
}

export interface Slide {
  id: string;
  day: number;
  order: number;
  title: string;
  bullets: string[];
  visual: string;
  visualKind: 'diagram' | 'beforeAfter' | 'routing' | 'eq' | 'comp' | 'wave' | 'checklist' | 'title';
  note: string;
}

export interface QuizQ {
  id: string;
  day: number;
  lessonId: string;
  type: 'mc' | 'tf' | 'scenario';
  q: string;
  choices: string[];
  answer: number; // index
  explanation: string;
}

export interface Bite {
  id: string;
  day: number;
  lessonId: string;
  kind: 'รู้ไหม?' | 'เทคนิคสตูดิโอ' | 'Myth vs Fact' | 'Common Mistakes' | 'Pro Tip' | 'Listen For This' | 'Try It Yourself';
  title: string;
  body: string;
  example: string;
  mistake: string;
  tryIt: string;
  ref?: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  termEn: string;
  reading?: string;
  simple: string;
  technical: string;
  example: string;
  lessonIds: string[];
}

export interface DayMeta {
  day: number;
  title: string;
  titleEn: string;
  goal: string;
  totalMin: number;
  segments: { range: string; topic: string; desc: string }[];
  lessonIds: string[];
}

export interface Reference {
  id: string;
  title: string;
  url: string;
  desc: string;
  usedIn: string;
}
