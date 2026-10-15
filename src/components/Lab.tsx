import { useMemo, useState } from 'react';

function Card({ title, children, color }: { title: string; children: React.ReactNode; color?: string }) {
  return <div className="card"><span className="sticker-tape" style={color ? { background: color } : undefined}>SIMULATOR เพื่อการเรียนรู้</span><h3>{title}</h3>{children}</div>;
}
export function EqSim() {
  const [f, setF] = useState(1000); const [g, setG] = useState(4); const [q, setQ] = useState(1); const [type, setType] = useState('bell');
  const path = useMemo(() => {
    let d = 'M0,75 ';
    for (let x = 0; x <= 480; x += 8) {
      const freq = 20 * Math.pow(1000, x / 480); // 20..20k log
      let r = 0;
      if (type === 'bell') { const o = Math.log2(freq / f); r = g / (1 + Math.pow(o * q * 1.8, 2)); }
      else if (type === 'highpass') { const o = Math.log2(f / Math.max(freq, 1)); r = o > 0 ? -24 * Math.min(o, 2) : 0; }
      else if (type === 'lowpass') { const o = Math.log2(Math.max(freq, 1) / f); r = o > 0 ? -24 * Math.min(o, 2) : 0; }
      else if (type === 'highshelf') { r = freq >= f ? g * 0.9 : g * 0.9 / (1 + Math.pow(Math.log2(f / freq), 2)); }
      d += `L${x},${(75 - r * 7).toFixed(1)} `;
    }
    return d;
  }, [f, g, q, type]);
  return <Card title="EQ Curve Simulator"><label>ความถี่ {f} Hz<input type="range" min={40} max={16000} value={f} onChange={e => setF(+e.target.value)} /></label>
    <label>Gain {g} dB<input type="range" min={-12} max={12} value={g} onChange={e => setG(+e.target.value)} /></label>
    <label>Q {q}<input type="range" min={0.3} max={6} step={0.1} value={q} onChange={e => setQ(+e.target.value)} /></label>
    <label>ชนิด <select value={type} onChange={e => setType(e.target.value)}><option value="bell">Bell</option><option value="highpass">High-pass</option><option value="lowpass">Low-pass</option><option value="highshelf">High-shelf</option></select></label>
    <svg viewBox="0 0 480 150" width="100%" height="150" role="img" aria-label="กราฟ EQ จำลอง"><rect width={480} height={150} fill="#111" rx={10} /><line x1={0} y1={75} x2={480} y2={75} stroke="#FFE500" strokeDasharray="6 4" /><path d={path} fill="none" stroke="#FF2E9A" strokeWidth={4} /></svg>
    <p style={{ fontSize: 14 }}>ผล: {type === 'bell' ? `บูสต์/คัต ±${g}dB รอบ ${f}Hz Q${q} — Qแคบ = เจาะจง, Qกว้าง = โทนรวม` : `${type} ที่ ${f}Hz — ตัวเลขนี้เป็นจุดเริ่มต้น ให้ฟังว่าเนื้อเสียงหายไหม`} แล้ว Bypass เทียบแบบ level-match</p>
    <button className="btn" onClick={() => { setF(1000); setG(4); setQ(1); setType('bell'); }}>Reset</button></Card>;
}
export function CompSim() {
  const [thr, setThr] = useState(-18); const [ratio, setRatio] = useState(4); const [mk, setMk] = useState(4); const [inp, setInp] = useState(-10);
  const { gr, out } = useMemo(() => {
    const over = Math.max(0, inp - thr);
    const y = inp - over * (1 - 1 / ratio);
    return { gr: (inp - y), out: y + mk };
  }, [thr, ratio, mk, inp]);
  const path = useMemo(() => {
    let d = '';
    for (let x = -60; x <= 0; x += 2) {
      const over = Math.max(0, x - thr);
      const y = x - over * (1 - 1 / ratio);
      const sx = ((x + 60) / 60) * 440 + 20, sy = 130 - ((y + 60) / 60) * 120;
      d += (d ? 'L' : 'M') + sx.toFixed(0) + ',' + sy.toFixed(0) + ' ';
    }
    return d;
  }, [thr, ratio]);
  return <Card title="Compressor Simulator (จำลอง ไม่ได้ประมวลเสียงจริง)"><label>Threshold {thr} dB<input type="range" min={-48} max={0} value={thr} onChange={e => setThr(+e.target.value)} /></label>
    <label>Ratio {ratio}:1<input type="range" min={1} max={20} value={ratio} onChange={e => setRatio(+e.target.value)} /></label>
    <label>Input {inp} dB<input type="range" min={-48} max={0} value={inp} onChange={e => setInp(+e.target.value)} /></label>
    <label>Makeup {mk} dB<input type="range" min={0} max={12} value={mk} onChange={e => setMk(+e.target.value)} /></label>
    <svg viewBox="0 0 480 150" width="100%" height="150" role="img" aria-label="กราฟ comp จำลอง"><rect width={480} height={150} fill="#FFFBF0" stroke="#111" strokeWidth={3} rx={10} /><path d={path} fill="none" stroke="#2447FF" strokeWidth={4} /></svg>
    <p style={{ fontSize: 14 }}>Gain Reduction จำลอง: <strong>{gr.toFixed(1)} dB</strong> • Output ≈ <strong>{out.toFixed(1)} dBFS</strong> {out > 0 ? '⚠️ เกิน 0 = clip' : ''} — Attack เร็วคุม transient แต่ระวังแบน, Release สั้นระวัง pumping</p></Card>;
}
export function GainCalc() {
  const [peak, setPeak] = useState(-8); const [adj, setAdj] = useState(-4);
  const out = peak + adj;
  return <Card title="Gain Staging Calculator"><label>Peak ขาเข้า (dBFS)<input type="number" value={peak} onChange={e => setPeak(+e.target.value)} /></label>
    <label>ปรับ Gain (dB)<input type="number" value={adj} onChange={e => setAdj(+e.target.value)} /></label>
    <p>Peak ขาออก = <strong>{out.toFixed(1)} dBFS</strong> • Headroom เหลือ <strong>{(-out).toFixed(1)} dB</strong> {out > 0 ? '⚠️ CLIP — ลด gain หรือแก้ที่ source' : out > -3 ? 'ตึงไปสำหรับมิกซ์ — เผื่อที่ให้ master' : '✅ ปลอดภัย'} </p>
    <p style={{ fontSize: 13 }}>หมายเหตุ: การลด gain ไม่ได้ลด dynamic range ของไฟล์เสมอไป — มันแค่เลื่อนระดับทั้งก้อน ความดังที่หูรู้สึกขึ้นกับค่าเฉลี่ย (RMS/LUFS) ไม่ใช่ peak อย่างเดียว</p></Card>;
}
export function DbCalc() {
  const [db, setDb] = useState(6);
  const gain = Math.pow(10, db / 20);
  return <Card title="dB ➜ Gain Calculator"><label>dB<input type="range" min={-24} max={24} value={db} onChange={e => setDb(+e.target.value)} /> {db} dB</label>
    <p>อัตราขยายแรงดัน = <strong>{gain.toFixed(3)}×</strong> {db === 6 ? '(+6dB ≈ ดังขึ้น ~2 เท่าทางแรงดัน แต่หูรู้สึกว่าไม่ได้ดัง 2 เท่า)' : ''}</p>
    <p style={{ fontSize: 13 }}>-6dB ≈ ครึ่งหนึ่ง • +20dB = 10เท่า • dBFS วัดพีกริจิตอล (0 = สูงสุด), LUFS วัดความดังเฉลี่ยที่หูรู้สึก</p></Card>;
}
export function StereoDemo() {
  const [w, setW] = useState(100);
  const s = w / 100;
  return <Card title="Stereo Width + Mono Check (จำลอง)"><label>Width {w}%<input type="range" min={0} max={200} value={w} onChange={e => setW(+e.target.value)} /></label>
    <svg viewBox="0 0 480 120" width="100%" height="120" role="img" aria-label="stereo"><rect width={480} height={120} fill="#111" rx={10} />
      <rect x={60} y={20 + (1 - Math.min(s, 1)) * 20} width={40} height={80} fill="#3EE6FF" stroke="#fff" /><rect x={380} y={20 + (1 - Math.min(s, 1)) * 20} width={40} height={80} fill="#FF2E9A" stroke="#fff" />
      <rect x={220} y={50 - s * 10} width={40} height={20 + s * 20} fill="#B6FF2E" stroke="#fff" /><text x={240} y={110} fill="#fff" fontSize={12} textAnchor="middle">MID / SIDE จำลอง</text></svg>
    <p style={{ fontSize: 14 }}>{w === 0 ? 'Mono: ถ้าเบสหาย/เสียงบาง = phase หักล้าง — เช็ก polarity และการเลื่อนเวลา' : w <= 120 ? 'กว้างกำลังดี — เช็ก mono ทุกครั้งก่อนส่ง' : 'กว้างเกิน เสี่ยง mono แล้วกลวง + ข้างหลุด'} • กฎ Pan Law: ตรงกลางดังกว่าที่มิเตอร์บอก ~3dB เพราะออกลำโพงสองข้าง</p></Card>;
}
export function DigitalLab() {
  const [sr, setSr] = useState(48000); const [bit, setBit] = useState(24);
  return <Card title="Sample Rate + Bit Depth Explorer"><label>Sample Rate <select value={sr} onChange={e => setSr(+e.target.value)}><option value={44100}>44100</option><option value={48000}>48000</option><option value={96000}>96000</option></select></label>
    <label>Bit Depth <select value={bit} onChange={e => setBit(+e.target.value)}><option value={16}>16</option><option value={24}>24</option><option value={32}>32 float</option></select></label>
    <p>Nyquist = <strong>{(sr / 2 / 1000).toFixed(1)} kHz</strong> (ความถี่สูงสุดที่เก็บได้) • ช่วงไดนามิกทฤษฎี ≈ <strong>{bit === 32 ? '≈1528 (float แทบไม่ clip ภายใน)' : `≈${(6.02 * bit).toFixed(0)} dB`}</strong></p>
    <p style={{ fontSize: 13 }}>เริ่มที่ 48kHz/24-bit เผื่อ headroom ตอนมิกซ์ • ลด bit ครั้งสุดท้ายค่อย dither — อย่า dither กลางทางหลายรอบ</p></Card>;
}
export function LoudLab() {
  const [peak, setPeak] = useState(-1.2); const [rms, setRms] = useState(-12);
  const crest = peak - rms;
  return <Card title="Loudness + True Peak (เพื่อเรียนรู้)"><label>Sample Peak (dBTP)<input type="range" min={-6} max={0} step={0.1} value={peak} onChange={e => setPeak(+e.target.value)} /> {peak.toFixed(1)}</label>
    <label>RMS โดยประมาณ (dB)<input type="range" min={-24} max={-4} step={0.5} value={rms} onChange={e => setRms(+e.target.value)} /> {rms.toFixed(1)}</label>
    <p>Crest factor ≈ <strong>{crest.toFixed(1)} dB</strong> {crest < 6 ? '⚠️ แบน/ล้า — master เบียดเกิน' : crest > 12 ? 'ไดนามิกกว้าง — ระวังเบาเมื่อ normalization' : '✅ สมดุล'} • True peak ควร &lt; -1dBTP (จุดเริ่มต้น) เพราะ inter-sample peak สูงกว่าที่มิเตอร์ sample-peak บอก</p>
    <p style={{ fontSize: 13 }}>ไม่มีค่า LUFS เดียวที่ใช้ได้ทุกเพลง — เป้าหมายขึ้นกับปลายทางและแนวเพลง แพลตฟอร์มมี normalization ของตัวเอง</p></Card>;
}
export function FlowLab() {
  const [stage, setStage] = useState(0);
  const steps = ['SOURCE: เสียงต้นฉบับ (sample/synth/อัด) — เลือกเสียงดีตั้งแต่แรก', 'INSERT: EQ ➜ Comp ตามลำดับที่ฟังแล้วดี — น้อยแต่ตรงจุด', 'BUS: รวม Drums/Vox ใส่ glue เบาๆ + เช็ก gain', 'MASTER: ตรวจ headroom/mono/reference — ไม่แก้มิกซ์บน master'];
  return <Card title="Signal Flow Explorer" color="#3EE6FF"><p><strong>ขั้น {stage + 1}/4:</strong> {steps[stage]}</p>
    <div style={{ display: 'flex', gap: 8 }}><button className="btn" disabled={stage === 0} onClick={() => setStage(stage - 1)}>◀ ย้อน</button><button className="btn primary" disabled={stage === 3} onClick={() => setStage(stage + 1)}>ถัดไป ▶</button></div>
    <p style={{ fontSize: 13 }}>Insert = ผ่านทุกเสียงในช่อง • Send = ผสมขนาน (reverb/delay) ปรับ send level แยก</p></Card>;
}

