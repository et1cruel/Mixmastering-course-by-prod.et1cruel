import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { bitesByLesson, lessonById, nextLesson, prevLesson, quizByLesson, slidesByDay, allBites } from '../content';
import { BlockView, Diagram } from '../components/Diagrams';
import { BiteModal, QuizBox } from '../components/Learn';
import type { Bite } from '../content/types';
import type { Progress } from '../lib/progress';

export default function LessonReader({ p, setP }: { p: Progress; setP: (p: Progress) => void }) {
  const { id } = useParams();
  const lesson = id ? lessonById(id) : undefined;
  const [bite, setBite] = useState<Bite | null>(null);
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setBite(null); }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, []);
  const bites = useMemo(() => (lesson ? bitesByLesson(lesson.id) : []), [lesson]);
  const quizzes = useMemo(() => (lesson ? quizByLesson(lesson.id) : []), [lesson]);
  if (!lesson) return <div className="card section"><h2>ไม่พบบทเรียน</h2><Link className="btn" to="/curriculum">กลับหลักสูตร</Link></div>;
  const done = p.completed.includes(lesson.id);
  const fav = p.favorites.includes(lesson.id);
  const nx = nextLesson(lesson.id); const pv = prevLesson(lesson.id);
  const heads = useMemo(() => {
    const label: Record<string, string> = {
      intro: 'เริ่มต้น', p: 'เนื้อหา', list: 'ประเด็นสำคัญ', steps: 'ขั้นตอนลงมือทำ',
      table: 'ตารางเปรียบเทียบ', warning: 'ข้อควรระวัง', example: 'ตัวอย่างเสียง',
      flstudio: 'ทำใน FL Studio', beforeAfter: 'Before / After', mistakes: 'ข้อผิดพลาดที่พบบ่อย',
      myth: 'ความเชื่อผิดๆ', tryit: 'ลองทำเอง', summary: 'สรุปท้ายบท', checklist: 'เช็กลิสต์',
    };
    return lesson.blocks.map((b, i) => ({ i, t: b.heading || label[b.kind] || b.kind })).filter(h => h.t);
  }, [lesson]);
  const jump = (i: number) => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    document.getElementById(`b-${i}`)?.scrollIntoView({ behavior: 'auto', block: 'start' });
  };
  return (
    <div className="section">
      <Link to="/curriculum">◀ หลักสูตร</Link> <span className="tag y">DAY {lesson.day}</span> <span className="tag b">{lesson.level}</span> <span className="tag g">{lesson.durationMin} นาที</span>
      <h1>{lesson.title}</h1><p style={{ color: '#444' }}>{lesson.titleEn}</p>
      <div className="btnrow no-print">
        <button className="btn green" onClick={() => { const c = done ? p.completed.filter(x => x !== lesson.id) : [...p.completed, lesson.id]; setP({ ...p, completed: c, lastLesson: lesson.id, studiedMin: p.studiedMin + (done ? 0 : lesson.durationMin) }); }}>{done ? '✅ เรียนจบแล้ว (กดเพื่อยกเลิก)' : '☐ ทำเครื่องหมายว่าเรียนจบแล้ว'}</button>
        <button className="btn" onClick={() => setP({ ...p, favorites: fav ? p.favorites.filter(x => x !== lesson.id) : [...p.favorites, lesson.id] })}>{fav ? '★ บันทึกแล้ว' : '☆ บันทึกบทเรียน'}</button>
        <Link className="btn dark" to={`/slides/${lesson.day}`}>⛶ สไลด์ Day {lesson.day}</Link>
        {window.print && <button className="btn" onClick={() => window.print()}>🖨 Print / PDF</button>}
      </div>
      <div className="lesson-layout" style={{ marginTop: 16 }}>
        <aside className="toc no-print" aria-label="สารบัญ"><strong>สารบัญ</strong>{heads.slice(0, 24).map((h, k) => <button key={h.i} className="toc-link" onClick={() => jump(h.i)}>{k + 1}. {h.t}</button>)}</aside>
        <article className="lesson-body">
          <h2>🎯 สิ่งที่จะได้รับ</h2><ul>{lesson.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul>
          {lesson.blocks.map((b, i) => (
            <section key={i} id={`b-${i}`}>
              {(b.kind === 'h2' || b.kind === 'intro') && i % 3 === 1 && <Diagram kind={lesson.day <= 2 ? 'routing' : lesson.day === 3 ? 'eq' : lesson.day === 4 ? 'comp' : 'wave'} caption="แผนภาพประกอบบท — ภาพจำลองเพื่อการเรียนรู้" />}
              <BlockView b={b} />
              {b.kind === 'summary' && bites.length > 0 && (
                <div>{bites.map(bt => <button key={bt.id} className="bite-btn" onClick={() => setBite(bt)}>💡 {bt.kind}: {bt.title}</button>)}</div>
              )}
            </section>
          ))}
          {bites.length > 0 && <><h2>💡 เกร็ดความรู้ประจำบท ({bites.length})</h2><div>{bites.map(bt => <button key={bt.id} className="bite-btn" onClick={() => setBite(bt)}>รู้ไหม? {bt.title}</button>)}</div></>}
          {/* also show day bites linked by biteIds */}
          <h2>📝 แบบทดสอบท้ายบท ({quizzes.length} ข้อ)</h2>
          <QuizBox quizzes={quizzes} onScore={(pct) => setP({ ...p, quizBest: { ...p.quizBest, [lesson.id]: Math.max(pct, p.quizBest[lesson.id] || 0) }, quizTries: p.quizTries + 1 })} />
          {p.quizBest[lesson.id] !== undefined && <p>คะแนนดีสุดบทนี้: <strong>{p.quizBest[lesson.id]}%</strong></p>}
          {p.teacherMode && (
            <div className="callout" style={{ background: '#111', color: '#fff' }}><h3 style={{ color: 'var(--yellow)' }}>🎓 Teacher Mode (บันทึกในเครื่อง — ไม่ใช่สิทธิ์พิเศษ)</h3>
              <p><strong>Timing:</strong> {lesson.teacher.timing}</p>
              <p><strong>ถามนักเรียน:</strong></p><ul>{lesson.teacher.questions.map((q, i) => <li key={i}>{q}</li>)}</ul>
              <p><strong>จุดที่มักเข้าใจผิด:</strong></p><ul>{lesson.teacher.misconceptions.map((q, i) => <li key={i}>{q}</li>)}</ul>
              <p><strong>สาธิตใน FL:</strong></p><ul>{lesson.teacher.demo.map((q, i) => <li key={i}>{q}</li>)}</ul>
              <p><strong>เฉลย/แนวทาง:</strong></p><ul>{lesson.teacher.answers.map((q, i) => <li key={i}>{q}</li>)}</ul>
              <p><strong>สำรองถ้าสอนเร็ว/ช้า:</strong> {lesson.teacher.backup}</p>
            </div>
          )}
          <h2>📚 อ่านต่อ & อ้างอิง</h2><ul>{lesson.refs.map((r, i) => <li key={i}>{r}</li>)}</ul>
          <div className="btnrow">
            {pv && <Link className="btn" to={`/lesson/${pv.id}`}>◀ {pv.title}</Link>}
            {nx && <Link className="btn primary" to={`/lesson/${nx.id}`}>{nx.title} ▶</Link>}
          </div>
          <p style={{ fontSize: 13 }}>สไลด์ Day {lesson.day}: <Link to={`/slides/${lesson.day}`}>เปิดห้องสไลด์ ({slidesByDay(lesson.day).length} หน้า)</Link> • เกร็ดทั้งหมดของวัน: {allBites.filter(b => b.day === lesson.day).length} รายการ</p>
        </article>
      </div>
      <BiteModal bite={bite} onClose={() => setBite(null)} />
    </div>
  );
}
