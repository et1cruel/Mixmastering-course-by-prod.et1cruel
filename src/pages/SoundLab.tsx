import { useState } from 'react';
import { CompSim, DbCalc, DigitalLab, EqSim, FlowLab, FrequencyExplorer, GainCalc, LoudLab, StereoDemo } from '../components/Lab';

const TABS = [
  { id: 'freq', label: 'FREQUENCY EXPLORER' },
  { id: 'eq', label: 'EQ SIMULATOR' },
  { id: 'comp', label: 'COMPRESSOR SIM' },
  { id: 'gain', label: 'GAIN STAGING CALC' },
  { id: 'db', label: 'DB TO GAIN' },
  { id: 'stereo', label: 'STEREO WIDTH DEMO' },
  { id: 'loud', label: 'LOUDNESS TOOL' },
  { id: 'sr', label: 'SAMPLE RATE EXPLORER' },
] as const;

export default function SoundLab() {
  const [tab, setTab] = useState<string>('freq');
  const active = TABS.find(t => t.id === tab)!;
  return (
    <>
      <div className="section-title" style={{ marginTop: 20 }}>
        <h2 style={{ background: 'var(--paper)', border: 'var(--border-thick)', borderRadius: 14, padding: '6px 22px', boxShadow: 'var(--shadow)' }}>SOUND LAB — ห้องทดลองเสียง</h2>
      </div>
      <div className="callout" style={{ maxWidth: 900 }}>
        เครื่องมือ Interactive สำหรับเรียนรู้ ไม่ได้ประมวลผลเสียงจริงของผู้ใช้ (ระบุชัดเจนว่าเป็น Simulator เพื่อการเรียนรู้) ทุกเครื่องมือมี Input, Output และคำอธิบายวิธีอ่านผล
      </div>
      <div className="lab-shell">
        <nav className="lab-tabs" aria-label="เลือกเครื่องมือ">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} aria-pressed={tab === t.id} className={'lab-tab' + (tab === t.id ? ' active' : '')}>{t.label}</button>
          ))}
        </nav>
        <section className="lab-panel" aria-label={active.label}>
          {tab === 'freq' && <FrequencyExplorer />}
          {tab === 'eq' && <EqSim />}
          {tab === 'comp' && <CompSim />}
          {tab === 'gain' && <><GainCalc /><div style={{ height: 14 }} /><FlowLab /></>}
          {tab === 'db' && <DbCalc />}
          {tab === 'stereo' && <><StereoDemo /><div className="card" style={{ marginTop: 14 }}><h3>Pan Law + Level-Match แบบเร็ว</h3><p>แพนเสียงไปข้างหนึ่งแล้วเหมือนเบาลง? เพราะพลังงานรวมเปลี่ยน — กฎ Pan Law ชดเชยตรงกลาง ~3dB วิธีเทียบ Before/After ที่ถูก: ปรับ output ให้ความดังเฉลี่ยเท่ากันก่อน แล้วค่อยถามว่า “ชัดขึ้น โปร่งขึ้น หรือแค่ดังขึ้น”</p></div></>}
          {tab === 'loud' && <LoudLab />}
          {tab === 'sr' && <DigitalLab />}
        </section>
      </div>
    </>
  );
}
