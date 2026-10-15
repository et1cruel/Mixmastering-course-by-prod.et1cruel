import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { slidesByDay } from '../content';
import { Diagram } from '../components/Diagrams';
import type { Progress } from '../lib/progress';

export default function SlideRoom({ p }: { p: Progress }) {
  const { day } = useParams();
  const d = Number(day) || 1;
  const slides = slidesByDay(d);
  const [i, setI] = useState(0);
  const [showNote, setShowNote] = useState(true);
  const [fs, setFs] = useState(false);
  const next = useCallback(() => setI(v => Math.min(v + 1, slides.length - 1)), [slides.length]);
  const prev = useCallback(() => setI(v => Math.max(v - 1, 0)), []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'f' || e.key === 'F') setFs(v => !v);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [next, prev]);
  if (!slides.length) return <div className="card"><h2>ยังไม่มีสไลด์วันนี้</h2></div>;
  const s = slides[i];
  return (
    <div className="section" style={fs ? { position: 'fixed', inset: 0, zIndex: 200, background: '#111', padding: 20, overflow: 'auto' } : undefined}>
      <div className="btnrow no-print"><Link className="btn" to="/curriculum">◀ หลักสูตร</Link><button className="btn dark" onClick={() => setFs(!fs)}>{fs ? '⛶ ออกจากเต็มจอ' : '⛶ เต็มจอ (F) — ใช้แชร์หน้าจอสอน'}</button><button className="btn" onClick={() => setShowNote(!showNote)}>{showNote ? 'ซ่อน' : 'แสดง'}โน้ตผู้สอน</button><button className="btn" onClick={() => window.print()}>🖨 Print/PDF</button><span className="tag y">สไลด์ {i + 1}/{slides.length}</span></div>
      <div className="slide-stage" style={{ marginTop: 12 }}>
        <span className="tag y">DAY {d} • {i + 1}/{slides.length}</span>
        <h2>{s.title}</h2>
        <ul className="slide-bullets">{s.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
        <div style={{ background: '#fff', borderRadius: 12, padding: 10, marginTop: 10, maxWidth: 640 }}><Diagram kind={s.visualKind} caption={s.visual} /></div>
        {showNote && <div style={{ marginTop: 12, background: '#222', border: '2px dashed var(--yellow)', borderRadius: 10, padding: 12 }}><strong style={{ color: 'var(--yellow)' }}>🎓 Presenter Notes {p.teacherMode ? '(Teacher Mode ON)' : ''}:</strong><p style={{ fontSize: 15 }}>{s.note}</p></div>}
      </div>
      <div className="slide-nav no-print"><button className="btn" disabled={i === 0} onClick={prev}>◀ ย้อน (←)</button><button className="btn primary" disabled={i === slides.length - 1} onClick={next}>ถัดไป (→/Space) ▶</button>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{slides.map((sl, k) => <button key={sl.id} onClick={() => setI(k)} aria-label={`ไปสไลด์ ${k + 1}`} style={{ width: 30, height: 30, borderRadius: 8, border: '3px solid #111', background: k === i ? 'var(--yellow)' : '#fff', fontWeight: 800, cursor: 'pointer' }}>{k + 1}</button>)}</div></div>
      <p style={{ fontSize: 13 }}>คีย์บอร์ด: ←/→ หรือ Space เปลี่ยนสไลด์ • F เต็มจอ • Esc ออกจากโหมดบันทึก • หนึ่งสไลด์ = หนึ่งแนวคิด</p>
    </div>
  );
}
