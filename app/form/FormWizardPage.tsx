'use client';

import { useState } from 'react';
import Step1Info from './components/Step1Info';
import Step2Items from './components/Step2Items';
import Step3Reason from './components/Step3Reason';
import Step4Sign from './components/Step4Sign';
import ReviewPage from './components/ReviewPage';

const STEPS = [
  { id: 1, label: 'ข้อมูล' },
  { id: 2, label: 'รายการยา' },
  { id: 3, label: 'เหตุผล' },
  { id: 4, label: 'ลงนาม' },
  { id: 5, label: 'ตรวจสอบ' },
];

export default function FormWizardPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    sender: {}, 
    items: [], 
    reason: '', 
    signature: null 
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // ฟังก์ชันสำหรับ submit ข้อมูลจริง (กิตสามารถใส่ Logic ส่ง Supabase ที่นี่)
  const handleSubmit = async () => {
    console.log("Submitting:", formData);
    // await supabase.from('returns').insert(formData);
    return { refId: 'GPO-' + Date.now().toString().slice(-6) };
  };

  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Sidebar */}
        <div className="hidden lg:block w-64 shrink-0 sticky top-24">
          <div className="flex flex-col gap-6">
            <a href="/" className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-center px-6 py-3 rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-95">
              ← กลับหน้าหลัก
            </a>
            <div className="bg-white border border-orange-100 shadow-sm rounded-2xl p-6">
              <h3 className="font-black text-orange-900 mb-6 border-b border-orange-100 pb-4">สถานะดำเนินการ</h3>
              <div className="relative flex flex-col gap-8">
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-orange-100" />
                {STEPS.map((s) => (
                  <div key={s.id} className="flex items-center gap-4 relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all shadow-sm ${
                      step >= s.id ? 'bg-orange-500 text-white shadow-orange-200' : 'bg-orange-200 text-white'
                    }`}>
                      {s.id}
                    </div>
                    <span className={`text-xs font-black uppercase tracking-wider ${step >= s.id ? 'text-orange-700' : 'text-orange-300'}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full">
          <div className="bg-gradient-to-br from-teal-700 to-teal-900 text-white rounded-2xl p-7 shadow-lg w-full mb-1">
            <p className="text-xs font-bold tracking-widest text-teal-300 uppercase mb-1">องค์การเภสัชกรรม สาขาภาคใต้</p>
            <h1 className="text-xl font-extrabold leading-snug">แบบขอคืน / แลกเปลี่ยนยาและเวชภัณฑ์</h1>
            <p className="text-sm text-white/60 mt-1">กรุณากรอกข้อมูลให้ครบถ้วนก่อนดำเนินการในขั้นตอนถัดไป</p>
          </div>

          <div className="min-h-[60vh]">
            {step === 1 && <Step1Info next={nextStep} updateData={setFormData} />}
            
            {step === 2 && (
              <Step2Items next={nextStep} back={prevStep} updateData={setFormData} formData={formData} />
            )}
            
            {step === 3 && (
              <Step3Reason next={nextStep} back={prevStep} updateData={setFormData} formData={formData} />
            )}

            {step === 4 && (
              <Step4Sign next={nextStep} back={prevStep} updateData={setFormData} formData={formData} />
            )}

            {/* ปรับแก้ตรงนี้ให้ส่ง formData แทน data เพื่อความสอดคล้องครับ */}
            {step === 5 && (
              <ReviewPage back={prevStep} formData={formData} onSubmit={handleSubmit} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}