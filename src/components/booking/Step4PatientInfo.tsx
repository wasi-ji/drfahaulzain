import React, { useEffect, useRef } from 'react';
import { User, Phone, Mail, FileText, ArrowLeft, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react';
import { PatientInfo } from '../../types/booking';
import { useLanguage } from '../../context/LanguageContext';

interface Step4Props {
  patient: PatientInfo;
  onChangePatient: (patient: PatientInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4PatientInfo: React.FC<Step4Props> = ({
  patient,
  onChangePatient,
  onNext,
  onBack,
}) => {
  const { isUrdu } = useLanguage();
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Auto focus name input for UX comfort
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const handleChange = (field: keyof PatientInfo, value: string) => {
    onChangePatient({
      ...patient,
      [field]: value,
    });
  };

  const quickSymptoms = [
    { en: 'Anxiety & Panic Attacks', ur: 'بے چینی اور گھبراہٹ' },
    { en: 'Depression & Mood Fatigue', ur: 'ڈپریشن اور اداسی' },
    { en: 'Sleep & Insomnia Issues', ur: 'نیند نہ آنا (بے خوابی)' },
    { en: 'Student / Work Burnout', ur: 'ذہنی سستی اور برن آؤٹ' },
    { en: 'Obsessive Thoughts (OCD)', ur: 'بار بار اننوے خیالات (OCD)' },
    { en: 'General Psychiatric Checkup', ur: 'عمومی نفسیاتی معائنہ' },
  ];

  const isFormValid =
    patient.fullName.trim().length >= 2 &&
    patient.age.trim().length >= 1 &&
    patient.phone.trim().length >= 8;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`space-y-1.5 ${isUrdu ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center gap-2 ${isUrdu ? 'flex-row-reverse' : ''}`}>
          <span className="px-2.5 py-1 rounded-full bg-clinical-100 text-clinical-700 text-[11px] font-bold font-mono uppercase tracking-wider">
            {isUrdu ? 'مرحلہ 4 از 6' : 'Step 4 of 6'}
          </span>
          <span className="text-xs text-clinical-400 font-medium">
            {isUrdu ? 'مریض کی بنیادی معلومات' : 'Patient Demographics & Medical History'}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-clinical-900 tracking-tight">
          {isUrdu ? 'مریض کی معلومات فراہم کریں' : 'Patient Information Form'}
        </h3>
        <p className="text-xs sm:text-sm text-clinical-500 font-sans">
          {isUrdu
            ? 'میڈیکل کوڈ آف کنڈکٹ کے تحت تمام معلومات سو فیصد خفیہ رکھی جائیں گی۔'
            : 'All medical submissions operate under strict clinical confidentiality safeguards.'}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isFormValid) onNext();
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className={`space-y-1.5 ${isUrdu ? 'text-right' : 'text-left'}`}>
            <label className="block text-xs font-bold uppercase tracking-wider text-clinical-600 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-accent-gold" />
              <span>{isUrdu ? 'مریض کا مکمل نام *' : "Patient's Full Name *"}</span>
            </label>
            <input
              ref={nameInputRef}
              type="text"
              required
              value={patient.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder={isUrdu ? 'مثلاً ثاقب خان' : 'e.g. Saqib Khan'}
              className={`w-full bg-clinical-50/80 border border-clinical-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-clinical-600 focus:bg-white text-clinical-900 transition-colors ${
                isUrdu ? 'text-right' : 'text-left'
              }`}
            />
          </div>

          {/* Age */}
          <div className={`space-y-1.5 ${isUrdu ? 'text-right' : 'text-left'}`}>
            <label className="block text-xs font-bold uppercase tracking-wider text-clinical-600 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-accent-gold" />
              <span>{isUrdu ? 'عمر (سالوں میں) *' : 'Age (in Years) *'}</span>
            </label>
            <input
              type="number"
              required
              min={1}
              max={120}
              value={patient.age}
              onChange={(e) => handleChange('age', e.target.value)}
              placeholder={isUrdu ? 'مثلاً 28' : 'e.g. 28'}
              className={`w-full bg-clinical-50/80 border border-clinical-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-clinical-600 focus:bg-white text-clinical-900 transition-colors ${
                isUrdu ? 'text-right' : 'text-left'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mobile Phone (WhatsApp) */}
          <div className={`space-y-1.5 ${isUrdu ? 'text-right' : 'text-left'}`}>
            <label className="block text-xs font-bold uppercase tracking-wider text-clinical-600 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isUrdu ? 'واٹس ایپ نمبر *' : 'WhatsApp Mobile Number *'}</span>
            </label>
            <input
              type="tel"
              required
              value={patient.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder={isUrdu ? 'مثلاً 03001234567' : 'e.g. +92 300 1234567'}
              className="w-full bg-clinical-50/80 border border-clinical-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-clinical-600 focus:bg-white text-clinical-900 text-left transition-colors"
            />
            <span className="block text-[10px] text-clinical-400">
              {isUrdu ? 'ٹوکن اور اپوائنٹمنٹ لنک اس واٹس ایپ پر موصول ہوگا' : 'Your reference token will be sent directly to this WhatsApp'}
            </span>
          </div>

          {/* Email Address */}
          <div className={`space-y-1.5 ${isUrdu ? 'text-right' : 'text-left'}`}>
            <label className="block text-xs font-bold uppercase tracking-wider text-clinical-600 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-accent-gold" />
              <span>{isUrdu ? 'ای میل ایڈریس' : 'Email Address (Optional)'}</span>
            </label>
            <input
              type="email"
              value={patient.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder={isUrdu ? 'نام@ڈومین.کام' : 'patient@example.com'}
              className="w-full bg-clinical-50/80 border border-clinical-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-clinical-600 focus:bg-white text-clinical-900 text-left transition-colors"
            />
          </div>
        </div>

        {/* Reason for Visit */}
        <div className={`space-y-1.5 ${isUrdu ? 'text-right' : 'text-left'}`}>
          <label className="block text-xs font-bold uppercase tracking-wider text-clinical-600 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-accent-gold" />
            <span>{isUrdu ? 'معائنے کی بنیادی وجہ / علامات' : 'Primary Concern / Reason for Visit'}</span>
          </label>

          {/* Quick Select Chips */}
          <div className="flex flex-wrap gap-1.5 pb-1">
            {quickSymptoms.map((symptom, idx) => {
              const label = isUrdu ? symptom.ur : symptom.en;
              const isSelected = patient.reason === label;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChange('reason', label)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-clinical-700 text-white font-bold'
                      : 'bg-clinical-100 text-clinical-700 hover:bg-clinical-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <textarea
            rows={2}
            value={patient.reason}
            onChange={(e) => handleChange('reason', e.target.value)}
            placeholder={isUrdu ? 'مثلاً نیند کی پریشانی، بے چینی یا ذہنی دباؤ...' : 'Briefly describe symptoms (e.g. panic attacks, mood changes, insomnia)...'}
            className={`w-full bg-clinical-50/80 border border-clinical-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-clinical-600 focus:bg-white text-clinical-900 transition-colors ${
              isUrdu ? 'text-right' : 'text-left'
            }`}
          />
        </div>

        <div className={`flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-emerald-900 text-xs ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="leading-relaxed">
            {isUrdu
              ? 'پی ایم ڈی سی کی طبی رازداری پالیسی کے مطابق آپ کی تمام تفصیلات کسی بیرونی ادارے کو فراہم نہیں کی جاتیں۔'
              : 'Medical Ethics Guarantee: Patient data is kept 100% confidential under PMDC regulation.'}
          </span>
        </div>

        {/* Navigation Footer */}
        <div className={`pt-2 flex justify-between items-center ${isUrdu ? 'flex-row-reverse' : ''}`}>
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl border border-clinical-200 text-clinical-700 text-xs font-semibold hover:bg-clinical-50 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className={`w-4 h-4 ${isUrdu ? 'rotate-180' : ''}`} />
            <span>{isUrdu ? 'پیچھے جائیں' : 'Back'}</span>
          </button>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`px-6 py-3 rounded-xl font-semibold text-xs transition-all cursor-pointer flex items-center gap-2 ${
              isFormValid
                ? 'bg-clinical-700 hover:bg-clinical-850 text-white shadow-xs hover:shadow-md'
                : 'bg-clinical-200 text-clinical-400 cursor-not-allowed'
            }`}
          >
            <span>{isUrdu ? 'آگے بڑھیں (ادائیگی)' : 'Continue to Payment'}</span>
            <Sparkles className="w-4 h-4 text-accent-gold" />
          </button>
        </div>
      </form>
    </div>
  );
};
