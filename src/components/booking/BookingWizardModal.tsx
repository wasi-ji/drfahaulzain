import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, ShieldCheck, Heart, Sparkles, Check, Globe } from 'lucide-react';
import {
  BookingState,
  BookingStep,
  ConsultationMode,
  CountryOption,
  PatientInfo,
  PaymentMethod,
  PhysicalLocation,
  TimeSlot
} from '../../types/booking';
import { generateReferenceCode } from '../../services/bookingEngine';
import { PAKISTAN_COUNTRY } from '../../data/countries';
import { useLanguage } from '../../context/LanguageContext';

import { Step1Mode } from './Step1Mode';
import { Step2Country } from './Step2Country';
import { Step3DateSlot } from './Step3DateSlot';
import { Step4PatientInfo } from './Step4PatientInfo';
import { Step5Payment } from './Step5Payment';
import { Step6Confirmation } from './Step6Confirmation';

interface BookingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: ConsultationMode;
  initialLocation?: PhysicalLocation;
  initialPatient?: PatientInfo;
  initialCountry?: CountryOption;
}

export const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'physical',
  initialLocation = 'nawabshah',
  initialPatient,
  initialCountry,
}) => {
  const { isUrdu, t } = useLanguage();

  // Booking state machine
  const [step, setStep] = useState<BookingStep>(1);
  const [mode, setMode] = useState<ConsultationMode>(initialMode);
  const [location, setLocation] = useState<PhysicalLocation>(initialLocation);
  const [country, setCountry] = useState<CountryOption | null>(PAKISTAN_COUNTRY); // Default Pakistan
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [patient, setPatient] = useState<PatientInfo>({
    fullName: '',
    age: '',
    phone: '',
    email: '',
    reason: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('jazzcash');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [referenceCode, setReferenceCode] = useState<string>(generateReferenceCode());

  // Synchronize initial mode, location, country & prefilled patient info
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setLocation(initialLocation);
      if (initialCountry) {
        setCountry(initialCountry);
      }
      if (initialPatient && (initialPatient.fullName || initialPatient.phone)) {
        setPatient(initialPatient);
        setStep(3); // Jump straight to Date & Slot selection
      } else {
        setStep(1);
      }
    }
  }, [isOpen, initialMode, initialLocation, initialPatient, initialCountry]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleReset = () => {
    setStep(1);
    setMode('physical');
    setLocation('nawabshah');
    setCountry(PAKISTAN_COUNTRY);
    setSelectedDate('');
    setSelectedSlot(null);
    setPatient({ fullName: '', age: '', phone: '', email: '', reason: '' });
    setPaymentMethod('jazzcash');
    setIsPaid(false);
    setReferenceCode(generateReferenceCode());
  };

  if (!isOpen) return null;

  const stepsList = [
    { num: 1, labelEn: 'Mode', labelUr: 'طریقہ' },
    { num: 2, labelEn: 'Country', labelUr: 'ملک و فیس' },
    { num: 3, labelEn: 'Date & Slot', labelUr: 'تاریخ و وقت' },
    { num: 4, labelEn: 'Patient Info', labelUr: 'مریض ڈیٹا' },
    { num: 5, labelEn: 'Payment', labelUr: 'ادائیگی' },
    { num: 6, labelEn: 'Confirmed', labelUr: 'تکمیل' },
  ];

  const bookingState: BookingState = {
    step,
    mode,
    location,
    country,
    selectedDate,
    selectedSlot,
    patient,
    paymentMethod,
    isPaid,
    referenceCode,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-clinical-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 transition-all duration-300">
      
      {/* Modal Dialog Box Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-clinical-150 overflow-hidden relative flex flex-col max-h-[92vh] ${
          isUrdu ? 'direction-rtl text-right' : 'text-left'
        }`}
        id="booking-wizard-dialog"
      >
        {/* Header Bar */}
        <div className="bg-clinical-900 text-white px-5 sm:px-8 py-4 flex items-center justify-between border-b border-clinical-800 shrink-0">
          <div className={`flex items-center gap-3 ${isUrdu ? 'flex-row-reverse' : ''}`}>
            <div className="w-9 h-9 rounded-full bg-clinical-800 border border-clinical-700 flex items-center justify-center text-accent-gold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-base sm:text-lg font-serif font-bold leading-tight">
                {isUrdu ? 'ڈاکٹر فہد الزین — اپوائنٹمنٹ پورٹل' : 'Dr. Fahad Ul Zain — Booking Engine'}
              </span>
              <span className="block text-[11px] font-mono text-clinical-300">
                {isUrdu ? 'پی ایم ڈی سی رجسٹرڈ کنسلٹنٹ سائیکاٹرسٹ' : 'PMDC Registered Consultant Psychiatrist'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-clinical-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close modal"
            id="close-booking-wizard-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step Progress Bar */}
        <div className="bg-clinical-50/80 border-b border-clinical-100 px-4 sm:px-8 py-3 shrink-0">
          <div className="flex items-center justify-between relative max-w-xl mx-auto">
            {/* Progress line behind dots */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-clinical-200 -translate-y-1/2 -z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-clinical-700 -translate-y-1/2 transition-all duration-300 -z-0"
              style={{
                width: `${((step - 1) / (stepsList.length - 1)) * 100}%`,
              }}
            />

            {stepsList.map((s) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;

              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <button
                    type="button"
                    disabled={s.num > step}
                    onClick={() => setStep(s.num as BookingStep)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all duration-200 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white cursor-pointer shadow-xs'
                        : isCurrent
                        ? 'bg-clinical-700 text-white ring-4 ring-clinical-700/20 shadow-xs'
                        : 'bg-white border-2 border-clinical-200 text-clinical-400 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                  </button>
                  <span
                    className={`text-[9px] sm:text-[10px] font-medium mt-1 whitespace-nowrap hidden sm:block ${
                      isCurrent ? 'text-clinical-900 font-bold' : 'text-clinical-400'
                    }`}
                  >
                    {isUrdu ? s.labelUr : s.labelEn}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Screen Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: isUrdu ? -15 : 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isUrdu ? 15 : -15 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && (
                <Step1Mode
                  mode={mode}
                  location={location}
                  onSelectMode={(m) => {
                    setMode(m);
                    if (m === 'physical') {
                      setCountry(PAKISTAN_COUNTRY);
                    }
                  }}
                  onSelectLocation={(l) => setLocation(l)}
                  onNext={() => setStep(2)}
                />
              )}

              {step === 2 && (
                <Step2Country
                  mode={mode}
                  selectedCountry={country}
                  onSelectCountry={(c) => setCountry(c)}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}

              {step === 3 && (
                <Step3DateSlot
                  mode={mode}
                  location={location}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  onSelectDate={(d) => {
                    setSelectedDate(d);
                    setSelectedSlot(null); // Reset slot on date change
                  }}
                  onSelectSlot={(s) => setSelectedSlot(s)}
                  onNext={() => setStep(4)}
                  onBack={() => setStep(2)}
                />
              )}

              {step === 4 && (
                <Step4PatientInfo
                  patient={patient}
                  onChangePatient={(p) => setPatient(p)}
                  onNext={() => setStep(5)}
                  onBack={() => setStep(3)}
                />
              )}

              {step === 5 && (
                <Step5Payment
                  country={country}
                  paymentMethod={paymentMethod}
                  isPaid={isPaid}
                  onSelectPaymentMethod={(m) => setPaymentMethod(m)}
                  onTogglePaid={(p) => setIsPaid(p)}
                  onNext={() => setStep(6)}
                  onBack={() => setStep(4)}
                />
              )}

              {step === 6 && (
                <Step6Confirmation
                  bookingState={bookingState}
                  onResetAndBookAnother={handleReset}
                  onCloseModal={onClose}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
