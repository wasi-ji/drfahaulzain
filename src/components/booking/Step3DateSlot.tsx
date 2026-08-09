import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, AlertCircle, Check, ArrowLeft, Sparkles, AlertTriangle } from 'lucide-react';
import { ConsultationMode, PhysicalLocation, TimeSlot } from '../../types/booking';
import { generateTimeSlots, validateBookingDate, getBookedSlotIds, LOCATION_DETAILS } from '../../services/bookingEngine';
import { useLanguage } from '../../context/LanguageContext';

interface Step3Props {
  mode: ConsultationMode;
  location: PhysicalLocation;
  selectedDate: string; // YYYY-MM-DD
  selectedSlot: TimeSlot | null;
  onSelectDate: (dateStr: string) => void;
  onSelectSlot: (slot: TimeSlot) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3DateSlot: React.FC<Step3Props> = ({
  mode,
  location,
  selectedDate,
  selectedSlot,
  onSelectDate,
  onSelectSlot,
  onNext,
  onBack,
}) => {
  const { isUrdu } = useLanguage();
  const now = useMemo(() => new Date(), []);

  // Calendar month state navigation
  const [currentMonth, setCurrentMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));

  const monthYearLabel = currentMonth.toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Days of week header
  const weekDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekDaysUr = ['اتوار', 'سوموار', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];

  // Days in month grid calculation
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{ dateObj: Date; dateStr: string; dayNum: number; isCurrentMonth: boolean }> = [];

    // Padding empty days before month start
    for (let i = 0; i < firstDayIndex; i++) {
      const prevDate = new Date(year, month, -firstDayIndex + i + 1);
      const dateStr = prevDate.toISOString().split('T')[0];
      days.push({ dateObj: prevDate, dateStr, dayNum: prevDate.getDate(), isCurrentMonth: false });
    }

