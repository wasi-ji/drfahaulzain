import React, { useState } from 'react';
import { CreditCard, Wallet, Landmark, Copy, Check, ShieldCheck, ArrowLeft, Sparkles, Lock } from 'lucide-react';
import { CountryOption, PaymentMethod } from '../../types/booking';
import { useLanguage } from '../../context/LanguageContext';

interface Step5Props {
  country: CountryOption | null;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  onTogglePaid: (paid: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step5Payment: React.FC<Step5Props> = ({
  country,
  paymentMethod,
  isPaid,
  onSelectPaymentMethod,
  onTogglePaid,
  onNext,
  onBack,
}) => {
  const { isUrdu } = useLanguage();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [txRef, setTxRef] = useState('');

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isPakistan = country?.isPakistan ?? true;
  const feeDisplay = isPakistan ? 'PKR 3,000' : 'USD $150';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`space-y-1.5 ${isUrdu ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center gap-2 ${isUrdu ? 'flex-row-reverse' : ''}`}>
          <span className="px-2.5 py-1 rounded-full bg-clinical-100 text-clinical-700 text-[11px] font-bold font-mono uppercase tracking-wider">
            {isUrdu ? 'مرحلہ 5 از 6' : 'Step 5 of 6'}
          </span>
          <span className="text-xs text-clinical-400 font-medium">
            {isUrdu ? 'کلینکل فیس اور ادائیگی کا طریقہ' : 'Payment Processing & Method'}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-clinical-900 tracking-tight">
          {isUrdu ? 'ادائیگی کے طریقہ کار کا انتخاب کریں' : 'Select Payment Method'}
        </h3>
        <p className="text-xs sm:text-sm text-clinical-500 font-sans">
          {isUrdu
            ? `آپ کے منتخب کردہ ملک (${country?.name}) کے مطابق مشاورت کی کل فیس ${feeDisplay} ہے۔`
            : `Consultation fee locked at ${feeDisplay} for patient resident of ${country?.name || 'Pakistan'}.`}
        </p>
      </div>

      {/* Fee Summary Banner */}
      <div className="bg-gradient-to-r from-clinical-900 to-clinical-800 text-white rounded-2xl p-4 flex justify-between items-center shadow-xs">
        <div className={`space-y-0.5 ${isUrdu ? 'text-right' : 'text-left'}`}>
          <span className="text-[10px] font-mono text-accent-gold uppercase tracking-wider font-bold">
            {isUrdu ? 'قابلِ ادا کل رقم:' : 'Total Payable Consultation Fee:'}
          </span>
          <span className="block text-2xl font-bold font-serif">{feeDisplay}</span>
        </div>
        <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-clinical-100">
          {country?.flag} {country?.name}
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* JazzCash */}
        <button
          type="button"
          onClick={() => onSelectPaymentMethod('jazzcash')}
          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
            paymentMethod === 'jazzcash'
              ? 'border-red-600 bg-red-50/50 ring-2 ring-red-500/20 font-bold text-red-950'
              : 'border-clinical-200 bg-white text-clinical-700 hover:bg-clinical-50'
          }`}
        >
          <Wallet className="w-5 h-5 mx-auto text-red-600 mb-1" />
          <span className="block text-xs font-serif">JazzCash</span>
          <span className="block text-[9px] text-clinical-400">Mobile Wallet</span>
        </button>

        {/* EasyPaisa */}
        <button
          type="button"
          onClick={() => onSelectPaymentMethod('easypaisa')}
          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
            paymentMethod === 'easypaisa'
              ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20 font-bold text-emerald-950'
              : 'border-clinical-200 bg-white text-clinical-700 hover:bg-clinical-50'
          }`}
        >
          <Wallet className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
          <span className="block text-xs font-serif">EasyPaisa</span>
          <span className="block text-[9px] text-clinical-400">Mobile Wallet</span>
        </button>

        {/* Bank Transfer */}
        <button
          type="button"
          onClick={() => onSelectPaymentMethod('bank_transfer')}
          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
            paymentMethod === 'bank_transfer'
              ? 'border-clinical-700 bg-clinical-50 ring-2 ring-clinical-700/20 font-bold text-clinical-950'
              : 'border-clinical-200 bg-white text-clinical-700 hover:bg-clinical-50'
          }`}
        >
          <Landmark className="w-5 h-5 mx-auto text-clinical-700 mb-1" />
          <span className="block text-xs font-serif">Bank Transfer</span>
          <span className="block text-[9px] text-clinical-400">IBAN / Account</span>
        </button>

        {/* Stripe / Card */}
        <button
          type="button"
          onClick={() => onSelectPaymentMethod('stripe')}
          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
            paymentMethod === 'stripe'
              ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 font-bold text-indigo-950'
              : 'border-clinical-200 bg-white text-clinical-700 hover:bg-clinical-50'
          }`}
        >
          <CreditCard className="w-5 h-5 mx-auto text-indigo-600 mb-1" />
          <span className="block text-xs font-serif">Credit Card</span>
          <span className="block text-[9px] text-clinical-400">Stripe Global</span>
        </button>
      </div>

      {/* METHOD DETAILS CONTAINER */}
      <div className="bg-clinical-50/90 border border-clinical-200 rounded-2xl p-4.5 space-y-4">
        {paymentMethod === 'jazzcash' && (
          <div className="space-y-3">
            <div className={`flex justify-between items-center ${isUrdu ? 'flex-row-reverse' : ''}`}>
              <span className="text-xs font-bold font-serif text-red-900">
                {isUrdu ? 'جاز کیش اکاؤنٹ تفصیلات:' : 'JazzCash Account Details:'}
              </span>
              <span className="text-[10px] bg-red-100 text-red-800 font-mono px-2 py-0.5 rounded-full">
                PKR Only
              </span>
            </div>
            <div className="bg-white border border-clinical-200 rounded-xl p-3 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-clinical-500">{isUrdu ? 'اکاؤنٹ کا عنوان:' : 'Account Title:'}</span>
                <span className="font-bold text-clinical-900">Dr. Fahad Ul Zain</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-clinical-500">{isUrdu ? 'جاز کیش نمبر:' : 'JazzCash Mobile:'}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-clinical-900">0370 2207890</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('03702207890', 'jazzcash')}
                    className="p-1 text-clinical-500 hover:text-clinical-900 cursor-pointer"
                  >
                    {copiedField === 'jazzcash' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'easypaisa' && (
          <div className="space-y-3">
            <div className={`flex justify-between items-center ${isUrdu ? 'flex-row-reverse' : ''}`}>
              <span className="text-xs font-bold font-serif text-emerald-900">
                {isUrdu ? 'ایزی پیسہ اکاؤنٹ تفصیلات:' : 'EasyPaisa Account Details:'}
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded-full">
                PKR Only
              </span>
            </div>
            <div className="bg-white border border-clinical-200 rounded-xl p-3 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-clinical-500">{isUrdu ? 'اکاؤنٹ کا عنوان:' : 'Account Title:'}</span>
                <span className="font-bold text-clinical-900">Dr. Fahad Ul Zain</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-clinical-500">{isUrdu ? 'ایزی پیسہ نمبر:' : 'EasyPaisa Mobile:'}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-clinical-900">0370 2207890</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('03702207890', 'easypaisa')}
                    className="p-1 text-clinical-500 hover:text-clinical-900 cursor-pointer"
                  >
                    {copiedField === 'easypaisa' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'bank_transfer' && (
          <div className="space-y-3">
            <div className={`flex justify-between items-center ${isUrdu ? 'flex-row-reverse' : ''}`}>
              <span className="text-xs font-bold font-serif text-clinical-900">
                {isUrdu ? 'آن لائن بینک ٹرانسفر (میزان / ایچ بی ایل):' : 'Bank Account IBAN Details:'}
              </span>
              <span className="text-[10px] bg-clinical-200 text-clinical-800 font-mono px-2 py-0.5 rounded-full">
                Meezan Bank
              </span>
            </div>
            <div className="bg-white border border-clinical-200 rounded-xl p-3 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-clinical-500">{isUrdu ? 'بینک کا نام:' : 'Bank Name:'}</span>
                <span className="font-bold text-clinical-900">Meezan Bank Ltd</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-clinical-500">{isUrdu ? 'عنوان:' : 'Account Title:'}</span>
                <span className="font-bold text-clinical-900">Dr. Fahad Ul Zain</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-clinical-500">IBAN Number:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-clinical-900 text-[11px]">PK36 MEZN 0001 0203 0405 0607</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('PK36MEZN0001020304050607', 'iban')}
                    className="p-1 text-clinical-500 hover:text-clinical-900 cursor-pointer"
                  >
                    {copiedField === 'iban' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'stripe' && (
          <div className="space-y-3">
            <div className={`flex justify-between items-center ${isUrdu ? 'flex-row-reverse' : ''}`}>
              <span className="text-xs font-bold font-serif text-indigo-950 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isUrdu ? 'سیکیور کریڈٹ/ڈیبٹ کارڈ (اسٹرائپ):' : 'Stripe Encrypted Card Checkout:'}</span>
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-mono px-2 py-0.5 rounded-full">
                256-Bit SSL
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Card Number (4242 •••• •••• 4242)"
                className="w-full bg-white border border-clinical-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-indigo-600"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM / YY"
                  className="bg-white border border-clinical-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-indigo-600 text-center"
                />
                <input
                  type="text"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  placeholder="CVC"
                  className="bg-white border border-clinical-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-indigo-600 text-center"
                />
              </div>
            </div>
          </div>
        )}

        {/* Transaction ID / Receipt note optional */}
        <div className={`space-y-1 ${isUrdu ? 'text-right' : 'text-left'}`}>
          <label className="block text-[11px] font-bold text-clinical-600 uppercase">
            {isUrdu ? 'ٹرانزیکشن ریفرنس / رسید نمبر (اختیاری):' : 'Transaction ID / Ref Number (Optional):'}
          </label>
          <input
            type="text"
            value={txRef}
            onChange={(e) => setTxRef(e.target.value)}
            placeholder={isUrdu ? 'مثلاً 92837482' : 'e.g. TXN-8492048'}
            className="w-full bg-white border border-clinical-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-clinical-600 text-clinical-900"
          />
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <label className={`flex items-start gap-3 p-3 rounded-xl bg-white border border-clinical-200 cursor-pointer ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
        <input
          type="checkbox"
          checked={isPaid}
          onChange={(e) => onTogglePaid(e.target.checked)}
          className="mt-0.5 w-4 h-4 text-clinical-700 rounded-sm focus:ring-clinical-500 cursor-pointer"
        />
        <div className="space-y-0.5 text-xs">
          <span className="font-bold text-clinical-900">
            {isUrdu ? 'ادائیگی بھیج دی گئی ہے / کلینک پر ادا کی جائے گی' : 'Payment Transferred / Will Pay at OPD Counter'}
          </span>
          <p className="text-[11px] text-clinical-500">
            {isUrdu
              ? 'نشانی کے طور پر اپنے انتخاب کی تصدیق کریں۔ ڈاکٹر صاحب کو واٹس ایپ پر پیغام بھیج کر سلاٹ نالی کر لیں۔'
              : 'Confirm your payment state to lock your reserved 30-minute appointment slot immediately.'}
          </p>
        </div>
      </label>

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
          onClick={onNext}
          className="px-6 py-3 rounded-xl font-semibold text-xs bg-clinical-700 hover:bg-clinical-850 text-white shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
        >
          <span>{isUrdu ? 'آگے بڑھیں (حتمی تصدیق)' : 'Complete & Generate Token'}</span>
          <Sparkles className="w-4 h-4 text-accent-gold" />
        </button>
      </div>
    </div>
  );
};
