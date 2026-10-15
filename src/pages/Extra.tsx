import { Link } from 'react-router-dom';
import { allRefs, libraryCats, lessonById } from '../content';
export function References() {
  return (<><div className="section-title" style={{ marginTop: 20 }}><span className="num">SOURCES</span><h2>อ้างอิง & ที่มาของภาพ</h2></div>
    <p className="prose">หลักเสียงอ้างจากคู่มือ Image-Line และเอกสารเทคนิคที่น่าเชื่อถือ • ภาพ UI ในเว็บนี้วาดใหม่ทั้งหมดเป็น <strong>ภาพจำลองเพื่อการเรียนรู้</strong> ไม่ใช่ภาพหน้าจอจริง — ตรวจสอบชื่อเมนู/ปลั๊กอินกับคู่มือ FL Studio 25 ก่อนสอนทุกครั้ง</p>
    <div className="grid c2">{allRefs.map(r => <div className="card" key={r.id}><h3>{r.title}</h3><p style={{ fontSize: 14 }}>{r.desc}</p><a href={r.url} target="_blank" rel="noreferrer">{r.url}</a><p style={{ fontSize: 13 }}>ใช้ใน: {r.usedIn}</p></div>)}</div></>);
}
export function Library() {
  return (<><div className="section-title" style={{ marginTop: 20 }}><span className="num">A–J</span><h2>คลังความรู้เปิดอ่าน</h2></div>
    <div className="grid c2">{libraryCats.map(c => <div className="card" key={c.code}><span className="tag bl">{c.code}</span><h3>{c.title}</h3><p>{c.desc}</p><ul>{c.keys.flatMap(k => [0, 1, 2, 3].map(n => `${k}${n + 1}`)).map(id => lessonById(id)).filter(Boolean).slice(0, 4).map(l => <li key={l!.id}><Link to={`/lesson/${l!.id}`}>{l!.title}</Link></li>)}</ul></div>)}</div></>);
}
