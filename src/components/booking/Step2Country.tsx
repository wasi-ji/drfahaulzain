import React, { useState, useEffect } from 'react';
import { Search, Globe, Check, EyeOff, Tag, Shield, Sparkles, ArrowLeft, Lock } from 'lucide-react';
import { ConsultationMode, CountryOption } from '../../types/booking';
import { ALL_COUNTRIES, POPULAR_COUNTRIES, PAKISTAN_COUNTRY } from '../../data/countries';
import { useLanguage } from '../../context/LanguageContext';

interface Step2Props {
  mode: ConsultationMode;
  selectedCountry: CountryOption | null;
  onSelectCountry: (country: CountryOption) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Country: React.FC<Step2Props> = ({
  mode,
  selectedCountry,
  onSelectCountry,
  onNext,
  onBack,
}) => {
  const { isUrdu } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const isPhysical = mode === 'physical';

  // Automatically lock country to Pakistan if physical mode is selected
  useEffect(() => {
    if (isPhysical && selectedCountry?.code !== 'PK') {
      onSelectCountry(PAKISTAN_COUNTRY);
    }
  }, [isPhysical, selectedCountry, onSelectCountry]);

  const filteredCountries = ALL_COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`space-y-1.5 ${isUrdu ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center gap-2 ${isUrdu ? 'flex-row-reverse' : ''}`}>
          <span className="px-2.5 py-1 rounded-full bg-clinical-100 text-clinical-700 text-[11px] font-bold font-mono uppercase tracking-wider">
            {isUrdu ? 'مرحلہ 2 از 6' : 'Step 2 of 6'}
          </span>
          <span className="text-xs text-clinical-400 font-medium">
            {isUrdu ? 'رہائش کا ملک اور طبی فیس' : 'Country Selection & Fee Calculation'}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-clinical-900 tracking-tight">
          {isUrdu ? 'اپنا ملک یا رہائش منتخب کریں' : 'Select Your Resident Country'}
        </h3>
        <p className="text-xs sm:text-sm text-clinical-500 font-sans">
          {isUrdu
            ? 'کلینکل پالیسی کے مطابق باقاعدہ فیس معلوم کرنے کے لیے برائے مہربانی اپنا ملک منتخب کریں۔'
            : 'Per clinical policy, consultation pricing is calculated based on patient residency.'}
        </p>
      </div>