const BANDS = [
  { name: 'Sub', range: '20–60Hz', color: '#111111', ink: '#ffffff', char: 'ความสั่น แรงอัดอก — รู้สึกมากกว่าฟัง', ex: 'Kick, 808, Sub Bass', tip: 'ห้องเล็กและหูฟังถูกๆ ให้เสียงย่านนี้ไม่ตรง อย่าบูสต์มั่ว — เริ่มจาก HPF ตัดส่วนเกินแล้วฟังว่าเนื้อหายไหม', bars: [55, 80, 95, 70, 45] },
  { name: 'Bass', range: '60–250Hz', color: '#FF6B00', ink: '#ffffff', char: 'ความอิ่ม เนื้อและน้ำหนักของเบส', ex: 'เนื้อ Kick, เบสไฟฟ้า, ช่วงบนของ 808', tip: 'ย่านที่ Kick กับ Bass ชนกันบ่อยสุด — เลือกให้ตัวหนึ่งเป็นพระเอก แล้วอีกตัวหลบด้วย EQ (จุดเริ่มต้น ไม่ใช่กฎตายตัว)', bars: [30, 55, 68, 50, 22] },
  { name: 'Low-Mid', range: '250–500Hz', color: '#FFE500', ink: '#111111', char: 'ความหนา — มากไป = ขุ่น กล่องกระดาษ', ex: 'เนื้อ Snare, อกเสียงร้อง, กีตาร์โปร่ง', tip: 'มิกซ์ขุ่นให้ลองคัต 2–4dB แบบ Q กว้างแถว 300–500Hz (จุดเริ่มต้น) แล้ว Bypass เทียบแบบ level-match', bars: [25, 45, 60, 48, 20] },
  { name: 'Mid', range: '500Hz–2kHz', color: '#22C55E', ink: '#111111', char: 'ตัวตนและความชัดของคำ — หูคนไวสุดย่านนี้', ex: 'คำร้องชัด, เสียงเคาะ Snare, เปียโน', tip: 'ดันมากเสียงจะแบนเหมือนโทรศัพท์ ตัดมากเสียงจะกลวง — ปรับทีละน้อยแล้วฟังในบริบททั้งเพลง', bars: [35, 55, 62, 52, 30] },
  { name: 'High-Mid', range: '2–6kHz', color: '#2447FF', ink: '#ffffff', char: 'ความพุ่ง กัด และ attack', ex: 'ปลายคำร้อง, ปิ๊กกีตาร์, ความคมของ Snare', tip: 'ย่านบาดหู — ถ้าแสบให้หา resonance แหลมแล้วคัตแคบๆ ระวังเสียง S (sibilance) ช่วง 4–8kHz', bars: [22, 40, 58, 45, 25] },
  { name: 'Presence', range: '6–10kHz', color: '#FF2E9A', ink: '#ffffff', char: 'ความใส ลมหายใจ และรายละเอียด', ex: 'Air ของเสียงร้อง, ฉาบ, เสียงนิ้วบนสาย', tip: 'เพิ่มแล้วรู้สึกโปร่งขึ้นทันที แต่เพิ่มเกินจะเกิดเสียง S แหลม (sibilance) — ใช้ shelf กว้างๆ + de-ess คุมเสียง S', bars: [15, 30, 48, 40, 20] },
  { name: 'Brilliance', range: '10–20kHz', color: '#ffffff', ink: '#111111', char: 'ประกาย air — เปิด/ปิดแทบไม่รู้ แต่ขาดแล้วทึบ', ex: 'ปลายฉาบ, air band ของมาสเตอร์', tip: 'บูสต์ shelf กว้างๆ 1–2dB ก็พอ (จุดเริ่มต้น) ระวัง hiss/noise จากไมค์และปลั๊กอิน saturate', bars: [12, 25, 42, 38, 15] },
];

