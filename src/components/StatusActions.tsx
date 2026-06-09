'use client';

export function StatusActions({ request, userDepartment }: { request: any, userDepartment: string }) {
  return (
    <div className="flex gap-2">
      {/* ใส่ปุ่มหรือฟังก์ชันของกิตตรงนี้ */}
      <span className="text-xs text-slate-400">จัดการ {request.request_no}</span>
    </div>
  );
}