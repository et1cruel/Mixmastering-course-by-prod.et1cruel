export interface Progress {
  completed: string[];
  favorites: string[];
  quizBest: Record<string, number>;
  quizTries: number;
  lastLesson: string;
  dailyGoalMin: number;
  studiedMin: number;
  weakTerms: string[];
  teacherMode: boolean;
  teachStart: number;
  motionOff: boolean;
}
const KEY = 'mixlab-progress-v1';
const DEF: Progress = { completed: [], favorites: [], quizBest: {}, quizTries: 0, lastLesson: '', dailyGoalMin: 45, studiedMin: 0, weakTerms: [], teacherMode: false, teachStart: 0, motionOff: false };
export function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEF };
    const p = JSON.parse(raw);
    return { ...DEF, ...p, completed: Array.isArray(p.completed) ? p.completed : [], favorites: Array.isArray(p.favorites) ? p.favorites : [] };
  } catch { return { ...DEF }; }
}
export function save(p: Progress) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* ignore */ } }
export function resetP(): Progress { try { localStorage.removeItem(KEY); } catch { /* ignore */ } return { ...DEF }; }