    // Days of current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const yyyy = dateObj.getFullYear();
      const mm = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const dd = dateObj.getDate().toString().padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      days.push({ dateObj, dateStr, dayNum: d, isCurrentMonth: true });
    }

    return days;
  }, [currentMonth]);

  // Generate available slots for selectedDate
  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    const bookedIds = getBookedSlotIds();
    return generateTimeSlots(selectedDate, mode, location, bookedIds, now);
  }, [selectedDate, mode, location, now]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Cutoff status check for today
  const isPast12PMAttempt = useMemo(() => {
    if (!selectedDate) return false;
    const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    return selectedDate === todayStr && now.getHours() >= 12;
  }, [selectedDate, now]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`space-y-1.5 ${isUrdu ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center gap-2 ${isUrdu ? 'flex-row-reverse' : ''}`}>
          <span className="px-2.5 py-1 rounded-full bg-clinical-100 text-clinical-700 text-[11px] font-bold font-mono uppercase tracking-wider">
            {isUrdu ? 'مرحلہ 3 از 6' : 'Step 3 of 6'}
          </span>
          <span className="text-xs text-clinical-400 font-medium">
            {isUrdu ? 'تاریخ اور وقت کا انتخاب' : 'Calendar & Time Slot Picker'}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-clinical-900 tracking-tight">
          {isUrdu ? 'مناسب تاریخ اور سلاٹ منتخب کریں' : 'Choose Appointment Date & Time'}
        </h3>
        <p className="text-xs sm:text-sm text-clinical-500 font-sans">
          {mode === 'physical'
            ? (location === 'nawabshah'
                ? (isUrdu ? 'نوابشاہ کلینک: سوموار تا جمعہ (شام 4:00 تا رات 9:00)' : 'Nawabshah OPD: Mon – Fri (4:00 PM – 9:00 PM)')
                : (isUrdu ? 'حیدرآباد کلینک: صرف اتوار (دوپہر 3:00 تا شام 5:00)' : 'Hyderabad OPD: Sunday Only (3:00 PM – 5:00 PM)'))
            : (isUrdu ? 'آن لائن ویڈیو مشاورت: سوموار تا جمعہ اور اتوار' : 'Online Video Consult: Mon – Fri & Sunday')}
        </p>
      </div>

      {/* Rules Notice Pill */}
      <div className={`p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="block font-bold">
            {isUrdu ? 'شیڈولنگ کی شرائط:' : 'Booking Rules & Same-Day Cutoff:'}
          </span>
          <p className="text-[11px] leading-relaxed text-amber-800">
            {isUrdu
              ? '• زیادہ سے زیادہ 30 دن پہلے تک اپوائنٹمنٹ بک کی جا سکتی ہے۔ • اگر وقت دوپہر 12:00 بجے سے اوپر ہو چکا ہو تو آج کی تاریخ بند ہو جاتی ہے۔'
              : '• Advance bookings allowed up to 30 days. • Same-day booking closes automatically at 12:00 PM Noon.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CALENDAR COLUMN */}
        <div className="lg:col-span-7 bg-white border border-clinical-200 rounded-2xl p-4 shadow-xs space-y-4">
          {/* Month Header Navigation */}
          <div className={`flex items-center justify-between border-b border-clinical-100 pb-3 ${isUrdu ? 'flex-row-reverse' : ''}`}>
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-clinical-100 text-clinical-600 cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold font-serif text-clinical-900 capitalize">
              {monthYearLabel}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-clinical-100 text-clinical-600 cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {(isUrdu ? weekDaysUr : weekDaysEn).map((day, idx) => (
              <span key={idx} className="text-[10px] font-bold text-clinical-400 uppercase py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Date Cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((cell, idx) => {
              if (!cell.isCurrentMonth) {
                return <div key={idx} className="h-9 sm:h-10 rounded-lg bg-clinical-50/30 opacity-20 pointer-events-none" />;
              }

              const validation = validateBookingDate(cell.dateObj, mode, location, now);
              const isSelected = selectedDate === cell.dateStr;

              return (
                <button
                  key={cell.dateStr}
                  type="button"
                  disabled={!validation.allowed}
                  onClick={() => onSelectDate(cell.dateStr)}
                  title={validation.reasonEn || `${cell.dateStr} Selectable`}
                  className={`h-9 sm:h-10 rounded-xl text-xs font-semibold flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-clinical-700 text-white shadow-sm ring-2 ring-clinical-700/30'
                      : validation.allowed
                      ? 'bg-clinical-50/60 text-clinical-900 hover:bg-clinical-200/80 hover:text-clinical-950'
                      : 'bg-slate-100 text-slate-300 cursor-not-allowed line-through opacity-50'
                  }`}
                >
                  <span>{cell.dayNum}</span>
                  {isSelected && (
                    <span className="w-1 h-1 rounded-full bg-accent-gold absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* TIME SLOTS COLUMN */}
        <div className="lg:col-span-5 space-y-3">
          <div className={`flex items-center gap-2 ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
            <Clock className="w-4 h-4 text-accent-gold shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-clinical-800">
              {isUrdu ? 'دستیاب سیشن ٹائم (30 منٹ):' : 'Available Slots (30-min):'}
            </span>
          </div>

          {!selectedDate ? (
            <div className="bg-clinical-50 border border-dashed border-clinical-200 rounded-2xl p-6 text-center text-xs text-clinical-400 font-medium space-y-2">
              <CalendarIcon className="w-8 h-8 text-clinical-300 mx-auto" />
              <p>
                {isUrdu
                  ? 'برائے مہربانی ٹائم سلاٹ دیکھنے کے لیے کیلنڈر سے تاریخ پر کلک کریں۔'
                  : 'Click a date on the calendar to reveal available 30-min consultation slots.'}
              </p>
            </div>
          ) : isPast12PMAttempt ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{isUrdu ? 'آج کی بکنگ بند ہے' : 'Same-Day Cutoff Reached'}</span>
              </div>
              <p className="leading-relaxed text-[11px] text-red-800">
                {isUrdu
                  ? 'آج کا وقت دوپہر 12:00 بجے سے تجاوز کر چکا ہے۔ برائے مہربانی کیلنڈر سے آئندہ کل یا کسی اور آئندہ دن کی تاریخ کا انتخاب کریں۔'
                  : 'Current time is past 12:00 PM Noon. Same-day bookings are closed. Please choose tomorrow or a future date on the calendar.'}
              </p>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-xs text-center font-medium">
              {isUrdu ? 'اس تاریخ پر کوئی سلاٹ دستیاب نہیں ہے' : 'No available slots on this date.'}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;
                const isBooked = !slot.available && (slot.reasonDisabled === 'Booked' || slot.reasonDisabled === 'Already Reserved');

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => onSelectSlot(slot)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-clinical-700 bg-clinical-700 text-white font-bold shadow-xs'
                        : slot.available
                        ? 'border-clinical-200 bg-white text-clinical-900 hover:border-clinical-400 hover:bg-clinical-50'
                        : isBooked
                        ? 'border-red-200 bg-red-50/80 text-red-700 cursor-not-allowed font-medium'
                        : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                    }`}
                  >
                    <span className={`block text-xs font-semibold ${isBooked ? 'line-through text-red-500/70' : ''}`}>
                      {slot.label}
                    </span>
                    {slot.available ? (
                      <span className={`block text-[9px] ${isSelected ? 'text-accent-gold font-bold' : 'text-emerald-600 font-medium'}`}>
                        {isSelected ? '✓ Selected' : 'Available'}
                      </span>
                    ) : isBooked ? (
                      <span className="inline-flex items-center justify-center gap-1 text-[9px] font-bold text-red-600 bg-red-100/90 px-1.5 py-0.5 rounded-md mt-0.5">
                        🔒 {isUrdu ? 'پہلے سے بک شدہ' : 'Booked'}
                      </span>
                    ) : (
                      <span className="block text-[9px] text-slate-400">
                        {slot.reasonDisabled || 'Unavailable'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Selected Slot Summary Badge */}
      {selectedDate && selectedSlot && (
        <div className={`bg-clinical-50 border border-clinical-200 p-3.5 rounded-xl flex items-center justify-between text-xs text-clinical-900 font-medium ${isUrdu ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isUrdu ? 'flex-row-reverse' : ''}`}>
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isUrdu
                ? `منتخب کردہ وقت: ${selectedDate} • ${selectedSlot.label}`
                : `Selected Slot: ${selectedDate} at ${selectedSlot.label}`}
            </span>
          </div>
          <span className="text-[10px] bg-clinical-200 text-clinical-800 font-bold px-2 py-0.5 rounded-md">
            30 mins
          </span>
        </div>
      )}

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
          disabled={!selectedDate || !selectedSlot}
          onClick={onNext}
          className={`px-6 py-3 rounded-xl font-semibold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            selectedDate && selectedSlot
              ? 'bg-clinical-700 hover:bg-clinical-850 text-white shadow-xs hover:shadow-md'
              : 'bg-clinical-200 text-clinical-400 cursor-not-allowed'
          }`}
        >
          <span>{isUrdu ? 'آگے بڑھیں (مریض کا ڈیٹا)' : 'Continue to Patient Info'}</span>
          <Sparkles className="w-4 h-4 text-accent-gold" />
        </button>
      </div>
    </div>
  );
};
