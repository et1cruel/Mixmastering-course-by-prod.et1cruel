import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { allQuizzes } from '../content';
import { ProgressBar } from '../components/Layout';
import type { QuizQ } from '../content/types';

const typeLabel = (t: string) => (t === 'tf' ? 'ถูก / ผิด' : t === 'scenario' ? 'วิเคราะห์สถานการณ์' : 'multiple-choice');

function QCard({ q, n, onCheck }: { q: QuizQ; n: number; onCheck: (id: string, ok: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const ok = checked && picked === q.answer;
  return (
    <div className="qcard">
      <div className="qcard-top"><span className="qtoggle" aria-hidden="true" /><span className="qtype">{typeLabel(q.type)}</span><span className="tag y">DAY {q.day}</span></div>
      <p className="qtext"><strong>{n}. {q.q}</strong></p>
      <div className="qchoices">
        {q.choices.map((c, i) => {
          const cls = !checked ? (picked === i ? 'qc picked' : 'qc') : i === q.answer ? 'qc correct' : picked === i ? 'qc wrong' : 'qc dim';
          return <button key={i} className={cls} disabled={checked} onClick={() => setPicked(i)}>{c}</button>;
        })}
      </div>
      {!checked ? (
        <button className="btn qcheck" disabled={picked === null} onClick={() => { setChecked(true); onCheck(q.id, picked === q.answer); }}>ตรวจคำตอบ</button>
      ) : (
        <div className="explain"><strong>{ok ? '✅ ถูกต้อง — ' : '❌ ยังไม่ใช่ — '}</strong>{q.explanation} <Link to={`/lesson/${q.lessonId}`}>ทบทวนบทนี้ ➜</Link></div>
      )}
    </div>
  );
}

export default function QuizHub() {
  const [day, setDay] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const list = useMemo(() => (day === 0 ? allQuizzes : allQuizzes.filter(q => q.day === day)), [day]);
  const answered = Object.keys(results).length;
  const correct = Object.values(results).filter(Boolean).length;
  const pct = answered === 0 ? 0 : Math.round((correct / answered) * 100);
  return (
    <>
      <div className="section-title" style={{ marginTop: 20 }}>
        <h2 style={{ background: 'var(--paper)', border: 'var(--border-thick)', borderRadius: 14, padding: '6px 22px', boxShadow: 'var(--shadow)' }}>แบบทดสอบ — รวม {allQuizzes.length} ข้อ</h2>
      </div>
      <div className="card" style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220 }}><ProgressBar value={correct} max={Math.max(answered, 1)} /></div>
        <strong>{pct}%</strong>
        <span style={{ fontSize: 14 }}>ตอบแล้ว {answered}/{allQuizzes.length} ข้อ • ถูก {correct} ข้อ (นับเฉพาะข้อที่ตรวจแล้ว)</span>
        {answered > 0 && <button className="btn" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => { setResults({}); }}>เริ่มใหม่</button>}
      </div>
      <div className="pills no-print" role="tablist" aria-label="กรองตามวัน">
        {[0, 1, 2, 3, 4, 5, 6, 7].map(d => (
          <button key={d} role="tab" aria-selected={day === d} className={'pill' + (day === d ? ' active' : '')} onClick={() => setDay(d)}>{d === 0 ? 'ทั้งหมด' : `DAY ${d}`}</button>
        ))}
      </div>
      <p style={{ fontSize: 14 }}>แสดง {list.length} ข้อ {day === 0 ? '(ทุกวัน)' : `(Day ${day})`} • ตอบผิดไม่เป็นไร อ่านเฉลยเหตุผลทุกข้อแล้วกดลิงก์ทบทวนบทเรียน</p>
      {list.map((q, i) => (
        <QCard key={q.id} q={q} n={i + 1} onCheck={(id, ok) => setResults(r => (id in r ? r : { ...r, [id]: ok }))} />
      ))}
    </>
  );
}
