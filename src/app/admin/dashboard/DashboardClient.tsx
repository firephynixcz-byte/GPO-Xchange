'use client';

import { useState } from 'react';
import { StatusActions } from '@/components/StatusActions';
import { approveStaff } from '@/actions/staff-register'; // กิตสร้างฟังก์ชันนี้ไว้ในไฟล์ Action นะครับ

export function DashboardClient({ user, initialRequests, pendingStaff }) {
  const [requests] = useState(initialRequests);
  const [staffList, setStaffList] = useState(pendingStaff || []);

  const handleApprove = async (staffId: string) => {
    await approveStaff(staffId);
    setStaffList(staffList.filter(s => s.id !== staffId));
    alert("อนุมัติสิทธิ์เรียบร้อยครับ");
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900">Dashboard: {user.department}</h1>
          <p className="text-slate-500">จัดการรายการใบงานและอัปเดตสถานะสำหรับพนักงาน</p>
        </header>

        {/* ส่วนอนุมัติพนักงาน (แสดงเฉพาะ CSR) */}
        {user.department === 'csr' && staffList.length > 0 && (
          <section className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-3xl">
            <h2 className="text-lg font-black text-amber-900 mb-4">พนักงานรอการอนุมัติ ({staffList.length})</h2>
            <div className="grid gap-3">
              {staffList.map(staff => (
                <div key={staff.id} className="flex justify-between items-center bg-white p-4 rounded-xl border">
                  <div>
                    <p className="font-bold">{staff.full_name}</p>
                    <p className="text-xs text-slate-500 uppercase">{staff.department}</p>
                  </div>
                  <button 
                    onClick={() => handleApprove(staff.id)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold"
                  >
                    อนุมัติสิทธิ์
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ตารางใบงาน */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-left font-bold text-slate-600">เลขที่อ้างอิง</th>
                <th className="p-4 text-left font-bold text-slate-600">หน่วยงาน</th>
                <th className="p-4 text-left font-bold text-slate-600">รายการยาและสถานะ</th>
                <th className="p-4 text-left font-bold text-slate-600">สถานะปัจจุบัน</th>
                <th className="p-4 text-left font-bold text-slate-600 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-black text-teal-700">#{req.request_no}</td>
                  <td className="p-4 font-medium text-slate-900">{req.hospital_name}</td>
                  
                  <td className="p-4 space-y-2">
                    {req.drug_items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-white border border-slate-100 rounded-lg shadow-sm">
                        <span className="text-xs font-medium text-slate-700">{item.item_name}</span>
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          item.exp_status === 'pass' ? 'bg-green-100 text-green-700' : 
                          item.exp_status === 'near' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.exp_status === 'pass' && (
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          )}
                          {item.exp_status === 'pass' ? 'ผ่านหลักเกณฑ์' : item.exp_status}
                        </span>
                      </div>
                    ))}
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {req.current_status}
                    </span>
                  </td>
                  
                  <td className="p-4 text-right">
                    <StatusActions request={req} userDepartment={user.department} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}