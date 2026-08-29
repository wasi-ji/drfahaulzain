import { ShieldCheck, MessageCircle, Calendar, Sparkles, CheckCircle2, Award } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";


interface HeroProps {
  onBookClick: () => void;
}

export default function Hero({ onBookClick }: HeroProps) {
  const { isUrdu, t } = useLanguage();

  const trustPoints = isUrdu ? [
    "ماہرِ امراضِ نفسيات (کنسلٹنٹ سائیکاٹرسٹ)",
    "۱۰۰٪ خفیہ اور محفوظ مشاورت",
    "مستند سائنسی و طبی طریقہ علاج",
    "مریض کی تسکین اور ہمدردانہ رویہ",
    "جدید ریسرچ پر مبنی طریقہ کار",
    "اپوائنٹمنٹ کی آسان اور تیز بکنگ"
  ] : [
    "Consultant Psychiatrist",
    "Confidential Consultations",
    "Evidence-Based Treatment",
    "Compassionate Patient Care",
    "Research-Informed Clinical Practice",
    "Easy Appointment Booking"
  ];

  return (
    <section
      id="home"
      className="relative pt-24 sm:pt-32 pb-16 md:pb-24 lg:pb-32 overflow-hidden bg-radial from-clinical-50/50 via-transparent to-transparent"
    >
      {/* Absolute background visual ambient elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-clinical-100/30 rounded-full mix-blend-multiply filter blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-accent-soft rounded-full mix-blend-multiply filter blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center ${isUrdu ? "lg:direction-rtl" : ""}`}>

          {/* Left Column Content */}
          <div className="lg:col-span-7 space-y-8" id="hero-left">
            {/* Soft trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-clinical-100/60 border border-clinical-200 text-clinical-800 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs"
            >
              <Award className="w-3.5 h-3.5 text-accent-gold" />
              <span>
                {isUrdu
                  ? "پی ایم ڈی سی رجسٹرڈ (54095-S) • ایم بی بی ایس، ایم ڈی (نفسیات)"
                  : "PMDC Registered (54095-S) • MBBS, MD (Psychiatry)"}
              </span>
            </motion.div>

            {/* Direct primary headline */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-clinical-900 tracking-tight leading-[1.2] ${isUrdu ? "leading-normal" : ""}`}
              >
                {isUrdu ? (
                  <>
                    ایک محفوظ اور پُرسکون ماحول میں{" "}
                    <span className="text-clinical-600 italic font-medium relative block xl:inline">
                      مستند اور ہمدردانہ
                      <span className="absolute bottom-1 left-0 w-full h-1 bg-accent-gold/25 -z-1" />
                    </span>{" "}
                    ذہنی و نفسیاتی علاج
                  </>
                ) : (
                  <>
                    Professional Mental Health Care In A{" "}
                    <span className="text-clinical-600 italic font-medium relative block xl:inline">
                      Safe & Supportive
                      <span className="absolute bottom-1 left-0 w-full h-1 bg-accent-gold/25 -z-1" />
                    </span>{" "}
                    Environment
                  </>
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-base sm:text-lg text-clinical-600 leading-relaxed font-sans max-w-2xl"
              >
                {isUrdu
                  ? "شدید بے چینی (اینگزائٹی)، ڈپریشن، کام کے دباؤ، نیند کے مسائل، جذباتی تحفظ، اور ہر عمر کے چیلنجز کے لیے تسلی بخش اور مکمل خفیہ ذہنی صحت کی سہولت۔"
                  : "Compassionate psychiatric consultation for anxiety, depression, stress, sleep problems, emotional wellbeing, and mental health support."}
              </motion.p>
            </div>

            {/* Reassuring core trust points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 pt-2"
              id="hero-trust-list"
            >
              {trustPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4.5 h-4.5 text-clinical-500 shrink-0" />
                  <span className="text-clinical-700 text-sm font-medium">{point}</span>
                </div>
              ))}
            </motion.div>

            {/* Responsive visual CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-3"
              id="hero-ctas"
            >
              <button
                onClick={onBookClick}
                className="flex items-center justify-center gap-2.5 bg-clinical-700 text-white hover:bg-clinical-800 px-8 py-3.5 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer text-sm sm:text-base"
              >
                <Calendar className="w-5 h-5" />
                <span>{isUrdu ? "اپوائنٹمنٹ بک کریں" : "Book Consultation"}</span>
              </button>

              <a
                href="https://wa.me/923337030787?text=Hello%20Dr.%20Fahad%20Ul%20Zain,%20I%20would%20like%20to%20book%20a%20psychiatric%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-white text-clinical-800 hover:text-clinical-950 px-8 py-3.5 rounded-full font-medium transition-all duration-300 shadow-xs border border-clinical-200 hover:border-clinical-300 text-sm sm:text-base"
              >
                <MessageCircle className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                <span>{isUrdu ? "واٹس ایپ مشاورت" : "WhatsApp Consultation"}</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column Portrait Frame */}
          <div className="lg:col-span-12 xl:col-span-5 lg:block mt-8 lg:mt-0" id="hero-right">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative max-w-md mx-auto"
            >
              {/* Decorative accent frames */}
              <div className="absolute inset-4 -m-4 border border-accent-gold/30 rounded-3xl -z-10 transform rotate-2 pointer-events-none" />
              <div className="absolute inset-0 bg-clinical-100 rounded-3xl transform -rotate-1 -z-20 pointer-events-none" />

              {/* Main portrait image (No-referrer compliance) */}
              <div className="relative rounded-3xl overflow-hidden aspect-[3/4] shadow-xl border border-clinical-100 bg-clinical-50">
                <img
                  src="/images/dr-fahad-ul-zain-psychiatrist-nawabshah.jpg"
                  alt={isUrdu ? "ڈاکٹر فہد الزین" : "Dr. Fahad Ul Zain - Consultant Psychiatrist"}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
                  referrerPolicy="no-referrer"
                />

                {/* Safe overlay overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-clinical-950/45 via-transparent to-transparent pointer-events-none" />

                {/* Localized floaters for clinical proof */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className={`backdrop-blur-md bg-white/85 border border-white/20 p-4 rounded-2xl shadow-lg flex items-center gap-3 ${isUrdu ? "flex-row-reverse text-right" : ""}`}>
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 animate-pulse">
                      <ShieldCheck className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-clinical-500">
                        {isUrdu ? "ملاقاتی حق رساں رازداری" : "Patient First"}
                      </span>
                      <span className="block text-xs sm:text-sm font-semibold text-clinical-900 leading-tight">
                        {isUrdu ? "مکمل کلینکل رازداری کی سو فیصد ضمانت" : "Strict patient confidentiality guaranteed"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Float floating secondary credential badge */}
              <div className={`absolute -top-6 ${isUrdu ? "-left-5" : "-right-5"} backdrop-blur-md bg-accent-soft/90 border border-accent-gold/45 px-4 py-3 rounded-2xl shadow-lg hidden sm:flex items-center gap-2.5 animate-bounce-slow`}>
                <Sparkles className="w-5 h-5 text-accent-gold" />
                <div className={isUrdu ? "text-right" : "text-left"}>
                  <span className="block text-[10px] font-mono font-semibold tracking-wider text-accent-gold-dark uppercase leading-none">
                    {isUrdu ? "کلینک ڈائریکٹر" : "Clinic Director"}
                  </span>
                  <span className="block text-xs font-bold text-clinical-900 mt-1">
                    {isUrdu ? "والی سائیکاٹری سینٹر" : "Wali Psychiatry"}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
