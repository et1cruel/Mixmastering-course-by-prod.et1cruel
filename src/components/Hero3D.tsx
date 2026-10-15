import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Link } from 'react-router-dom';

function Rig({ off }: { off: boolean }) {
  const g = useRef<any>(null);
  const k1 = useRef<any>(null);
  const k2 = useRef<any>(null);
  useFrame((s) => {
    if (off) return;
    const t = s.clock.elapsedTime;
    if (g.current) { g.current.rotation.y = Math.sin(t * 0.25) * 0.35; g.current.position.y = Math.sin(t * 0.9) * 0.08; }
    if (k1.current) k1.current.rotation.z = -0.6 + Math.sin(t * 1.4) * 0.6;
    if (k2.current) k2.current.rotation.z = 0.6 + Math.cos(t * 1.1) * 0.6;
  });
  return (
    <group ref={g}>
      <mesh position={[0, -0.4, 0]}><boxGeometry args={[4.4, 0.35, 2.4]} /><meshStandardMaterial color="#FFFBF0" /></mesh>
      <mesh position={[-2.9, 0.7, 0]}><boxGeometry args={[1.1, 1.8, 0.8]} /><meshStandardMaterial color="#2447FF" /></mesh>
      <mesh position={[2.9, 0.7, 0]}><boxGeometry args={[1.1, 1.8, 0.8]} /><meshStandardMaterial color="#FF2E9A" /></mesh>
      <mesh position={[-2.9, 0.9, 0.42]}><circleGeometry args={[0.32, 24]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[2.9, 0.9, 0.42]}><circleGeometry args={[0.32, 24]} /><meshStandardMaterial color="#111" /></mesh>
      {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
        <group key={i} position={[x, 0.05, 0.5]}>
          <mesh><cylinderGeometry args={[0.22, 0.22, 0.18, 20]} /><meshStandardMaterial color={['#FFE500', '#B6FF2E', '#3EE6FF', '#FF6B00'][i]} /></mesh>
          <mesh ref={i === 1 ? k1 : i === 2 ? k2 : undefined} position={[0, 0.12, 0]}><boxGeometry args={[0.06, 0.3, 0.06]} /><meshStandardMaterial color="#111" /></mesh>
          <mesh position={[0, -0.45, 0.1]}><boxGeometry args={[0.12, 0.5, 0.12]} /><meshStandardMaterial color="#111" /></mesh>
        </group>
      ))}
      {Array.from({ length: 24 }).map((_, i) => (
        <mesh key={i} position={[-2 + i * 0.17, -1.3 + Math.abs(Math.sin(i)) * 0.5, 0.8]}><boxGeometry args={[0.1, 0.5, 0.1]} /><meshStandardMaterial color={i % 2 ? '#FFE500' : '#B6FF2E'} /></mesh>
      ))}
      <mesh position={[0, 1.9, -0.6]}><boxGeometry args={[1.4, 1.4, 1.4]} /><meshStandardMaterial color="#8B5CFF" /></mesh>
    </group>
  );
}
export default function Hero3D({ motionOff }: { motionOff: boolean }) {
  const [sel, setSel] = useState('หมุนดูได้ • กดปุ่มเพื่อเปิดคำอธิบาย EQ / Comp / Reverb / Width');
  const [err, setErr] = useState(false);
  if (err || motionOff === undefined) { /* fallthrough to canvas anyway */ }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, minHeight: 300 }}>
        {err ? (
          <div style={{ padding: 24, color: '#fff' }}><h3>STUDIO (โหมดภาพนิ่ง)</h3><p>อุปกรณ์ไม่รองรับ WebGL — ใช้ภาพ SVG แทน เนื้อหาครบเหมือนเดิม</p><svg viewBox="0 0 400 160" width="100%" height="160" role="img" aria-label="mixer fallback"><rect x={10} y={20} width={380} height={120} rx={12} fill="#FFE500" stroke="#fff" strokeWidth={4} /><rect x={40} y={50} width={60} height={60} fill="#2447FF" stroke="#111" strokeWidth={4} /><rect x={170} y={50} width={60} height={60} fill="#FF2E9A" stroke="#111" strokeWidth={4} /><rect x={300} y={50} width={60} height={60} fill="#B6FF2E" stroke="#111" strokeWidth={4} /></svg></div>
        ) : (
          <Suspense fallback={<p style={{ color: '#fff', padding: 20 }}>กำลังโหลดห้องแล็บเสียง…</p>}>
            <Canvas camera={{ position: [0, 1.4, 7], fov: 45 }} onCreated={({ gl }) => { try { gl.forceContextLoss?.toString(); } catch { /* noop */ } }} onError={() => setErr(true)}>
              <ambientLight intensity={0.9} /><directionalLight position={[4, 6, 4]} intensity={1.2} />
              <Rig off={motionOff} />
            </Canvas>
          </Suspense>
        )}
      </div>
      <div style={{ padding: 14, background: '#000', color: '#fff' }}>
        <p style={{ margin: '0 0 8px', fontSize: 14 }} aria-live="polite">{sel}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => setSel('EQ: ตัดส่วนเกินออกก่อนบูสต์ — HPF ที่จุดเริ่มต้น 20–40Hz แล้วฟังว่าเนื้อเสียงหายไหม')}>EQ</button>
          <button className="btn" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => setSel('Compressor (จำลอง): Threshold ต่ำ = กดเยอะ | Ratio สูง = แบน | ฟัง Attack ว่า transient หายไหม')}>Compressor</button>
          <button className="btn" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => setSel('Reverb: ส่งผ่าน Send Bus แล้ว HPF ที่ return 250–400Hz กันขุ่น — Pre-delay แยกตัวโน้ตกับหาง')}>Reverb</button>
          <button className="btn" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => setSel('Stereo Width: กว้างได้แต่ต้องเช็ก Mono — ถ้ารวมแล้วเบสหาย = ปัญหา phase')}>Width</button>
          <Link className="btn primary" style={{ padding: '6px 12px', fontSize: 13 }} to="/lab">เปิด Sound Lab ➜</Link>
        </div>
      </div>
    </div>
  );
}
