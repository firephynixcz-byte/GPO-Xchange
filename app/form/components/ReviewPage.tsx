import React from 'react';

interface ReviewProps {
  back: () => void;
  data: any; // ข้อมูลที่ส่งมาตรวจสอบ
}

const ReviewPage = ({ back, data }: ReviewProps) => {
  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <h2 className="text-lg font-bold mb-4">Review: ตรวจสอบข้อมูล</h2>
      {/* แสดงข้อมูลที่กิตกรอกมาทั้งหมด */}
      <pre className="bg-slate-50 p-4 rounded-lg">{JSON.stringify(data, null, 2)}</pre>
      
      <div className="flex gap-4 mt-6">
        <button onClick={back} className="px-4 py-2 bg-slate-200 rounded-lg">ย้อนกลับ</button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg">ยืนยันและส่งข้อมูล</button>
      </div>
    </div>
  );
};

export default ReviewPage;