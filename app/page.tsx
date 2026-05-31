'use client';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-teal-100 font-sans">
      
      {/* 1. FIXED TOP HEADER */}
      <header className="fixed top-0 left-0 w-full bg-white/85 backdrop-blur-lg border-b border-teal-100 z-50">
        <div className="max-w-[1200px] mx-auto h-[48px] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-br from-teal-800 to-teal-600 text-white font-black text-[12px] px-[10px] py-[4px] rounded-full shadow-[0_2px_8px_rgba(13,148,136,0.3)] tracking-wide">
              GPO
            </span>
            <span className="text-teal-950 font-black text-sm tracking-wide hidden sm:block">
              องค์การเภสัชกรรม สาขาภาคใต้
            </span>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT - ปรับ padding ให้ responsive */}
      <main className="w-full px-4 md:px-20 py-10 pt-20 pb-16">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-green-700 to-blue-600 p-8 md:p-12 rounded-[2.5rem] text-center text-white shadow-2xl">
            <h1 className="text-3xl md:text-5xl font-black mb-4">GPO XCHANGE PORTAL PLATFORM</h1>
            <p className="text-sm md:text-lg opacity-90 mb-6">ระบบรับคืนและแลกเปลี่ยนสินค้า แบบ One stop service พร้อม Tracking systems</p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-[10px] md:text-xs font-medium flex items-center gap-2 border border-white/20">🏥 <span>รองรับทุกหน่วยงาน</span></span>
              <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-[10px] md:text-xs font-medium flex items-center gap-2 border border-white/20">⚡ <span>ติดตามแบบ Real-time</span></span>
              <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-[10px] md:text-xs font-medium flex items-center gap-2 border border-white/20">🔒 <span>รองรับ PDPA consent</span></span>
            </div>
          </div>

          {/* ส่วนของลูกค้า - ปรับ grid ให้เป็น 1 คอลัมน์บนมือถือ */}
          <section className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-teal-200 mb-8">
            <h2 className="text-base font-black text-teal-950 mb-6 flex items-center gap-2 uppercase tracking-wider">🏠 ส่วนของลูกค้า (Customers)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="/status" className="group bg-teal-50 p-6 rounded-2xl border border-teal-100 hover:border-teal-400 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl flex items-center justify-between border-l-8 border-l-teal-500 md:border-l-transparent hover:md:border-l-teal-500">
                <div className="flex items-center gap-4"><div className="bg-white p-3 rounded-xl text-xl shadow-sm">🔍</div><div><h3 className="font-black text-teal-950 text-sm">ตรวจสอบสถานะงาน</h3><p className="text-[11px] text-teal-700/70">ติดตามงานด้วยรหัสอ้างอิง</p></div></div>
                <span className="text-teal-300 group-hover:text-teal-600 font-black text-xl">›</span>
              </a>
              <a href="/form" className="group bg-teal-50 p-6 rounded-2xl border border-teal-100 hover:border-red-400 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl flex items-center justify-between border-l-8 border-l-red-500 md:border-l-transparent hover:md:border-l-red-500">
                <div className="flex items-center gap-4"><div className="bg-white p-3 rounded-xl text-xl shadow-sm">📝</div><div><h3 className="font-black text-red-600 text-sm">ส่งแบบฟอร์มรับคืน/แลกเปลี่ยน</h3><p className="text-[11px] text-teal-700/70">แจ้งคืนสินค้าหรือแลกเปลี่ยน</p></div></div>
                <span className="text-red-300 group-hover:text-red-600 font-black text-xl">›</span>
              </a>
              <a href="/rules" className="group bg-teal-50 p-6 rounded-2xl border border-teal-100 hover:border-blue-500 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl flex items-center justify-between border-l-8 border-l-blue-500">
                <div className="flex items-center gap-4"><div className="bg-white p-3 rounded-xl text-xl shadow-sm">📋</div><div><h3 className="font-black text-teal-950 text-sm">หลักเกณฑ์การรับคืนสินค้า</h3><p className="text-[11px] text-teal-700/70">ตรวจสอบเงื่อนไขและนโยบาย</p></div></div>
                <span className="text-blue-200 group-hover:text-blue-500 font-black text-xl">›</span>
              </a>
              <a href="/manual" className="group bg-teal-50 p-6 rounded-2xl border border-teal-100 hover:border-blue-500 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl flex items-center justify-between border-l-8 border-l-blue-500">
                <div className="flex items-center gap-4"><div className="bg-white p-3 rounded-xl text-xl shadow-sm">📖</div><div><h3 className="font-black text-teal-950 text-sm">คู่มือการใช้งานระบบ</h3><p className="text-[11px] text-teal-700/70">Manual</p></div></div>
                <span className="text-blue-200 group-hover:text-blue-500 font-black text-xl">›</span>
              </a>
            </div>
          </section>

          {/* ส่วนพนักงาน */}
          <section className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-teal-200">
            <h2 className="text-base font-black text-teal-950 mb-6 flex items-center gap-2 uppercase tracking-wider">💊 ส่วนของพนักงาน GPO (GPO Staff)</h2>
            <a href="/admin" className="group bg-teal-50 p-5 rounded-2xl border border-teal-100 hover:border-teal-500 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl flex items-center justify-between border-l-8 border-l-teal-500">
              <div className="flex items-center gap-4"><div className="bg-white p-3 rounded-xl text-xl shadow-sm">👤</div><div><h3 className="font-black text-teal-950 text-sm">สำหรับพนักงาน GPO</h3><p className="text-[11px] text-teal-700/70">อัปเดตข้อมูล CSR / ขนส่ง / คลัง</p></div></div>
              <span className="text-teal-300 group-hover:text-teal-600 font-black text-xl">›</span>
            </a>
          </section>
        </div>
      </main>

      {/* FOOTER - ปรับ grid ให้เรียงแนวตั้งบนมือถือ */}
      <footer className="w-full bg-[#0a0f17] border-t border-[#1e293b] pt-12 pb-8 px-6 md:px-16 text-[#94a3b8]">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-3"><span className="bg-[#0d9488]/20 text-[#2dd4bf] border border-[#0d9488]/40 text-[10px] font-black px-3 py-1 rounded tracking-wider">GPO SOUTHERN</span><span className="text-white font-black text-sm">Xchange Portal</span></div>
            <div className="bg-[#111827] border border-[#1e293b] p-5 rounded-2xl w-full"><div className="text-[10px] text-[#2dd4bf] font-black uppercase mb-1">Architecture Model</div><div className="text-white text-sm font-black mb-2 flex items-center gap-2">🗺️ แผนผังโครงสร้างระบบ Xchange</div><p className="text-[11px] leading-relaxed mb-4 text-[#2dd4bf]">คลิกเพื่อเปิดดูสรุปฟังก์ชันหลัก วิสัยทัศน์ และกระบวนการ Automation ทั้งหมดบนหน้าจอ</p><button className="bg-[#1e40af] text-white text-[11px] font-black px-4 py-2 rounded-lg hover:bg-[#1e3a8a] transition-all w-full">เปิดดูผังระบบ 🔍</button></div>
          </div>
          <div>
            <h3 className="text-white font-black text-sm mb-6 flex items-center gap-2">🎧 ช่องทางการติดต่อ</h3>
            <div className="space-y-4 text-[12px] text-[#94a3b8]">
              <div className="flex gap-3"><span className="text-[#2dd4bf] mt-0.5">📍</span><p className="leading-5">องค์การเภสัชกรรม สาขาภาคใต้ เลขที่ 90 ถนนนิพัทธ์สงเคราะห์ 5 ต.คอหงส์ อ.หาดใหญ่ จ.สงขลา 90110</p></div>
              <div className="flex gap-3 items-center"><span className="text-[#2dd4bf]">📞</span><span>โทรศัพท์: <a href="tel:074230547" className="text-[#2dd4bf] hover:underline">074-230547</a></span></div>
              <div className="flex gap-3 items-center"><span className="text-[#2dd4bf]">💬</span><span>Line Official: <a href="https://line.me/R/ti/p/%40gpoofficial" className="text-[#2dd4bf] hover:underline">@gpoofficial</a></span></div>
              <div className="flex gap-3 items-center"><span className="text-[#2dd4bf]">✉️</span><span>Email: <a href="mailto:gposouthhdy@gmail.com" className="text-[#2dd4bf] hover:underline">gposouthhdy@gmail.com</a></span></div>
            </div>
          </div>
          <div>
            <h3 className="text-white font-black text-sm mb-6 flex items-center gap-2">🕒 เวลาทำการ</h3>
            <div className="space-y-4 text-[12px] text-[#94a3b8]">
              <div className="flex gap-3"><span className="text-[#2dd4bf] mt-0.5">💼</span><p className="leading-5">ติดต่อสำนักงาน: วันจันทร์ - วันศุกร์ เวลา 08:00 น. - 16:00 น. (เว้นวันหยุดราชการ)</p></div>
              <div className="flex gap-3"><span className="text-[#2dd4bf] mt-0.5">🌐</span><p className="leading-5">ระบบบริการออนไลน์และ Tracking: เปิดใช้งานตลอด 24 ชั่วโมง</p></div>
            </div>
          </div>
        </div>
        <div className="w-full mt-10 pt-8 border-t border-[#1e293b] flex justify-center">
          <div className="flex flex-wrap rounded-full justify-center gap-3 w-full max-w-4xl">
            {[
              { label: '🖥️ AWS Supabase', color: 'bg-slate-600' }, { label: '📱 Mobile-First', color: 'bg-blue-700' }, { label: '⚡ Low Cost', color: 'bg-amber-500 text-teal-950' }, { label: '🤖 Auto PDF', color: 'bg-purple-700' }, { label: '✅ GDP Standard', color: 'bg-emerald-700' }, { label: '☁️ Cloud-Native', color: 'bg-cyan-700' },
            ].map((item, i) => (
              <span key={i} className={`${item.color} text-white px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-wider shadow-sm border border-white/5`}>{item.label}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}