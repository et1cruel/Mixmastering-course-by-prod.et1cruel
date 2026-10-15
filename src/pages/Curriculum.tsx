import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { days, lessonsByDay, slidesByDay, quizByDay } from '../content';

export default function Curriculum() {
  const loc = useLocation();
  useEffect(() => {
    if (!loc.hash) { window.scrollTo(0, 0); return; }
    // สกรอลล์หลังฟอนต์/หน้าโหลดเสร็จ ไม่งั้นตำแหน่ง Haag ผิดเพราะ layout ขยับ (ยิงซ้ำได้เพราะเป็น instant jump)
    const go = () => document.querySelector(loc.hash)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    let alive = true;
    const safe = () => { if (alive) go(); };
    const t = setTimeout(safe, 1500);
    if (document.fonts?.ready) document.fonts.ready.then(safe);
    window.addEventListener('load', safe);
    return () => { alive = false; clearTimeout(t); window.removeEventListener('load', safe); };
  }, [loc.pathname, loc.hash]);
  return (
    <>
      <div className="section-title" style={{ marginTop: 20 }}><span className="num">7 วัน / 14 ชม.</span><h2>หลักสูตรเข้มข้น</h2></div>
      <p className="prose">วันละ 120 นาที • เน้นเข้าใจ + ลงมือใน FL Studio 25 • ส่วน Advanced เป็นเนื้อหาอ่านต่อหลังคลาส ทุกตัวเลขเป็นจุดเริ่มต้นให้ทดลอง ไม่ใช่สูตรตายตัว</p>
      <div className="callout" style={{ background: '#FFE1F2' }}>⚡ รีบหรืออยากทบทวนไวๆ? เข้า <Link to="/condensed"><strong>ห้องฉบับย่อ</strong></Link> — สรุป 7 วันแบบอ่านจบในวันเดียว แล้วค่อยกลับมาลงลึกทีละบท</div>
      {days.map(d => (
        <section key={d.day} id={`day-${d.day}`} className="card section" style={{ scrollMarginTop: 90 }}>
          <span className="tag bl">DAY {d.day}</span> <span className="tag y">{d.totalMin} นาที</span>
          <h2>{d.title} <small style={{ fontFamily: 'body' }}>({d.titleEn})</small></h2>
          <p><strong>เป้าหมาย:</strong> {d.goal}</p>
          <h3>⏱ แผนแบ่งเวลา</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}><tbody>{d.segments.map((s, i) => <tr key={i}><td style={{ border: '2px solid #111', padding: 6, background: '#FFF3BF', whiteSpace: 'nowrap', fontWeight: 800 }}>{s.range}</td><td style={{ border: '2px solid #111', padding: 6 }}><strong>{s.topic}</strong> — {s.desc}</td></tr>)}</tbody></table>
          <h3>📖 บทเรียน ({lessonsByDay(d.day).length} บท)</h3>
          <div className="grid c2">{lessonsByDay(d.day).map(l => <Link key={l.id} to={`/lesson/${l.id}`} className="card" style={{ textDecoration: 'none' }}><span className="tag g">{l.level}</span><span className="tag b">{l.durationMin} นาที</span><h4 style={{ margin: '6px 0' }}>{l.title}</h4><small>{l.objectives[0]}</small></Link>)}</div>
          <div className="btnrow" style={{ marginTop: 12 }}>
            <Link className="btn primary" to={`/lesson/${d.lessonIds[0]}`}>เริ่ม Day {d.day} ➜</Link>
            <Link className="btn dark" to={`/slides/${d.day}`}>เปิดสไลด์สอน ({slidesByDay(d.day).length} หน้า) ⛶</Link>
            <span className="tag p">ควิซ {quizByDay(d.day).length} ข้อ</span>
          </div>
        </section>
      ))}
    </>
  );
}
