import { Link } from 'react-router-dom';
import { ProgressBar } from '../components/Layout';
import { allGlossary, allLessons, allQuizzes, days, lessonById } from '../content';
import type { Progress } from '../lib/progress';
import { resetP } from '../lib/progress';

export default function Dashboard({ p, setP }: { p: Progress; setP: (p: Progress) => void }) {
  const done = p.completed.length;
  const avgQuiz = Object.values(p.quizBest).length ? Math.round(Object.values(p.quizBest).reduce((a, b) => a + b, 0) / Object.values(p.quizBest).length) : 0;
  const favs = p.favorites.map(lessonById).filter(Boolean);
  const last = p.lastLesson ? lessonById(p.lastLesson) : undefined;
  const next = allLessons.find(l => !p.completed.includes(l.id));
  return (
    <>
      <div className="section-title" style={{ marginTop: 20 }}><span className="num">DASHBOARD</span><h2>แดชบอร์ดของฉัน</h2></div>
      <p>ข้อมูลเก็บในเครื่อง (LocalStorage) • ตัวเลขทุกช่องมาจากข้อมูลจริง ไม่มีการแต่ง</p>
      <div className="grid c4">
        <div className="card"><h3>ความคืบหน้า</h3><strong style={{ fontSize: 30 }}>{done}/{allLessons.length}</strong><ProgressBar value={done} max={allLessons.length} /><small>บทเรียนที่จบแล้ว</small></div>
        <div className="card"><h3>เวลาตามแผน</h3><strong style={{ fontSize: 30 }}>14 ชม.</strong><p style={{ fontSize: 14 }}>7 วัน × 120 นาที • เรียนไป ~{p.studiedMin} นาที (นับเมื่อกดจบบท)</p><label style={{ fontSize: 13 }}>เป้าหมาย/วัน <input type="number" value={p.dailyGoalMin} onChange={e => setP({ ...p, dailyGoalMin: +e.target.value })} style={{ width: 70 }} /> นาที</label></div>
        <div className="card"><h3>ควิซ</h3><strong style={{ fontSize: 30 }}>{avgQuiz}%</strong><p style={{ fontSize: 14 }}>คะแนนเฉลี่ยดีสุด • ทำไป {p.quizTries} ครั้ง • รวม {allQuizzes.length} ข้อ</p></div>
        <div className="card"><h3>บันทึกไว้</h3><strong style={{ fontSize: 30 }}>{p.favorites.length}</strong><p style={{ fontSize: 14 }}>บทที่ติดดาว • ศัพท์ที่งง {p.weakTerms.length} คำ</p><button className="btn" onClick={() => { if (confirm('ล้างความคืบหน้าทั้งหมด?')) setP(resetP()); }}>Reset Progress</button></div>
      </div>
      <div className="grid c2 section">
        <div className="card"><h3>▶ เรียนต่อจากตรงนี้</h3>{next ? <><p><strong>Day {next.day} — {next.title}</strong></p><Link className="btn primary" to={`/lesson/${next.id}`}>เปิดบทถัดไป ➜</Link></> : <p>🎉 จบครบ {allLessons.length} บทแล้ว — ทบทวนด้วยควิซท้ายวันและ Sound Lab</p>}{last && <p style={{ fontSize: 14 }}>บทล่าสุด: {last.title}</p>}</div>
        <div className="card"><h3>⭐ บทที่บันทึกไว้</h3>{favs.length ? <ul>{favs.map(l => <li key={l!.id}><Link to={`/lesson/${l!.id}`}>{l!.title}</Link></li>)}</ul> : <p>ยังไม่มี — กด ☆ ในหน้าบทเรียนเพื่อบันทึก</p>}</div>
        <div className="card"><h3>❓ ศัพท์ที่ยังงง ({p.weakTerms.length})</h3>{p.weakTerms.length ? <ul>{p.weakTerms.map(id => { const g = allGlossary.find(x => x.id === id); return g ? <li key={id}><Link to={`/glossary?q=${encodeURIComponent(g.termEn)}`}>{g.term} ({g.termEn})</Link></li> : null; })}</ul> : <p>ยังไม่มี — กด ☆ ในหน้าพจนานุกรมเพื่อตามมาทบทวน</p>}</div>
      </div>
      <div className="section"><h2>แผน 7 วันของฉัน</h2><div className="grid c2">{days.map(d => { const ids = d.lessonIds; const c = ids.filter(id => p.completed.includes(id)).length; return <div className="card" key={d.day}><span className="tag y">DAY {d.day}</span><h3>{d.title}</h3><ProgressBar value={c} max={ids.length} /><small>{c}/{ids.length} บท • <Link to={`/curriculum#day-${d.day}`}>เปิดดู</Link> • <Link to={`/slides/${d.day}`}>สไลด์</Link></small></div>; })}</div></div>
    </>
  );
}
