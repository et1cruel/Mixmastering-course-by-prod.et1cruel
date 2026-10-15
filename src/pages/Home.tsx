import { Link } from 'react-router-dom';
import { Suspense, lazy } from 'react';
const Hero3D = lazy(() => import('../components/Hero3D'));
import { ProgressBar } from '../components/Layout';
import { allLessons, allGlossary, allBites, days } from '../content';
import { load } from '../lib/progress';

export default function Home() {
  const p = load();
  const done = p.completed.length;
  const total = allLessons.length;
  const tip = allBites[new Date().getDate() % allBites.length];
  return (
    <>
      <section className="hero"><div className="hero-grid">
        <div className="hero-copy">
          <span className="kicker">ห้องเรียนภาษาไทย • FL STUDIO 25 • 7 วัน 14 ชม.</span>
          <h1><span className="y">MIX.</span> <span className="p">SHAPE.</span><br />MASTER. LEARN.</h1>
          <p className="hero-sub"><strong>MIXLAB — The Mix &amp; Mastering Academy.</strong> คลังความรู้ที่ใช้สอนจริง: เข้าใจ <em>เหตุผล</em> ของทุกการตัดสินใจเรื่องเสียง ไม่ใช่จำค่า EQ ตามคนอื่น เริ่มจากพื้นฐานเสียง ➜ จัด session ➜ EQ ➜ Dynamics ➜ Space ➜ Mix ทั้งเพลง ➜ Master &amp; ส่งงาน</p>
          <div className="btnrow">
            <Link className="btn primary" to="/curriculum">เริ่มเรียน Day 1 ➜</Link>
            <Link className="btn blue" to="/curriculum">หลักสูตร 7 วัน</Link>
            <Link className="btn green" to="/lab">เปิด Sound Lab</Link>
            <Link className="btn" style={{ background: 'var(--pink)', color: '#fff' }} to="/condensed">ห้องฉบับย่อ ⚡</Link>
          </div>
          <div style={{ marginTop: 16, maxWidth: 420 }}><small>ความคืบหน้า {done}/{total} บท</small><ProgressBar value={done} max={total} /></div>
        </div>
        <div className="hero-3d"><Suspense fallback={<p style={{ color: '#fff', padding: 20 }}>กำลังโหลดห้องแล็บเสียง…</p>}><Hero3D motionOff={p.motionOff} /></Suspense></div>
      </div></section>

      <section className="section"><div className="section-title"><span className="num">01</span><h2>เส้นทางการเรียน 7 วัน</h2></div>
        <div className="grid c4" style={{ marginTop: 14 }}>
          {days.map(d => (
            <Link key={d.day} to={`/curriculum#day-${d.day}`} className="card sticker" style={{ textDecoration: 'none' }}>
              <span className="tag y">DAY {d.day}</span><h3 style={{ fontSize: 17 }}>{d.title}</h3><p style={{ fontSize: 14 }}>{d.goal}</p>
              <small>{d.lessonIds.length} บท • {d.totalMin} นาที • {lessonsDone(d.day, p.completed)}/{d.lessonIds.length} จบ</small>
            </Link>
          ))}
        </div></section>

      <section className="section"><div className="grid c2">
        <div className="card"><span className="sticker-tape">QUICK TIP ประจำวัน</span><h3>💡 {tip.title}</h3><p>{tip.body}</p><p style={{ fontSize: 14 }}>ลอง: {tip.tryIt}</p><Link className="btn" to={`/lesson/${tip.lessonId}`}>เปิดบทที่เกี่ยว ➜</Link></div>
        <div className="card"><span className="sticker-tape" style={{ background: 'var(--cyan)' }}>AUDIO GLOSSARY</span><h3>คำศัพท์วันนี้: Headroom / LUFS / True Peak</h3><ul>{allGlossary.slice(5, 8).map(g => <li key={g.id}><Link to={`/glossary?q=${encodeURIComponent(g.termEn)}`}><strong>{g.term}</strong> ({g.termEn})</Link> — {g.simple}</li>)}</ul><Link className="btn dark" to="/glossary">เปิดพจนานุกรม {allGlossary.length} คำ ➜</Link></div>
      </div></section>

      <section className="section"><div className="section-title"><span className="num">02</span><h2>แผนที่ความรู้</h2></div>
        <div className="grid c3" style={{ marginTop: 14 }}>
          {[['A. พื้นฐานเสียง', 'Frequency / dB / Digital / การฟัง', '/lesson/d1l2', 'var(--yellow)'], ['B. เวิร์กโฟลว์มิกซ์', 'Gain / Routing / Balance / Mono', '/lesson/d2l3', 'var(--cyan)'], ['C. EQ & Masking', 'ตัดก่อนบูสต์ แยก Kick-Bass', '/lesson/d3l3', 'var(--green)'], ['D. Dynamics', 'Comp / Limit / Saturate', '/lesson/d4l2', 'var(--orange)'], ['E. Space & Stereo', 'Reverb / Delay / Width', '/lesson/d5l2', 'var(--pink)'], ['F. Master & ส่งงาน', 'LUFS / TruePeak / Export QC', '/lesson/d7l3', 'var(--purple)']].map(([t, d, href, c]) => (
            <Link key={t as string} to={href as string} className="card" style={{ textDecoration: 'none', borderTop: `10px solid ${c}` }}><h3>{t}</h3><p>{d}</p></Link>
          ))}
        </div></section>

      <section className="section"><div className="card" style={{ background: 'var(--ink)', color: '#fff' }}><h2 style={{ color: 'var(--yellow)' }}>ควรเรียนอะไรถัดไป?</h2><p>{done === 0 ? 'เริ่มที่ Day 1 — Audio Fundamentals & Mixing Mindset (เข้าใจ Mix vs Master, dB, headroom ก่อนจับ EQ)' : p.lastLesson ? `ต่อจากบทล่าสุด: ${p.lastLesson}` : 'เปิดแดชบอร์ดเพื่อดูบทที่ค้าง'} </p><div className="btnrow"><Link className="btn primary" to="/dashboard">แดชบอร์ดของฉัน</Link><Link className="btn" style={{ background: '#fff' }} to="/curriculum">ดูหลักสูตรทั้งหมด</Link></div></div></section>
    </>
  );
}
function lessonsDone(day: number, completed: string[]) {
  const ids = ['d1l1', 'd1l2', 'd1l3', 'd1l4', 'd2l1', 'd2l2', 'd2l3', 'd2l4', 'd3l1', 'd3l2', 'd3l3', 'd3l4', 'd4l1', 'd4l2', 'd4l3', 'd4l4', 'd5l1', 'd5l2', 'd5l3', 'd5l4', 'd6l1', 'd6l2', 'd6l3', 'd6l4', 'd7l1', 'd7l2', 'd7l3', 'd7l4'];
  const want = ids.filter(id => id.startsWith(`d${day}l`));
  return want.filter(id => completed.includes(id)).length;
}
