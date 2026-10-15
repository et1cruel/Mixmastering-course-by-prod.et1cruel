import { day1Lessons } from './lessons/day1';
import { day2Lessons } from './lessons/day2';
import { day3Lessons } from './lessons/day3';
import { day4Lessons } from './lessons/day4';
import { day5Lessons } from './lessons/day5';
import { day6Lessons } from './lessons/day6';
import { day7Lessons } from './lessons/day7';
import { days } from './curriculum';
import { allSlides } from './slides';
import { allQuizzes } from './quizzes';
import { allBites } from './tips';
import { allGlossary } from './glossary';
import { allRefs } from './references';
import type { Lesson } from './types';

export const allLessons: Lesson[] = [...day1Lessons, ...day2Lessons, ...day3Lessons, ...day4Lessons, ...day5Lessons, ...day6Lessons, ...day7Lessons];
export { days, allSlides, allQuizzes, allBites, allGlossary, allRefs };
export const lessonById = (id: string) => allLessons.find(l => l.id === id);
export const lessonsByDay = (day: number) => allLessons.filter(l => l.day === day);
export const slidesByDay = (day: number) => allSlides.filter(s => s.day === day).sort((a, b) => a.order - b.order);
export const quizByDay = (day: number) => allQuizzes.filter(q => q.day === day);
export const bitesByDay = (day: number) => allBites.filter(b => b.day === day);
export const bitesByLesson = (lid: string) => allBites.filter(b => b.lessonId === lid);
export const quizByLesson = (lid: string) => allQuizzes.filter(q => q.lessonId === lid);
export function nextLesson(id: string): Lesson | undefined {
  const i = allLessons.findIndex(l => l.id === id);
  return i >= 0 ? allLessons[i + 1] : undefined;
}
export function prevLesson(id: string): Lesson | undefined {
  const i = allLessons.findIndex(l => l.id === id);
  return i > 0 ? allLessons[i - 1] : undefined;
}
// Library categories A-J mapping to lesson search keywords
export const libraryCats: { code: string; title: string; desc: string; keys: string[] }[] = [
  { code: 'A', title: 'Audio Fundamentals', desc: 'คลื่น ความถี่ dB ดิจิทัล ความดัง การฟัง', keys: ['d1l'] },
  { code: 'B', title: 'Mixing Workflow', desc: 'จัด session gain routing balance pan mono reference', keys: ['d2l', 'd6l'] },
  { code: 'C', title: 'EQ', desc: 'parametric dynamic filter masking mid-side', keys: ['d3l'] },
  { code: 'D', title: 'Dynamics', desc: 'compress limit clip saturate gate de-ess sidechain', keys: ['d4l'] },
  { code: 'E', title: 'Space & Stereo', desc: 'reverb delay width mid-side haas modulation depth', keys: ['d5l'] },
  { code: 'F', title: 'Instrument Mixing', desc: 'kick snare bass 808 vocal synth piano guitar', keys: ['d3l3', 'd4l3', 'd6l'] },
  { code: 'G', title: 'Genre Workflow', desc: 'hip-hop trap R&B pop electronic rock ambient lo-fi — แนวทางต่างกันตามเพลง ไม่เหมารวม', keys: ['d6l1'] },
  { code: 'H', title: 'Mastering', desc: 'premaster tonal dynamics loudness export QC', keys: ['d7l'] },
  { code: 'I', title: 'Troubleshooting', desc: 'ขุ่น เบสชน vocal จม แหลมบาด reverb เยอะ mono หาย peak เกิน', keys: ['d3l', 'd4l4', 'd5l4', 'd6l4'] },
  { code: 'J', title: 'Professional Workflow', desc: 'ไฟล์ template versioning backup revision delivery', keys: ['d6l4', 'd7l4'] },
];
