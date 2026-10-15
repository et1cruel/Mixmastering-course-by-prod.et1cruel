import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { allGlossary, lessonById } from '../content';
import type { GlossaryTerm } from '../content/types';
import type { Progress } from '../lib/progress';

const CATS: [RegExp, string][] = [
  [/lufs|true peak|dither|inter-sample|master|deliver|normalis|codec|\bwav\b|\bmp3\b|metadata/i, 'mastering'],
  [/masking|gain stag|headroom|rout|bus|send |insert|fader|balance|reference|monitor|session/i, 'mixing'],
  [/compress|limit|saturat|clip|transient|attack|release|ratio|threshold|knee|sidechain|parallel|gate|expander|de-ess|crest|pump/i, 'dynamics'],
  [/\beq\b|filter|high-pass|low-pass|bell|shelf|notch|resonan|subtractive|dynamic eq|mid.side|\bq\b|bandwidth|slope/i, 'EQ'],
  [/reverb|delay|stereo|mono|width|\bpan\b|haas|pre-delay|early|chorus|flang|phaser|diffusion|correlation|polarity/i, 'space & stereo'],
  [/frequency|amplitude|phase|harmonic|peak|rms|decibel|\bdb\b|sample|bit|nyquist|waveform|fundamental|loudness|hertz|spl/i, 'fundamentals'],
];
export function catOf(g: GlossaryTerm): string {
  for (const [re, c] of CATS) if (re.test(g.termEn + ' ' + g.term)) return c;
  return 'fundamentals';
}

export default function Glossary({ p, setP }: { p: Progress; setP: (p: Progress) => void }) {
  const [sp] = useSearchParams();
  const [q, setQ] = useState(sp.get('q') || '');
  const [cat, setCat] = useState('ทุกหมวด');
  const [sel, setSel] = useState<GlossaryTerm | null>(null);
  const cats = useMemo(() => ['ทุกหมวด', ...Array.from(new Set(allGlossary.map(catOf)))], []);
  const list = useMemo(() => allGlossary.filter(g =>
    (cat === 'ทุกหมวด' || catOf(g) === cat) &&
    (!q || (g.term + g.termEn + g.simple + g.reading).toLowerCase().includes(q.toLowerCase()))
  ), [q, cat]);
  return (
    <>
      <div className="section-title" style={{ marginTop: 20 }}>
        <h2 style={{ background: 'var(--paper)', border: 'var(--border-thick)', borderRadius: 14, padding: '6px 22px', boxShadow: 'var(--shadow)' }}>พจนานุกรมเสียง — {allGlossary.length} คำ</h2>
      </div>
      <div className="g-searchrow">
        <input aria-label="ค้นหาคำศัพท์" placeholder="ค้นหา Frequency, LUFS, Compressor..." value={q} onChange={e => setQ(e.target.value)} />
        <select aria-label="กรองตามหมวด" value={cat} onChange={e => setCat(e.target.value)}>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <p style={{ fontSize: 14 }}>{list.length} คำที่ตรง • กดที่การ์ดเพื่อดูคำอธิบายฉบับเต็ม + ตัวอย่าง + บทเรียนที่เกี่ยว</p>
      <div className="g-grid">
        {list.map(g => (
          <button key={g.id} className="g-card" onClick={() => setSel(g)} aria-haspopup="dialog">
            <span className="g-head"><strong>{g.termEn}</strong><span className="g-tag">{catOf(g)}</span></span>
            <span className="g-read">{g.term}{g.reading ? ` • ${g.reading}` : ''}</span>
            <span className="g-def">{g.simple}</span>
          </button>
        ))}
      </div>
      {sel && (
        <div className="modal-back" onClick={() => setSel(null)} role="dialog" aria-modal="true" aria-label={sel.termEn}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <span className="tag y">{sel.termEn}</span> <span className="tag bl">{catOf(sel)}</span>
            <h2 style={{ marginTop: 8 }}>{sel.term} {sel.reading && <small>({sel.reading})</small>}</h2>
            <p><strong>แบบง่าย:</strong> {sel.simple}</p>
            <div className="callout ex"><strong>เชิงเทคนิค:</strong> {sel.technical}</div>
            <div className="callout tip"><strong>ตัวอย่าง:</strong> {sel.example}</div>
            <p style={{ fontSize: 14 }}>บทที่เกี่ยว: {sel.lessonIds.map(id => { const l = lessonById(id); return l ? <Link key={id} to={`/lesson/${id}`}> [{l.title}] </Link> : null; })}</p>
            <div className="btnrow">
              <button className="btn" onClick={() => setP({ ...p, weakTerms: p.weakTerms.includes(sel.id) ? p.weakTerms.filter(x => x !== sel.id) : [...p.weakTerms, sel.id] })}>
                {p.weakTerms.includes(sel.id) ? '★ งงอยู่ — ทบทวนต่อ' : '☆ ยังไม่เข้าใจ'}
              </button>
              <button className="btn primary" onClick={() => setSel(null)} autoFocus>ปิด (กดที่การ์ดก็ได้)</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
