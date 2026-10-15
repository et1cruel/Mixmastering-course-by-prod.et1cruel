import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { condensedDays } from '../content/condensed';

function CompDemo() {
  const [th, setTh] = useState(-18);
  const [ra, setRa] = useState(4);
  const L = -10;
  const out = L > th ? th + (L - th) / ra : L;
  const gr = L - out;
  return (
    <div className="card" style={{ marginTop: 16, background: '#E4F6FF' }}>
      <h3>ลองปรับ Compressor</h3>
      <p style={{ fontSize: 14 }}>สัญญาณเข้าคงที่ที่ -10 dB ลองขยับ threshold และ ratio แล้วดูว่าเสียงถูกบีบไปเท่าไร</p>
      <label>Threshold: <strong>{th}</strong> dB<input type="range" min={-40} max={0} value={th} onChange={e => setTh(+e.target.value)} /></label>
      <label>Ratio: <strong>{ra}</strong>:1<input type="range" min={1} max={10} value={ra} onChange={e => setRa(+e.target.value)} /></label>
      <div className="demo-meter" aria-hidden="true"><i style={{ width: Math.max(0, Math.min(100, ((out + 60) / 60) * 100)) + '%' }} /></div>
      <p className="demo-out">ลดลง {gr.toFixed(1)} dB (ออก {out.toFixed(1)} dB)</p>
    </div>
  );
}

export default function Condensed() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      setPct(max > 0 ? Math.min(100, (scrollY / max) * 100) : 0);
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);
  const jump = (id: string) => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
  };
  return (
    <>
      <div className="readbar" aria-hidden="true"><i style={{ width: pct + '%' }} /></div>
      <div className="section-title" style={{ marginTop: 20 }}>
        <h2 style={{ background: 'var(--paper)', border: 'var(--border-thick)', borderRadius: 14, padding: '6px 22px', boxShadow: 'var(--shadow)' }}>ห้องฉบับย่อ — อ่านจบไวในวันเดียว</h2>
      </div>
      <div className="callout" style={{ maxWidth: 900 }}>
        สรุปคอร์ส 7 วันแบบอ่านง่าย: เป้าหมายรายวัน + ใจความ 4 ข้อ + ข้อสำคัญ 10 ข้อ + บทสั้นแบบพับเปิดได้
        อยากลงลึกให้กด <Link to="/curriculum">หลักสูตรฉบับเต็ม (28 บท)</Link> — เนื้อหาฉบับย่อมาจากไฟล์ของผู้สอนเอง
      </div>
      <nav className="cond-nav no-print" aria-label="ข้ามไปแต่ละวัน">
        {condensedDays.map((_, i) => (
          <button key={i} className="pill" onClick={() => jump(`c${i + 1}`)}>วันที่ {i + 1}</button>
        ))}
      </nav>
      {condensedDays.map((d, i) => (
        <section key={i} id={`c${i + 1}`} className="card section cond-day">
          <span className="tag bl">วันที่ {i + 1}</span> <span className="tag g">{d.h}</span>
          <h2>{d.t}</h2>
          <p><strong>เป้าหมาย:</strong> {d.goal}</p>
          <div className="grid c2">
            {d.items.map(([h, p], k) => <div className="card" key={k}><h4 style={{ margin: '0 0 6px' }}>{h}</h4><p style={{ fontSize: 15, margin: 0 }}>{p}</p></div>)}
          </div>
          <h3>ข้อสำคัญ 10 ข้อ</h3>
          <ol className="cond-kp">{d.kp.map((x, k) => <li key={k}>{x}</li>)}</ol>
          <h3>บทเรียนเชิงลึก (กดเพื่อเปิดอ่าน)</h3>
          {d.deep.map((l, k) => (
            <details className="cond-lesson" key={k} open={k === 0}>
              <summary><strong>{k + 1}. {l.t}</strong></summary>
              <p>{l.p}</p>
              <ol>{l.s.map((x, j) => <li key={j}>{x}</li>)}</ol>
              <p className="cond-ex"><strong>แบบฝึกหัด:</strong> {l.ex}</p>
            </details>
          ))}
          <div className="callout tip" dangerouslySetInnerHTML={{ __html: d.tip }} />
          <p style={{ fontSize: 14 }}>🖥️ {d.fl} — <Link to="/curriculum">เปิดบทเต็มในหลักสูตร 7 วัน ➜</Link></p>
          {d.demo && <CompDemo />}
          {d.svg && <figure className="cond-svg" dangerouslySetInnerHTML={{ __html: d.svg }} />}
        </section>
      ))}
      <div className="card section" style={{ background: 'var(--ink)', color: '#fff' }}>
        <h2 style={{ color: 'var(--yellow)' }}>อ่านจบแล้วไปไหนต่อ?</h2>
        <div className="btnrow">
          <Link className="btn primary" to="/curriculum">ลงลึก: หลักสูตร 28 บท</Link>
          <Link className="btn green" to="/lab">ลองมือ: Sound Lab</Link>
          <Link className="btn" style={{ background: '#fff' }} to="/quiz">ทดสอบ: 56 ข้อ</Link>
        </div>
      </div>
    </>
  );
}
