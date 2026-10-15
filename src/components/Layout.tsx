import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { load, save } from '../lib/progress';

function TeachButton({ p, setP }: { p: ReturnType<typeof load>; setP: (p: ReturnType<typeof load>) => void }) {
  const teaching = p.teachStart > 0 && p.teachStart <= Date.now();
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!teaching) return;
    const t = setInterval(() => setTick(x => x + 1), 1000);
    return () => clearInterval(t);
  }, [teaching]);
  const secs = teaching ? Math.floor((Date.now() - p.teachStart) / 1000) : 0;
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return (
    <button
      className={'teach-btn' + (teaching ? ' on' : '')}
      aria-pressed={teaching}
      onClick={() => teaching ? setP({ ...p, teacherMode: false, teachStart: 0 }) : setP({ ...p, teacherMode: true, teachStart: Date.now() })}
      title={teaching ? 'กดเพื่อจบการสอน (หยุดนับเวลา + ซ่อนโน้ตผู้สอน)' : 'กดเมื่อเริ่มสอน — เปิดโน้ตผู้สอนและนับเวลา'}
    >
      {teaching ? `● สอนอยู่ ${mm}:${ss}` : 'TEACHER OFF'}
    </button>
  );
}

export function useProgress() {
  const [p, setP] = useState(load());
  useEffect(() => { save(p); }, [p]);
  return { p, setP };
}
export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  return <div className="progressbar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`ความคืบหน้า ${pct}%`}><i style={{ width: pct + '%' }} /></div>;
}
export default function Layout({ children, p, setP }: { children: React.ReactNode; p: ReturnType<typeof load>; setP: (p: ReturnType<typeof load>) => void }) {
  const loc = useLocation();
  const toggleMotion = () => setP({ ...p, motionOff: !p.motionOff });
  return (
    <>
      <nav className="nav" aria-label="เมนูหลัก">
        <div className="nav-inner">
          <Link className="logo" to="/"><span className="logo-badge">MIXLAB</span><span style={{ fontSize: 13, fontWeight: 800 }}>MIX &amp; MASTERING ACADEMY</span></Link>
          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>หน้าแรก</NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>แดชบอร์ด</NavLink>
            <NavLink to="/curriculum" className={({ isActive }) => isActive ? 'active' : ''}>หลักสูตร 7 วัน</NavLink>
            <NavLink to="/lab" className={({ isActive }) => isActive ? 'active' : ''}>Sound Lab</NavLink>
            <NavLink to="/glossary" className={({ isActive }) => isActive ? 'active' : ''}>พจนานุกรม</NavLink>
            <NavLink to="/quiz" className={({ isActive }) => isActive ? 'active' : ''}>แบบทดสอบ</NavLink>
            <NavLink to="/library" className={({ isActive }) => isActive ? 'active' : ''}>คลังความรู้</NavLink>
            <NavLink to="/condensed" className={({ isActive }) => isActive ? 'active' : ''}>ฉบับย่อ</NavLink>
            <NavLink to="/references" className={({ isActive }) => isActive ? 'active' : ''}>อ้างอิง</NavLink>
          </div>
          <div style={{ display: 'flex', gap: 8, marginLeft: 8 }}>
            <TeachButton p={p} setP={setP} />
            <button className="btn" style={{ padding: '4px 10px', fontSize: 13 }} onClick={toggleMotion} title="ปิดอนิเมชัน">{p.motionOff ? '⏸ นิ่ง' : '▶ เคลื่อนไหว'}</button>
          </div>
        </div>
      </nav>
      <div className="marquee no-print" aria-hidden="true"><span>MIX • SHAPE • MASTER • LEARN • FL STUDIO 25 • GAIN STAGING • EQ • COMPRESSION • REVERB • STEREO • LUFS • TRUE PEAK • MIX • SHAPE • MASTER • LEARN • FL STUDIO 25 • GAIN STAGING • EQ • COMPRESSION • REVERB • STEREO • LUFS • TRUE PEAK •&nbsp;</span></div>
      <main className="wrap" key={loc.pathname}>{children}</main>
      <footer><div className="wrap" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <strong>MIXLAB</strong><span>ห้องเรียน Mix &amp; Mastering ภาษาไทย • FL Studio 25 • ภาพ UI ที่วาดใหม่เป็น “ภาพจำลองเพื่อการเรียนรู้” ไม่ใช่ภาพหน้าจอจริงของ Image-Line</span>
        <span style={{ marginLeft: 'auto' }}>ความถูกต้องของความรู้ &gt; คุณภาพการสอน &gt; ใช้งานได้ &gt; สวยงาม</span>
      </div></footer>
    </>
  );
}
