import React from 'react';

interface StepProps {
  next: () => void;
  back: () => void;
  updateData: (data: any) => void;
}

const Step4Sign = ({ next, back, updateData }: StepProps) => {
  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <h2 className="text-lg font-bold mb-4">Step 4: ลงนามรับรอง</h2>
      {/* ใส่เนื้อหา Step 4 ของกิตที่นี่ */}
      <div className="flex gap-4 mt-6">
        <button onClick={back} className="px-4 py-2 bg-slate-200 rounded-lg">ย้อนกลับ</button>
        <button onClick={next} className="px-4 py-2 bg-teal-600 text-white rounded-lg">ถัดไป</button>
      </div>
    </div>
  );
};

export default Step4Sign;