import React, { useEffect, useState } from 'react';
import { CheckCircle2, MessageSquare, Mail, ShieldCheck, Download, RefreshCw, Calendar, MapPin, Clock, User, Tag, ArrowRight } from 'lucide-react';
import { BookingState } from '../../types/booking';
import {
  formatDoctorWhatsAppMessage,
  formatPatientWhatsAppMessage,
  getWhatsAppUrl,
  getEmailDraftUrl,
  saveBookingRecord,
  DOCTOR_WHATSAPP
} from '../../services/bookingEngine';
import { useLanguage } from '../../context/LanguageContext';

interface Step6Props {
  bookingState: BookingState;
  onResetAndBookAnother: () => void;
  onCloseModal: () => void;
}

export const Step6Confirmation: React.FC<Step6Props> = ({
  bookingState,
  onResetAndBookAnother,
  onCloseModal,
}) => {
  const { isUrdu } = useLanguage();
  const [isSaved, setIsSaved] = useState(false);

  // Auto save record upon mounting
  useEffect(() => {
    saveBookingRecord(bookingState).then(() => {
      setIsSaved(true);
    });
  }, [bookingState]);

  const doctorWaUrl = getWhatsAppUrl(
    DOCTOR_WHATSAPP,
    formatDoctorWhatsAppMessage(bookingState, isUrdu)
  );

  const patientWaUrl = getWhatsAppUrl(
    bookingState.patient.phone,
    formatPatientWhatsAppMessage(bookingState, isUrdu)
  );

  const emailUrl = getEmailDraftUrl(bookingState);

  const modeLabel = bookingState.mode === 'physical'
    ? (bookingState.location === 'nawabshah' ? 'Wali Hospital, Nawabshah' : 'Hyderabad Clinic OPD')
    : 'Online Video Consultation';

  const feeDisplay = bookingState.country
    ? `${bookingState.country.currency} ${bookingState.country.fee.toLocaleString()}`
    : 'PKR 3,000';

  return (
    <div className="space-y-6 animate-fade-in text-center">
      {/* Animated Checkmark */}
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-1.5">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono tracking-wider uppercase">
          {isUrdu ? 'اپوائنٹمنٹ رجسٹر ہو گئی' : 'Appointment Slot Locked'}
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-clinical-900 tracking-tight">
          {isUrdu ? 'آپ کی درخواست کی تصدیق ہو گئی ہے!' : 'Consultation Booking Confirmed!'}
        </h3>
        <p className="text-xs sm:text-sm text-clinical-500 max-w-md mx-auto font-sans leading-relaxed">
          {isUrdu
            ? `محترم ${bookingState.patient.fullName}! آپ کی درخواست کا ٹوکن کامیابی سے تیار کر لیا گیا ہے۔`
            : `Thank you ${bookingState.patient.fullName}, your private psychiatric consultation request has been logged successfully.`}
        </p>
      </div>

      {/* Reference Token Badge */}
      <div className="bg-clinical-900 text-white p-4 rounded-2xl max-w-xs mx-auto shadow-md space-y-1">
        <span className="block text-[10px] font-mono text-accent-gold uppercase tracking-widest">
          {isUrdu ? 'سیکیور وزٹ ٹوکن نمبر:' : 'Secure Reference Code:'}
        </span>
        <span className="block text-2xl font-mono font-bold text-white tracking-wider">
          {bookingState.referenceCode}
        </span>
      </div>

      {/* SUMMARY CARD */}
      <div className="bg-white border border-clinical-200 rounded-2xl p-5 shadow-xs text-xs space-y-3 max-w-md mx-auto text-left">
        <div className={`flex justify-between items-center border-b border-clinical-100 pb-2 ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
          <span className="font-bold text-clinical-900 uppercase tracking-wider text-[11px] font-mono">
            {isUrdu ? 'خلاصہ تفاصیل:' : 'Booking Summary:'}
          </span>
          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
            {isSaved ? '✓ Saved' : 'Saving...'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-clinical-700">
          <div className="space-y-1">
            <span className="block text-[10px] uppercase text-clinical-400 font-bold">{isUrdu ? 'مریض:' : 'Patient Name:'}</span>
            <span className="font-bold text-clinical-900 text-sm block">{bookingState.patient.fullName} ({bookingState.patient.age}y)</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] uppercase text-clinical-400 font-bold">{isUrdu ? 'طریقہ:' : 'Consult Mode:'}</span>
            <span className="font-semibold text-clinical-900 block">{modeLabel}</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] uppercase text-clinical-400 font-bold">{isUrdu ? 'تاریخ:' : 'Selected Date:'}</span>
            <span className="font-semibold text-clinical-900 block">{bookingState.selectedDate}</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] uppercase text-clinical-400 font-bold">{isUrdu ? 'وقت کا سلاٹ:' : 'Time Slot:'}</span>
            <span className="font-bold text-clinical-900 text-sm block text-emerald-700">{bookingState.selectedSlot?.label}</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] uppercase text-clinical-400 font-bold">{isUrdu ? 'ملک و فیس:' : 'Country & Fee:'}</span>
            <span className="font-bold text-clinical-900 block">{bookingState.country?.name} • {feeDisplay}</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] uppercase text-clinical-400 font-bold">{isUrdu ? 'ادائیگی:' : 'Payment:'}</span>
            <span className="font-semibold text-clinical-900 block">{bookingState.paymentMethod.toUpperCase()} ({bookingState.isPaid ? 'Paid' : 'Pending'})</span>
          </div>
        </div>
      </div>

      {/* DISPATCH ACTION BUTTONS */}
      <div className="space-y-2.5 max-w-md mx-auto pt-2">
        <span className="block text-[11px] font-mono uppercase font-bold text-clinical-400">
          {isUrdu ? 'فوری تصدیقی میسج ڈسپیچ:' : 'Instant Notification Actions:'}
        </span>

        {/* 1. Doctor WhatsApp */}
        <a
          href={doctorWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer text-xs"
        >
          <MessageSquare className="w-4.5 h-4.5" />
          <span>{isUrdu ? 'ڈاکٹر فہد کو واٹس ایپ پیغام بھیجیں (+92 333 7030787)' : 'Send Booking Details to Doctor via WhatsApp (+92 333 7030787)'}</span>
        </a>

        {/* 2. Patient WhatsApp Copy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <a
            href={patientWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-clinical-100 hover:bg-clinical-200 text-clinical-800 font-semibold py-2.5 px-3 rounded-xl transition-colors cursor-pointer text-xs border border-clinical-200"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>{isUrdu ? 'مریض واٹس ایپ پر کاپی لیں' : 'WhatsApp Copy to Me'}</span>
          </a>

          {/* 3. Email Receipt */}
          <a
            href={emailUrl}
            className="flex items-center justify-center gap-2 bg-clinical-100 hover:bg-clinical-200 text-clinical-800 font-semibold py-2.5 px-3 rounded-xl transition-colors cursor-pointer text-xs border border-clinical-200"
          >
            <Mail className="w-4 h-4 text-accent-gold" />
            <span>{isUrdu ? 'ای میل رسید' : 'Email Receipt'}</span>
          </a>
        </div>
      </div>

      {/* Reassurance Footer */}
      <p className="text-[11px] text-clinical-400 font-sans max-w-sm mx-auto leading-relaxed pt-2">
        {isUrdu
          ? 'ہمارا کلینک اسسٹنٹ آپ کی درخواست موصول ہوتے ہی ملاقات کا حتمی سیشن جاری کرے گا۔'
          : 'Our OPD assistant will review and issue your final clinic session code upon receiving your WhatsApp notification.'}
      </p>

      {/* Footer Modal Actions */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 border-t border-clinical-100">
        <button
          type="button"
          onClick={onResetAndBookAnother}
          className="px-4 py-2.5 rounded-xl border border-clinical-200 text-clinical-700 text-xs font-semibold hover:bg-clinical-50 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{isUrdu ? 'دوسری اپوائنٹمنٹ بک کریں' : 'Book Another Appointment'}</span>
        </button>

        <button
          type="button"
          onClick={onCloseModal}
          className="px-6 py-2.5 rounded-xl bg-clinical-900 text-white text-xs font-semibold hover:bg-clinical-950 transition-colors cursor-pointer"
        >
          <span>{isUrdu ? 'بند کریں اور واپس جائیں' : 'Done & Close'}</span>
        </button>
      </div>
    </div>
  );
};