      {/* PHYSICAL CONSULTATION LOCK BANNER */}
      {isPhysical && (
        <div className={`p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-center gap-3 shadow-xs ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="block font-bold">
              {isUrdu ? 'فزیکل کلینک کے لیے ملک کی سلیکشن پاکستان تک محدود ہے:' : 'Physical OPD Location Locked to Pakistan:'}
            </span>
            <p className="text-[11px] leading-relaxed text-amber-800 font-sans">
              {isUrdu
                ? 'فزیکل کلینک (نوابشاہ اور حیدرآباد) صرف پاکستان کے رہائشیوں کے لیے ہے۔ بین الاقوامی مریضوں کے لیے آن لائن سیشن منتخب کریں۔'
                : 'Physical in-person OPD consultations (Nawabshah & Hyderabad) are available exclusively for residents in Pakistan.'}
            </p>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className={`absolute inset-y-0 ${isUrdu ? 'right-0 pr-3.5' : 'left-0 pl-3.5'} flex items-center pointer-events-none text-clinical-400`}>
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          disabled={isPhysical}
          value={isPhysical ? 'Pakistan' : searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isUrdu ? 'ملک تلاش کریں... (مثلاً پاکستان، متحدہ عرب امارات، امریکہ)' : 'Search country name... (e.g. Pakistan, UAE, USA)'}
          className={`w-full bg-clinical-50/80 border border-clinical-200 rounded-xl ${
            isUrdu ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
          } py-3 text-sm focus:outline-none focus:border-clinical-600 focus:bg-white text-clinical-900 transition-colors ${
            isPhysical ? 'cursor-not-allowed opacity-75 bg-slate-100/80' : ''
          }`}
        />
        {isPhysical && (
          <div className={`absolute inset-y-0 ${isUrdu ? 'left-0 pl-3.5' : 'right-0 pr-3.5'} flex items-center gap-1.5 text-amber-700 text-xs font-semibold pointer-events-none`}>
            <Lock className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'پاکستان تک محدود' : 'Locked to Pakistan'}</span>
          </div>
        )}
      </div>

      {/* Popular Fast Buttons */}
      {!searchQuery && (
        <div className="space-y-2">
          <span className={`block text-[11px] font-bold uppercase tracking-wider text-clinical-400 ${isUrdu ? 'text-right' : 'text-left'}`}>
            {isUrdu ? 'زیادہ منتخب کیے جانے والے ممالک:' : 'Popular Resident Locations:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {POPULAR_COUNTRIES.slice(0, 6).map((country) => {
              const isSelected = selectedCountry?.code === country.code;
              const isDisabled = isPhysical && country.code !== 'PK';

              return (
                <button
                  key={country.code}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onSelectCountry(country)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                    isDisabled
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                      : isSelected
                      ? 'bg-clinical-700 text-white border-clinical-700 shadow-xs cursor-pointer'
                      : 'bg-white text-clinical-700 border-clinical-200 hover:border-clinical-400 hover:bg-clinical-50 cursor-pointer'
                  }`}
                  title={isDisabled ? (isUrdu ? 'فزیکل سیشن کے لیے دستیاب نہیں' : 'Locked for Physical Consultation') : undefined}
                >
                  <span className="text-base leading-none">{country.flag}</span>
                  <span>{country.name}</span>
                  {isDisabled ? (
                    <Lock className="w-3 h-3 text-slate-400" />
                  ) : isSelected ? (
                    <Check className="w-3.5 h-3.5 text-accent-gold" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Country Selection List Box */}
      <div className="bg-white border border-clinical-200 rounded-2xl max-h-52 overflow-y-auto divide-y divide-clinical-100 shadow-inner">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => {
            const isSelected = selectedCountry?.code === country.code;
            const isDisabled = isPhysical && country.code !== 'PK';

            return (
              <button
                key={country.code}
                type="button"
                disabled={isDisabled}
                onClick={() => onSelectCountry(country)}
                className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                  isUrdu ? 'flex-row-reverse text-right' : ''
                } ${
                  isDisabled
                    ? 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-50'
                    : isSelected
                    ? 'bg-clinical-50 font-bold text-clinical-900 cursor-pointer'
                    : 'hover:bg-clinical-50/50 text-clinical-700 cursor-pointer'
                }`}
              >
                <div className={`flex items-center gap-3 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xl leading-none">{country.flag}</span>
                  <span className="text-sm font-medium">{country.name}</span>
                  {isDisabled && (
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-mono font-medium">
                      {isUrdu ? 'غير دستیاب' : 'Locked'}
                    </span>
                  )}
                </div>
                {isDisabled ? (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                ) : isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-clinical-700 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <span className="text-xs text-clinical-350 font-mono">{country.code}</span>
                )}
              </button>
            );
          })
        ) : (
          <div className="p-6 text-center text-xs text-clinical-400 font-medium">
            {isUrdu ? 'کوئی ملک نہیں ملا' : 'No country matching your search.'}
          </div>
        )}
      </div>

      {/* DYNAMIC PRICING GATEWAY CARD */}
      <div className="bg-gradient-to-br from-clinical-900 to-clinical-800 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 rounded-full filter blur-2xl pointer-events-none" />

        {!selectedCountry ? (
          /* Hidden Fee state until country is chosen */
          <div className="flex items-center gap-4 py-2">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-accent-gold">
              <EyeOff className="w-6 h-6" />
            </div>
            <div className={`space-y-1 ${isUrdu ? 'text-right' : 'text-left'}`}>
              <span className="block text-xs font-mono font-bold text-accent-gold uppercase tracking-wider">
                {isUrdu ? 'فیس کا تعیّن بند ہے' : 'Fee Hidden Until Country Selection'}
              </span>
              <p className="text-xs text-clinical-200 font-sans leading-relaxed">
                {isUrdu
                  ? 'برائے مہربانی اوپر فہرست سے اپنا ملک منتخب کریں تاکہ باقاعدہ فیس ظاہر ہو سکے۔'
                  : 'Please select your resident country above to calculate and display the consultation fee.'}
              </p>
            </div>
          </div>
        ) : (
          /* Unlocked Fee Banner */
          <div className="space-y-3 animate-fade-in">
            <div className={`flex justify-between items-start ${isUrdu ? 'flex-row-reverse' : ''}`}>
              <div className={`space-y-0.5 ${isUrdu ? 'text-right' : 'text-left'}`}>
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-accent-gold">
                  {isUrdu ? 'تجویز کردہ کلینکل فیس:' : 'Verified Consultation Fee:'}
                </span>
                <div className={`flex items-center gap-2 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    {selectedCountry.isPakistan ? 'PKR 3,000' : 'USD $150'}
                  </span>
                  <span className="text-xs bg-white/10 text-clinical-100 px-2.5 py-1 rounded-full font-mono">
                    {selectedCountry.flag} {selectedCountry.name}
                  </span>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold shrink-0">
                <Tag className="w-5 h-5" />
              </div>
            </div>

            <div className={`pt-2 border-t border-white/10 text-xs text-clinical-200 flex items-center gap-2 ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {isUrdu
                  ? 'فیس میں تفصیلی نفسیاتی معائنہ، نسخہ تجویز کرنا اور تعقیبی رہنمائی شامل ہے۔'
                  : 'Fee includes full clinical diagnosis, prescription review, and post-consultation guidance.'}
              </span>
            </div>
          </div>
        )}
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
          type="button"
          disabled={!selectedCountry}
          onClick={onNext}
          className={`px-6 py-3 rounded-xl font-semibold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            selectedCountry
              ? 'bg-clinical-700 hover:bg-clinical-850 text-white shadow-xs hover:shadow-md'
              : 'bg-clinical-200 text-clinical-400 cursor-not-allowed'
          }`}
        >
          <span>{isUrdu ? 'آگے بڑھیں (تاریخ و وقت)' : 'Continue to Date & Slot'}</span>
          <Sparkles className="w-4 h-4 text-accent-gold" />
        </button>
      </div>
    </div>
  );
};
