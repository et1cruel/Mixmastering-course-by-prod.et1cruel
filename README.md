# MIXLAB — Mix & Mastering Academy (ภาษาไทย • FL Studio 25)

ห้องเรียน Mix & Mastering ที่ใช้สอนจริง: หลักสูตร 7 วัน 14 ชม. + บทเรียน 28 บท + สไลด์ 98 หน้า + เกร็ดความรู้ 42 + ควิซ 56 ข้อ + พจนานุกรม 65 คำ + Sound Lab 8 เครื่องมือ + 3D Hero พร้อม fallback

## วิธีรัน
```powershell
npm install
npm run dev     # เปิด http://localhost:5173
npm run build   # ตรวจ TypeScript + สร้าง dist/
npm run preview # ดู build จริง
```

## โครงสร้าง
- `src/content/types.ts` — Type หลักสูตร
- `src/content/curriculum.ts` — เมตา 7 วัน + แผนเวลา
- `src/content/lessons/day1..day7.ts` — บทเรียนฉบับเต็ม (บทละ 12-18 blocks + teacher notes)
- `src/content/slides.ts` — สไลด์ 14/วัน (bullets + visual + presenter notes)
- `src/content/quizzes.ts` — 8 ข้อ/วัน พร้อมเฉลยเหตุผล
- `src/content/tips.ts` — Knowledge Bites 6/วัน (หัวข้อ+คำอธิบาย+ตัวอย่าง+ข้อผิดพลาด+ลองเอง)
- `src/content/glossary.ts` — 65 คำ (ง่าย+เทคนิค+ตัวอย่าง+บทที่เกี่ยว)
- `src/content/references.ts` — 12 แหล่ง (คู่มือ Image-Line + ITU/AES)
- `src/components/Hero3D.tsx` — 3D Mixer (React Three Fiber) + ปุ่ม EQ/Comp/Reverb/Width + fallback SVG + เคารพ reduced-motion
- `src/components/Lab.tsx` — EQ/Comp/Gain/dB/Stereo/SR-Bit/Loudness/Flow simulators (คำนวณจริง, ระบุว่า simulator)
- `src/lib/progress.ts` — LocalStorage: จบบท/ดาว/คะแนน/บทล่าสุด/ศัพท์ที่งง/teacher mode

## แก้เนื้อหา
- แก้บท: เปิด `src/content/lessons/dayN.ts` แก้ `blocks` ตามชนิด `intro/h2/p/list/warning/example/flstudio/steps/beforeAfter/mistakes/summary/tryit/checklist/table`
- ตัวเลขทุกค่าให้คงคำว่า “จุดเริ่มต้น” ไว้ — ห้ามเขียนเป็นสูตรตายตัว
- ภาพทั้งหมดวาดใหม่ด้วย SVG — คงป้าย “ภาพจำลองเพื่อการเรียนรู้” ไว้เสมอ อย่าอ้างว่าเป็นภาพจริง FL Studio
- เพิ่มคำศัพท์ใน `glossary.ts` ใส่ `lessonIds` ให้ลิงก์กลับบทเรียนได้

## สอนด้วยหน้านี้
- สไลด์: `/slides/1..7` — ลูกศร/space เปลี่ยนหน้า, F เต็มจอ, ปุ่มโน้ตผู้สอน, Print/PDF
- Teacher Mode: ปุ่ม 🎓 บนแถบเมนู — แสดง objectives/timing/คำถาม/จุดที่มักเข้าใจผิด/demo/เฉลย/checklist (เก็บในเครื่องเท่านั้น)

## ที่มา
ดูหน้า `/references` — หลักเสียงตรวจกับคู่มือ FL Studio และเอกสาร ITU-R BS.1770 / AES dither ก่อนเผยแพร่ตัวเลข LUFS/TruePeak