export function FrequencyExplorer() {
  const [sel, setSel] = useState(0);
  const b = BANDS[sel];
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Frequency Explorer — คลิกย่านความถี่</h3>
      <div className="band-grid" role="tablist" aria-label="ย่านความถี่">
        {BANDS.map((x, i) => (
          <button key={x.name} role="tab" aria-selected={i === sel} onClick={() => setSel(i)} className={'band-btn' + (i === sel ? ' active' : '')} style={{ background: x.color, color: x.ink }}>
            <strong>{x.name}</strong><small>{x.range}</small>
          </button>
        ))}
      </div>
      <div className="band-detail">
        <h3>{b.name} — {b.range}</h3>
        <p><strong>ลักษณะ:</strong> {b.char}</p>
        <p><strong>ตัวอย่าง:</strong> {b.ex}</p>
        <div className="band-warn"><strong>คำแนะนำ:</strong> {b.tip}</div>
      </div>
      <svg viewBox="0 0 700 90" width="100%" height="90" role="img" aria-label="แผนภาพสเปกตรัมจำลองของแต่ละย่าน">
        <rect width="700" height="90" fill="#111" rx="10" />
        {BANDS.map((x, i) => (
          <g key={x.name}>
            {x.bars.map((h, j) => (
              <rect key={j} x={12 + i * 100 + j * 17} y={78 - h} width="12" height={h} rx="2" fill={i === sel ? x.color === '#111111' ? '#FFE500' : x.color : '#555'} stroke={i === sel ? '#fff' : 'none'} strokeWidth={i === sel ? 1.5 : 0} />
            ))}
          </g>
        ))}
      </svg>
      <p style={{ fontSize: 13 }}>⚠️ ตัวเลขย่านเป็นไกด์ ไม่ใช่เส้นตาย — ลักษณะเสียงต่างกันตามแหล่งกำเนิดและบริบท อย่าจำเป็นสูตรตายตัว ให้ใช้หูตัดสิน</p>
    </div>
  );
}
