import type { ContentBlock } from '../content/types';
// Lightweight SVG diagrams drawn fresh (no FL screenshots). All labeled illustrative.
export function Diagram({ kind, caption }: { kind: string; caption?: string }) {
  const common = { width: '100%', height: 150, role: 'img' as const };
  let body: React.ReactNode = null;
  if (kind === 'routing' || kind === 'signal') body = (
    <g fontSize="11" fontWeight="700" textAnchor="middle">
      {['SOURCE', 'INSERT', 'BUS', 'MASTER'].map((t, i) => (
        <g key={t}>
          <rect x={10 + i * 118} y={45} width={100} height={60} rx={10} fill={['#FFE500', '#3EE6FF', '#B6FF2E', '#FF2E9A'][i]} stroke="#111" strokeWidth={3} />
          <text x={60 + i * 118} y={72}>{t}</text>
          <text x={60 + i * 118} y={90} fontSize={9}>{['Channel', 'EQ/Comp', 'Drum/Vox', 'Limiter'][i]}</text>
          {i < 3 && <text x={118 + i * 118} y={80} fontSize={18}>➜</text>}
        </g>
      ))}
    </g>
  );
  else if (kind === 'eq') body = (
    <g>
      <rect x={0} y={0} width={480} height={150} fill="#111" rx={10} />
      {[30, 60, 90, 120].map(y => <line key={y} x1={0} y1={y} x2={480} y2={y} stroke="#333" />)}
      <line x1={0} y1={75} x2={480} y2={75} stroke="#FFE500" strokeDasharray="6 4" />
      <path d="M0,75 C80,75 120,75 160,40 C200,10 240,110 300,95 C360,80 420,75 480,75" fill="none" stroke="#FF2E9A" strokeWidth={5} />
      <circle cx={160} cy={40} r={7} fill="#B6FF2E" stroke="#111" strokeWidth={3} />
      <text x={12} y={20} fill="#fff" fontSize={12} fontWeight={800}>EQ CURVE (จำลอง)</text>
    </g>
  );
  else if (kind === 'comp') body = (
    <g>
      <rect x={0} y={0} width={480} height={150} fill="#FFFBF0" stroke="#111" strokeWidth={3} rx={10} />
      <line x1={30} y1={130} x2={450} y2={130} stroke="#111" strokeWidth={3} />
      <line x1={30} y1={130} x2={30} y2={10} stroke="#111" strokeWidth={3} />
      <path d="M30,130 L220,40 L450,15" fill="none" stroke="#2447FF" strokeWidth={5} />
      <path d="M30,130 L450,10" fill="none" stroke="#111" strokeWidth={2} strokeDasharray="6 4" />
      <text x={230} y={30} fontSize={12} fontWeight={800}>INPUT ➜ OUTPUT (จำลอง)</text>
    </g>
  );
  else if (kind === 'wave') body = (
    <g>
      <rect x={0} y={0} width={480} height={150} fill="#2447FF" rx={10} />
      {Array.from({ length: 48 }).map((_, i) => {
        const h = 10 + Math.abs(Math.sin(i * 0.55)) * (i > 30 ? 30 : 55);
        return <rect key={i} x={8 + i * 9.6} y={75 - h / 2} width={5} height={h} rx={2} fill={i > 30 ? '#FFE500' : '#fff'} />;
      })}
      <text x={12} y={20} fill="#fff" fontSize={12} fontWeight={800}>WAVEFORM ก่อน ➜ หลัง (จำลอง)</text>
    </g>
  );
  else body = (
    <g fontSize={12} fontWeight={800}>
      <rect x={0} y={0} width={480} height={150} fill="#FFF3BF" stroke="#111" strokeWidth={3} rx={10} />
      <rect x={20} y={40} width={130} height={70} fill="#FFE500" stroke="#111" strokeWidth={3} rx={10} />
      <rect x={175} y={40} width={130} height={70} fill="#3EE6FF" stroke="#111" strokeWidth={3} rx={10} />
      <rect x={330} y={40} width={130} height={70} fill="#B6FF2E" stroke="#111" strokeWidth={3} rx={10} />
      <text x={85} y={80} textAnchor="middle">BEFORE</text><text x={240} y={80} textAnchor="middle">PROCESS</text><text x={395} y={80} textAnchor="middle">AFTER</text>
    </g>
  );
  return (
    <figure style={{ margin: '14px 0' }}>
      <svg viewBox="0 0 480 150" {...common} aria-label={caption || kind}>{body}</svg>
      {caption && <figcaption style={{ fontSize: 13 }}><span className="fl-label">ภาพจำลองเพื่อการเรียนรู้</span> {caption}</figcaption>}
    </figure>
  );
}
export function BlockView({ b }: { b: ContentBlock }) {
  if (b.kind === 'h2') return <h2>{b.heading}</h2>;
  if (b.kind === 'h3') return <h3>{b.heading}</h3>;
  if (b.kind === 'list' || b.kind === 'steps' || b.kind === 'checklist') return (<><h4>{b.heading}</h4><ul>{(b.items || []).map((t, i) => <li key={i}>{t}</li>)}</ul></>);
  if (b.kind === 'warning') return <div className="callout warn"><strong>⚠️ {b.heading || 'ระวัง'}</strong><p>{b.text}</p></div>;
  if (b.kind === 'example') return <div className="callout ex"><strong>🎧 {b.heading || 'ตัวอย่าง'}</strong><p>{b.text}</p>{b.items && <ul>{b.items.map((t, i) => <li key={i}>{t}</li>)}</ul>}</div>;
  if (b.kind === 'flstudio') return <div className="callout fl"><span className="fl-label">{b.flLabel || 'ภาพจำลองเพื่อการเรียนรู้ — ไม่ใช่ภาพหน้าจอจริง FL Studio'}</span><strong> 🖥️ {b.heading}</strong><p>{b.text}</p>{b.items && <ol>{b.items.map((t, i) => <li key={i}>{t}</li>)}</ol>}</div>;
  if (b.kind === 'beforeAfter') return <div className="callout"><strong>🔁 {b.heading || 'Before / After (ปรับระดับให้เท่ากันก่อนเทียบ)'}</strong><p>{b.text}</p><Diagram kind="beforeAfter" caption={b.caption} /></div>;
  if (b.kind === 'mistakes' || b.kind === 'myth') return <div className="callout warn"><strong>💥 {b.heading}</strong><ul>{(b.items || []).map((t, i) => <li key={i}>{t}</li>)}</ul>{b.text && <p>{b.text}</p>}</div>;
  if (b.kind === 'tryit') return <div className="callout tip"><strong>✏️ {b.heading || 'ลองทำเอง'}</strong><p>{b.text}</p></div>;
  if (b.kind === 'summary') return <div className="callout" style={{ background: 'var(--yellow)' }}><strong>📌 {b.heading || 'สรุป'}</strong><p>{b.text}</p>{b.items && <ul>{b.items.map((t, i) => <li key={i}>{t}</li>)}</ul>}</div>;
  if (b.kind === 'table') return (<><h4>{b.heading}</h4><table><thead><tr>{(b.tableHead || []).map((h, i) => <th key={i}>{h}</th>)}</tr></thead><tbody>{(b.tableRows || []).map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table></>);
  return (<>{b.heading && <h3>{b.heading}</h3>}{b.text && <p>{b.text}</p>}{b.items && <ul>{b.items.map((t, i) => <li key={i}>{t}</li>)}</ul>}</>);
}
