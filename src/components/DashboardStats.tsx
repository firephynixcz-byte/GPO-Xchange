'use client';

import { 
  ClipboardDocumentListIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline';

interface StatsProps {
  totalRequests: number;
  pendingStaff: number;
}

export function DashboardStats({ totalRequests, pendingStaff }: StatsProps) {
  const stats = [
    {
      name: 'ใบงานทั้งหมด',
      value: totalRequests,
      icon: ClipboardDocumentListIcon,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      name: 'พนักงานรออนุมัติ',
      value: pendingStaff,
      icon: UserGroupIcon,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {stats.map((item) => (
        <div key={item.name} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className={`p-4 rounded-2xl ${item.bgColor}`}>
            <item.icon className={`w-8 h-8 ${item.color}`} />
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">{item.name}</p>
            <p className="text-3xl font-black text-slate-900">{item.value.toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}