import React from 'react';
import { Building2, Video, MapPin, Clock, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { ConsultationMode, PhysicalLocation } from '../../types/booking';
import { LOCATION_DETAILS } from '../../services/bookingEngine';
import { useLanguage } from '../../context/LanguageContext';

interface Step1Props {
  mode: ConsultationMode;
  location: PhysicalLocation;
  onSelectMode: (mode: ConsultationMode) => void;
  onSelectLocation: (loc: PhysicalLocation) => void;
  onNext: () => void;
}

export const Step1Mode: React.FC<Step1Props> = ({
  mode,
  location,
  onSelectMode,
  onSelectLocation,
  onNext,
}) => {
  const { isUrdu } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`space-y-1.5 ${isUrdu ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center gap-2 ${isUrdu ? 'flex-row-reverse' : ''}`}>
          <span className="px-2.5 py-1 rounded-full bg-clinical-100 text-clinical-700 text-[11px] font-bold font-mono uppercase tracking-wider">
            {isUrdu ? 'مرحلہ 1 از 6' : 'Step 1 of 6'}
          </span>
          <span className="text-xs text-clinical-400 font-medium">
            {isUrdu ? 'معائنے کا ذریعہ اور مرکز' : 'Consultation Format & Location'}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-clinical-900 tracking-tight">
          {isUrdu ? 'معائنے کے طریقہ کار کا انتخاب کریں' : 'Select Consultation Mode'}
        </h3>
        <p className="text-xs sm:text-sm text-clinical-500 font-sans">
          {isUrdu
            ? 'ڈاکٹر فہد الزین نوابشاہ اور حیدرآباد میں فزیکل کلینک اور عالمی سطح پر آن لائن ویڈیو سیشن کی سہولت فراہم کرتے ہیں۔'
            : 'Dr. Fahad offers in-person clinical consultations in Sindh and confidential online video sessions globally.'}
        </p>
      </div>

      {/* Main Mode Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Physical Consult Option */}
        <button
          type="button"
          onClick={() => onSelectMode('physical')}
          className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 relative cursor-pointer group ${
            mode === 'physical'
              ? 'border-clinical-700 bg-clinical-50/80 shadow-md ring-2 ring-clinical-700/20'
              : 'border-clinical-100 bg-white hover:border-clinical-300 hover:shadow-xs'
          }`}
        >
          {mode === 'physical' && (
            <div className={`absolute top-3 ${isUrdu ? 'left-3' : 'right-3'} w-6 h-6 rounded-full bg-clinical-700 text-white flex items-center justify-center`}>
              <Check className="w-4 h-4" />
            </div>
          )}

          <div className={`flex items-start gap-3.5 ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              mode === 'physical' ? 'bg-clinical-700 text-white' : 'bg-clinical-100 text-clinical-700 group-hover:bg-clinical-200'
            }`}>
              <Building2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="block text-base font-bold text-clinical-900 font-serif">
                {isUrdu ? 'فزیکل معائنہ (کلینک سیشن)' : 'In-Person Physical OPD'}
              </span>
              <p className="text-xs text-clinical-500 font-sans leading-relaxed">
                {isUrdu
                  ? 'نوابشاہ میں ولی ہسپتال یا حیدرآباد میں خصوصی اتوار او پی ڈی کا معائنہ۔'
                  : 'Face-to-face consultation at Wali Hospital Nawabshah or Hyderabad Clinic.'}
              </p>
            </div>
          </div>
        </button>

        {/* Online Video Option */}
        <button
          type="button"
          onClick={() => onSelectMode('online')}
          className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 relative cursor-pointer group ${
            mode === 'online'
              ? 'border-clinical-700 bg-clinical-50/80 shadow-md ring-2 ring-clinical-700/20'
              : 'border-clinical-100 bg-white hover:border-clinical-300 hover:shadow-xs'
          }`}
        >
          {mode === 'online' && (
            <div className={`absolute top-3 ${isUrdu ? 'left-3' : 'right-3'} w-6 h-6 rounded-full bg-clinical-700 text-white flex items-center justify-center`}>
              <Check className="w-4 h-4" />
            </div>
          )}

          <div className={`flex items-start gap-3.5 ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              mode === 'online' ? 'bg-clinical-700 text-white' : 'bg-clinical-100 text-clinical-700 group-hover:bg-clinical-200'
            }`}>
              <Video className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className={`flex items-center gap-1.5 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                <span className="block text-base font-bold text-clinical-900 font-serif">
                  {isUrdu ? 'آن لائن ویڈیو مشاورت' : 'Online Video Consult'}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                  {isUrdu ? 'عالمی' : 'Global'}
                </span>
              </div>
              <p className="text-xs text-clinical-500 font-sans leading-relaxed">
                {isUrdu
                  ? 'گھر بیٹھے سیکیور ایچ ڈی ویڈیو لنک کے ذریعے بلا تفریق ملک معائنہ۔'
                  : 'Private HD encrypted video session accessible worldwide from home.'}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Sub-Location Selector if Physical is chosen */}
      {mode === 'physical' && (
        <div className="bg-clinical-50/90 border border-clinical-200/80 rounded-2xl p-4.5 space-y-3 animate-fade-in">
          <div className={`flex items-center gap-2 ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
            <MapPin className="w-4 h-4 text-accent-gold shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-clinical-800">
              {isUrdu ? 'فزیکل کلینک برانچ کا انتخاب کریں:' : 'Choose Physical Clinic Branch:'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Nawabshah Branch */}
            <button
              type="button"
              onClick={() => onSelectLocation('nawabshah')}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                location === 'nawabshah'
                  ? 'border-clinical-700 bg-white shadow-xs text-clinical-900 font-semibold'
                  : 'border-clinical-200 bg-white/60 text-clinical-600 hover:bg-white'
              }`}
            >
              <div className={`flex justify-between items-center ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
                <span className="text-xs font-bold font-serif">
                  {isUrdu ? LOCATION_DETAILS.nawabshah.nameUr : LOCATION_DETAILS.nawabshah.nameEn}
                </span>
                <span className="text-[10px] bg-clinical-100 text-clinical-800 font-mono px-2 py-0.5 rounded-md">
                  10 Slots/day
                </span>
              </div>
              <div className={`flex items-center gap-1.5 mt-1 text-[11px] text-clinical-500 ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
                <Clock className="w-3 h-3 text-clinical-400 shrink-0" />
                <span>{isUrdu ? 'سوموار تا جمعہ • 4:00 PM تا 9:00 PM' : 'Mon – Fri • 4:00 PM – 9:00 PM'}</span>
              </div>
            </button>

            {/* Hyderabad Branch */}
            <button
              type="button"
              onClick={() => onSelectLocation('hyderabad')}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                location === 'hyderabad'
                  ? 'border-clinical-700 bg-white shadow-xs text-clinical-900 font-semibold'
                  : 'border-clinical-200 bg-white/60 text-clinical-600 hover:bg-white'
              }`}
            >
              <div className={`flex justify-between items-center ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
                <span className="text-xs font-bold font-serif">
                  {isUrdu ? LOCATION_DETAILS.hyderabad.nameUr : LOCATION_DETAILS.hyderabad.nameEn}
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-mono px-2 py-0.5 rounded-md">
                  4 Slots/day
                </span>
              </div>
              <div className={`flex items-center gap-1.5 mt-1 text-[11px] text-clinical-500 ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
                <Clock className="w-3 h-3 text-clinical-400 shrink-0" />
                <span>{isUrdu ? 'صرف اتوار • 3:00 PM تا 5:00 PM' : 'Sunday Only • 3:00 PM – 5:00 PM'}</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Reassurance Banner */}
      <div className={`flex items-center gap-3 bg-emerald-50/80 border border-emerald-100 p-3.5 rounded-xl text-emerald-900 text-xs ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <p className="font-sans leading-relaxed">
          {isUrdu
            ? 'تمام مشاورتیں پی ایم ڈی سی طبی اخلاقیات اور سو فیصد راز داری کے تحت انجام دی جاتی ہیں۔'
            : 'All consultations adhere strictly to PMDC medical ethics and 100% confidential privacy standard.'}
        </p>
      </div>

      {/* Action Footer */}
      <div className={`pt-2 flex ${isUrdu ? 'justify-start' : 'justify-end'}`}>
        <button
          type="button"
          onClick={onNext}
          className="bg-clinical-700 hover:bg-clinical-850 text-white font-semibold px-6 py-3 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-2 text-sm"
        >
          <span>{isUrdu ? 'آگے بڑھیں (ملک و فیس)' : 'Continue to Country & Fee'}</span>
          <Sparkles className="w-4 h-4 text-accent-gold" />
        </button>
      </div>
    </div>
  );
};
