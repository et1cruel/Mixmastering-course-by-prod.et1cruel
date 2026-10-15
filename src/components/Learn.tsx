import { useState } from 'react';
import type { Bite, QuizQ } from '../content/types';

export function BiteModal({ bite, onClose }: { bite: Bite | null; onClose: () => void }) {
  if (!bite) return null;
  return (
    <div className="modal-back" onClick={onClose} role="dialog" aria-modal="true" aria-label={bite.title}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <span className="tag g">{bite.kind}</span> <span className="tag y">Day {bite.day}</span>
        <h2 style={{ marginTop: 8 }}>{bite.title}</h2>
        <p>{bite.body}</p>
        <div className="callout ex"><strong>ตัวอย่างใช้จริง:</strong> {bite.example}</div>
        <div className="callout warn"><strong>ข้อผิดพลาดที่พบบ่อย:</strong> {bite.mistake}</div>
        <div className="callout tip"><strong>ลองด้วยตัวเอง:</strong> {bite.tryIt}</div>
        {bite.ref && <p style={{ fontSize: 13 }}>อ้างอิง: {bite.ref}</p>}
        <button className="btn primary" onClick={onClose} autoFocus>ปิด (Esc)</button>
      </div>
    </div>
  );
}

export function QuizBox({ quizzes, onScore }: { quizzes: QuizQ[]; onScore: (pct: number) => void }) {
  const [ans, setAns] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  if (quizzes.length === 0) return <p>ยังไม่มีแบบทดสอบในส่วนนี้</p>;
  const correct = quizzes.filter(q => ans[q.id] === q.answer).length;
  return (
    <div>
      {quizzes.map((q, i) => (
        <div className="quiz" key={q.id}>
          <strong>ข้อ {i + 1}. {q.q}</strong> <span className="tag b">{q.type === 'tf' ? 'ถูก/ผิด' : q.type === 'scenario' ? 'วิเคราะห์สถานการณ์' : 'ตัวเลือก'}</span>
          <div style={{ marginTop: 8 }}>
            {q.choices.map((c, ci) => {
              const picked = ans[q.id] === ci;
              const cls = done ? (ci === q.answer ? 'choice correct' : picked ? 'choice wrong' : 'choice') : 'choice';
              return <button key={ci} className={cls} disabled={done} onClick={() => setAns({ ...ans, [q.id]: ci })}>{c}</button>;
            })}
          </div>
          {done && <div className="explain"><strong>{ans[q.id] === q.answer ? '✅ ถูกต้อง — ' : '❌ ยังไม่ใช่ — '}</strong>{q.explanation}</div>}
        </div>
      ))}
      {!done ? <button className="btn blue" onClick={() => { setDone(true); onScore(Math.round((correct / quizzes.length) * 100)); }}>ส่งคำตอบ ({Object.keys(ans).length}/{quizzes.length})</button>
        : <div className="callout tip"><strong>ได้ {correct}/{quizzes.length} ข้อ ({Math.round((correct / quizzes.length) * 100)}%)</strong> — อ่านเฉลยเหตุผลทุกข้อก่อนไปต่อ <button className="btn" style={{ marginLeft: 8 }} onClick={() => { setDone(false); setAns({}); }}>ทำใหม่</button></div>}
    </div>
  );
}
