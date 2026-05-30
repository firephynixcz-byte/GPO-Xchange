'use client';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-teal-100 p-6 pb-16">
      <div className="max-w-3xl mx-auto">
        
        {/* --- Hero Section (ปรับสีให้สดใสขึ้น) --- */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-400 rounded-[2rem] p-8 md:p-12 text-center text-white shadow-2xl mb-10 border-b-4 border-teal-500/20">
          <div className="inline-block bg-white/20 text-white text-[10px] font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-widest border border-white/20">
            องค์การเภสัชกรรม สาขาภาคใต้
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight drop-shadow-md">GPO XCHANGE PORTAL PLATFORM</h1>
          <p className="text-teal-50 text-sm md:text-base mb-8 opacity-95">ระบบรับคืนและแลกเปลี่ยนสินค้า แบบ One stop service พร้อม Tracking systems</p>
          
          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 border border-white/20">🏥 <span>รองรับทุกหน่วยงาน</span></span>
            <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 border border-white/20">⚡ <span>ติดตามแบบ Real-time</span></span>
            <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 border border-white/20">🔒 <span>รองรับ PDPA consent</span></span>
          </div>
        </div>

        {/* --- ส่วนของลูกค้า --- */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-teal-200 mb-8">
          <h2 className="text-sm font-bold text-teal-950 mb-6 flex items-center gap-2 uppercase tracking-wider">🏠 บริการสำหรับลูกค้า</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <a href="/status" className="group bg-teal-50 p-5 rounded-2xl border border-teal-100 hover:border-teal-400 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl flex items-center justify-between border-l-8 border-l-teal-500">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-xl text-xl shadow-sm">🔍</div>
                <div>
                  <h3 className="font-bold text-teal-950 text-sm">ตรวจสอบสถานะงาน</h3>
                  <p className="text-[11px] text-teal-800/70">ติดตามงานด้วยรหัสอ้างอิง</p>
                </div>
              </div>
              <span className="text-teal-300 group-hover:text-teal-600 font-bold text-xl">›</span>
            </a>

            {/* ส่งแบบฟอร์ม (ตัวอักษรสีแดงสดใสขึ้น) */}
            <a href="/form" className="group bg-teal-50 p-5 rounded-2xl border border-teal-100 hover:border-red-400 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl flex items-center justify-between border-l-8 border-l-red-500">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-xl text-xl shadow-sm">📝</div>
                <div>
                  <h3 className="font-bold text-red-600 text-sm">ส่งแบบฟอร์มรับคืน/แลกเปลี่ยน</h3>
                  <p className="text-[11px] text-red-800/70">แจ้งคืนสินค้าหรือแลกเปลี่ยน</p>
                </div>
              </div>
              <span className="text-red-300 group-hover:text-red-600 font-bold text-xl">›</span>
            </a>

            <a href="/rules" className="group bg-teal-50 p-5 rounded-2xl border border-teal-100 hover:border-blue-500 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl flex items-center justify-between border-l-8 border-l-blue-500">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-xl text-xl shadow-sm">📋</div>
                <div>
                  <h3 className="font-bold text-teal-950 text-sm">หลักเกณฑ์การรับคืนสินค้า</h3>
                  <p className="text-[11px] text-teal-800/70">ตรวจสอบเงื่อนไขและนโยบาย</p>
                </div>
              </div>
              <span className="text-blue-200 group-hover:text-blue-500 font-bold text-xl">›</span>
            </a>

            <a href="/manual" className="group bg-teal-50 p-5 rounded-2xl border border-teal-100 hover:border-blue-500 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl flex items-center justify-between border-l-8 border-l-blue-500">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-xl text-xl shadow-sm">📖</div>
                <div>
                  <h3 className="font-bold text-teal-950 text-sm">คู่มือการใช้งานระบบ</h3>
                  <p className="text-[11px] text-teal-800/70">Manual</p>
                </div>
              </div>
              <span className="text-blue-200 group-hover:text-blue-500 font-bold text-xl">›</span>
            </a>
          </div>
        </section>

        {/* --- ส่วนพนักงาน --- */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-teal-200">
          <h2 className="text-sm font-bold text-teal-950 mb-6 flex items-center gap-2 uppercase tracking-wider">💊 ส่วนของพนักงาน GPO</h2>
          <a href="/admin" className="group bg-teal-50 p-5 rounded-2xl border border-teal-100 hover:border-teal-500 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl flex items-center justify-between border-l-8 border-l-teal-500">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-xl text-xl shadow-sm">👤</div>
              <div>
                <h3 className="font-bold text-teal-950 text-sm">สำหรับพนักงาน GPO</h3>
                <p className="text-[11px] text-teal-800/70">อัปเดตข้อมูล CSR / ขนส่ง / คลัง</p>
              </div>
            </div>
            <span className="text-teal-300 group-hover:text-teal-600 font-bold text-xl">›</span>
          </a>
        </section>

      </div>
    </div>
  );
}