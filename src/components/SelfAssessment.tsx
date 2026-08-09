import { useState } from "react";
import { ArrowRight, RotateCcw, ShieldCheck, HeartPulse, HelpCircle, MessageSquareWarning } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

interface SelfAssessmentProps {
  onBookClick: () => void;
}

export default function SelfAssessment({ onBookClick }: SelfAssessmentProps) {
  const { isUrdu, t, localizedQuestions } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionSelect = (score: number) => {
    const qId = localizedQuestions[currentStep].id;
    setScores((prev) => ({ ...prev, [qId]: score }));

    if (currentStep < localizedQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setScores({});
    setIsFinished(false);
  };

  // Compute stats
  const totalScore: number = Object.keys(scores).reduce((acc: number, key: string) => {
    return acc + (scores[Number(key)] || 0);
  }, 0);
  const maxPossibleScore: number = localizedQuestions.length * 3;

  // Derive feedback based on PHQ/GAD standards
  const getResults = () => {
    if (totalScore <= 3) {
      return {
        level: isUrdu ? "معمولی ذہنی تناؤ (کم خطرہ)" : "Minimal Psychological Stress",
        colorClass: "text-emerald-700 bg-emerald-50 border-emerald-200",
        gaugeColor: "bg-emerald-500",
        guidance: isUrdu
          ? "آپ کے جوابات بہت پرسکون اور متوازن ذہنی حالت کی عکاسی کرتے ہیں۔ روزمرہ کی زندگی میں چیلنجز تو آتے ہیں، لیکن مجموعی طور پر آپ کی اینگزائٹی اور نیند بہت صحت مند حد میں ہیں۔ مثبت طرزِ زندگی برقرار رکھیں۔"
          : "Your responses suggest a balanced state of wellness with low anxiety and healthy sleep margins. Life transitions can still bring occasional worries. Retaining healthy boundaries is recommended.",
        primaryAction: isUrdu ? "ذہنی تندرستی کے مزید اصول جانیں" : "Learn Mental Wellness Best Practices"
      };
    } else if (totalScore <= 8) {
      return {
        level: isUrdu ? "ہلکا جذباتی کھچاؤ یا بے چینی" : "Mild Emotional Turbulence",
        colorClass: "text-yellow-700 bg-yellow-50/70 border-yellow-250",
        gaugeColor: "bg-yellow-500",
        guidance: isUrdu
          ? "آپ کو ہلکی سی بے چینی، تھکن یا نیند کی معمولی کمی کا سامنا ہے، جو نوکری، خاندانی بوجھ، یا نیند کے بگاڑ کی وجہ سے ہو سکتا ہے۔ ڈاکٹر فہد کے ساتھ ایک حفاظتی کونسلنگ سیشن ان علامات کو بڑھنے سے فلیٹ منقطع کر سکتا ہے۔"
          : "You are experiencing minor anxiety bounds or sporadic fatigue periods. This is a very common reaction to stress, job overload, or poor circadian sleep hygiene. Exploring gentle therapy or professional guidance can stop symptoms from consolidating.",
        primaryAction: isUrdu ? "حفاظتی کونسلنگ بک کریں" : "Book Calm-Level Preventative Consultation"
      };
    } else {
      return {
        level: isUrdu ? "درمیانے سے شدید درجے کی کیفیت" : "Moderate-to-High Diagnostic Distress",
        colorClass: "text-rose-700 bg-rose-50 border-rose-250",
        gaugeColor: "bg-rose-500",
        guidance: isUrdu
          ? "آپ کے نتائج سے معلوم ہوتا ہے کہ آپ حالیہ عرصے میں کافی زیادہ بے چینی، اداسی، پینک یا شدید تھکن محسوس کر رہے ہیں، جِس کی وجہ سے آپ کی ذاتی لائف اور کام متاثر ہو رہا ہے۔ پریشان نہ ہوں، یہ کیمیکل تبدیلیاں سوفیصد قابلِ کامیابی علاج ہیں۔"
          : "Your responses indicate active, heavy stress, panic alertness, or mood exhaustion that might be significantly disrupting your work, rest, or relationships. Please rest assured: these are fully treatable chemical conditions that respond highly to unhurried medical-grade evaluation.",
        primaryAction: isUrdu ? "باقاعدہ تفصیلی چیک اپ کی درخواست" : "Request Swift Diagnostic Evaluation"
      };
    }
  };

  const currentQuestion = localizedQuestions[currentStep];
  const progressPercent = Math.round(((currentStep) / localizedQuestions.length) * 100);

  const results = getResults();

  return (
    <section id="assessment" className="py-20 md:py-28 bg-white relative">
      {/* Visual backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-clinical-50/50 rounded-full filter blur-3xl -z-10" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent-gold-dark block">
            {t("assessment_subtitle")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-clinical-900 tracking-tight">
            {t("assessment_title")}
          </h2>
          <div className="w-16 h-1 bg-accent-gold mx-auto rounded-full" />
          <p className="text-clinical-600 text-sm max-w-xl mx-auto leading-relaxed">
            {t("assessment_intro_text")}
          </p>
        </div>

        {/* Dynamic Quiz Card */}
        <div className="bg-white border border-clinical-155/70 rounded-3xl shadow-lg p-6 sm:p-10 relative overflow-hidden" id="assessment-panel">
          
          <AnimatePresence mode="wait">
            {!isFinished ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: -15, x: -15 }}
                transition={{ duration: 0.3 }}
                className={`space-y-6 ${isUrdu ? "text-right" : "text-left"}`}
              >
                {/* Question index tracker */}
                <div className={`flex items-center justify-between text-xs font-mono text-clinical-400 ${isUrdu ? "flex-row-reverse" : ""}`}>
                  <span>
                    {isUrdu 
                      ? `سوال ${currentStep + 1} کل ${localizedQuestions.length} میں سے` 
                      : `QUESTION ${currentStep + 1} OF ${localizedQuestions.length}`}
                  </span>
                  <span className="font-semibold">{progressPercent}% {isUrdu ? "کمل" : "COMPLETED"}</span>
                </div>

                {/* Progress bar line */}
                <div className="w-full h-1 bg-clinical-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-clinical-600 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Question statement */}
                <div className="space-y-2.5">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-accent-gold-dark uppercase bg-accent-soft px-2.5 py-1 rounded-full ${isUrdu ? "flex-row-reverse" : ""}`}>
                    <HelpCircle className="w-3 h-3" />
                    <span>{isUrdu ? "توجہ کا شعبہ:" : "Focus area:"} {currentQuestion.category}</span>
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-clinical-900 leading-normal">
                    {currentQuestion.text}
                  </h3>
                </div>

                {/* Action Options list */}
                <div className="grid grid-cols-1 gap-3.5 pt-4">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => handleOptionSelect(option.score)}
                      className={`w-full text-left bg-clinical-50/40 hover:bg-clinical-50 border border-clinical-100/70 hover:border-clinical-200.5 p-4 sm:p-5 rounded-2xl transition-all duration-150 flex items-center justify-between group cursor-pointer ${isUrdu ? "flex-row-reverse" : ""}`}
                    >
                      <span className="text-sm font-medium text-clinical-700 transition-colors duration-200 group-hover:text-clinical-900">
                        {option.label}
                      </span>
                      <ArrowRight className={`w-4 h-4 text-clinical-300 transition-transform duration-200 ${isUrdu ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"} group-hover:text-clinical-600`} />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Finish Screen with Detailed Report results */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className={`space-y-8 ${isUrdu ? "text-right" : "text-left"}`}
                id="assessment-results"
              >
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-clinical-100 flex items-center justify-center text-clinical-600 mx-auto">
                    <HeartPulse className="w-6.5 h-6.5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-clinical-900">
                      {t("assessment_your_results")}
                    </h3>
                    <p className="text-xs text-clinical-400 font-mono">
                      COMPILATION ID: WE-{Math.floor(1000 + Math.random() * 9000)}-Z
                    </p>
                  </div>
                </div>

                {/* Colorized Status card */}
                <div className={`border p-6 rounded-2xl ${results.colorClass} flex flex-col md:flex-row items-center justify-between gap-6 ${isUrdu ? "md:flex-row-reverse" : ""}`}>
                  <div className={`space-y-1 text-center ${isUrdu ? "md:text-right" : "md:text-left"}`}>
                    <span className="text-xs font-mono font-bold tracking-wider uppercase block">
                      {isUrdu ? "مجموعی نتیجہ:" : "Current Index Result:"}
                    </span>
                    <h4 className="text-base sm:text-lg font-serif font-bold text-clinical-900 leading-tight">
                      {results.level}
                    </h4>
                  </div>
                  <div className={`text-center ${isUrdu ? "md:text-left" : "md:text-right"}`}>
                    <span className="block text-2xl font-serif font-bold text-clinical-900">
                      {totalScore} <span className="text-xs text-clinical-500 font-sans font-normal">/ {maxPossibleScore}</span>
                    </span>
                    <span className="block text-[10px] uppercase font-mono tracking-widest text-clinical-500">
                      {isUrdu ? "نفسیاتی اسکور" : "Psychological Score"}
                    </span>
                  </div>
                </div>

                {/* Score scale visual bar */}
                <div className="space-y-2">
                  <div className={`flex justify-between text-[11px] font-mono uppercase text-clinical-400 ${isUrdu ? "flex-row-reverse" : ""}`}>
                    <span>{isUrdu ? "صحت مند (0-3)" : "Healthy Ranges (0-3)"}</span>
                    <span>{isUrdu ? "ہلکا تناؤ (4-8)" : "Mild (4-8)"}</span>
                    <span>{isUrdu ? "تفصیلی معائنہ (9+)" : "Critical Alert (9+)"}</span>
                  </div>
                  <div className="w-full h-2.5 bg-clinical-100 rounded-full overflow-hidden flex gap-0.5">
                    <div className="h-full bg-emerald-400 flex-1" style={{ maxWidth: '25%' }} />
                    <div className="h-full bg-yellow-400 flex-1" style={{ maxWidth: '40%' }} />
                    <div className="h-full bg-rose-400 flex-1" style={{ maxWidth: '35%' }} />
                  </div>
                  {/* Active node cursor overlay */}
                  <div className="h-1 w-full relative">
                    <div
                      className="absolute -top-1 w-3 h-3 rounded-full bg-clinical-700 shadow-sm transition-all duration-500"
                      style={{ 
                        left: isUrdu
                          ? `${100 - (totalScore / maxPossibleScore) * 100}%`
                          : `${(totalScore / maxPossibleScore) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Medical Guidance copy */}
                <div className="space-y-3">
                  <div className={`flex items-center gap-2 text-xs font-mono font-bold text-clinical-500 uppercase ${isUrdu ? "flex-row-reverse" : ""}`}>
                    <MessageSquareWarning className="w-4.5 h-4.5 text-clinical-500" />
                    <span>{isUrdu ? "طبی مشاورتی رائے" : "Empathetic Doctor's Commentary"}</span>
                  </div>
                  <p className="text-sm text-clinical-700 leading-relaxed font-sans mt-1">
                    {results.guidance}
                  </p>
                </div>

                {/* Reassuring note footer */}
                <div className={`bg-clinical-50/60 p-4 rounded-xl flex items-start gap-3 ${isUrdu ? "flex-row-reverse" : ""}`}>
                  <ShieldCheck className="w-5 h-5 text-accent-gold-dark shrink-0 mt-0.5" />
                  <p className="text-xs text-clinical-600 leading-relaxed">
                    <strong>{isUrdu ? "رازداری کا حلف:" : "Confidence Pledge:"}</strong>{" "}
                    {isUrdu 
                      ? "یہ تشخیصی ویب سائٹ آپ کا کوئی بھی ڈیٹا یا فائلز شیئر یا محفوظ نہیں کرتی۔ صحت یابی کا سفر دانشمندانہ فیصلوں سے شروع ہوتا ہے۔"
                      : "This assessment tool does not share files or logs. Reclaiming absolute mental resilience starts with small diagnostic evaluations. Healing is safely within your reach."}
                  </p>
                </div>

                {/* Reset or Book Actions */}
                <div className={`flex flex-col sm:flex-row gap-4 pt-2 ${isUrdu ? "sm:flex-row-reverse" : ""}`}>
                  <button
                    onClick={onBookClick}
                    className="flex-1 flex items-center justify-center gap-2 bg-clinical-700 hover:bg-clinical-800 text-white py-3.5 px-6 rounded-xl font-semibold shadow-xs transition-colors duration-200 cursor-pointer text-xs sm:text-sm"
                  >
                    <span>{results.primaryAction}</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className={`sm:flex-none border border-clinical-200 text-clinical-600 hover:text-clinical-900 hover:bg-clinical-50 py-3.5 px-5 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${isUrdu ? "flex-row-reverse" : ""}`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isUrdu ? "دوبارہ ٹیسٹ شروع کریں" : "Retake screener"}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
