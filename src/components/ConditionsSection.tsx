import { useState } from "react";
import {
  ShieldAlert,
  CloudRain,
  Zap,
  Flame,
  Moon,
  Heart,
  Compass,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { Condition } from "../types";

const iconMap: Record<string, any> = {
  ShieldAlert,
  CloudRain,
  Zap,
  Flame,
  Moon,
  Heart,
  Compass,
  Sparkles
};

interface ConditionsSectionProps {
  onBookClick: () => void;
}

export default function ConditionsSection({ onBookClick }: ConditionsSectionProps) {
  const { isUrdu, t, localizedConditions } = useLanguage();
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);

  return (
    <section id="conditions" className="py-20 md:py-28 bg-clinical-50/50 relative">
      {/* Background decoration */}
      <div className="absolute top-10 right-0 w-64 h-64 bg-accent-soft/40 rounded-full filter blur-3xl -z-1 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16" id="conditions-header">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent-gold-dark block">
            {isUrdu ? "طبی اختصاصیات" : "CLINICAL SPECIALTIES"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-clinical-900 tracking-tight">
            {isUrdu ? "جن امراض کا علاج کیا جاتا ہے" : "Conditions Treated"}
          </h2>
          <div className="w-16 h-1 bg-accent-gold mx-auto rounded-full" />
          <p className="text-clinical-600 text-sm sm:text-base leading-relaxed">
            {isUrdu 
              ? "مخصوص طبی مشاہدے اور جدید سائنسی طریقوں کی مدد سے ہر طرح کے اعصابی، ذہنی اور جذباتی مسائل کا علاج مروجہ رازداری کے اصولوں کے تحت کیا جاتا ہے۔"
              : "Providing empathetic, confidential support for a wide spectrum of psychocognitive and emotional issues using personalized, scientific strategies."}
          </p>
        </div>

        {/* Grid Cards list */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${isUrdu ? "direction-rtl" : ""}`} id="conditions-grid">
          {localizedConditions.map((condition, idx) => {
            const IconComponent = iconMap[condition.iconName] || ShieldAlert;
            return (
              <motion.div
                key={condition.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={`bg-white border border-clinical-100 rounded-2xl p-6.5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group ${isUrdu ? "text-right" : "text-left"}`}
              >
                <div className="space-y-4">
                  {/* Icon Frame */}
                  <div className={`w-12 h-12 rounded-xl bg-clinical-100/60 flex items-center justify-center text-clinical-600 transition-colors duration-300 group-hover:bg-clinical-600 group-hover:text-white ${isUrdu ? "ml-auto" : "mr-auto"}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-clinical-800 tracking-tight transition-colors duration-200 group-hover:text-clinical-900">
                      {condition.title}
                    </h3>
                    <p className="text-xs text-clinical-500 mt-2 line-clamp-3 leading-relaxed">
                      {condition.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setSelectedCondition(condition)}
                    className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent-gold-dark hover:text-accent-gold-dark/80 transition-colors duration-150 group/btn cursor-pointer ${isUrdu ? "flex-row-reverse" : ""}`}
                  >
                    <span>{isUrdu ? "علامات اور حل" : "Learn Symptoms"}</span>
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isUrdu ? "rotate-180 group-hover/btn:-translate-x-1" : "group-hover/btn:translate-x-1"}`} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Reassuring Detail Modal */}
      <AnimatePresence>
        {selectedCondition && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCondition(null)}
              className="absolute inset-0 bg-clinical-950/40 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-clinical-100 z-10"
              id="condition-modal"
            >
              {/* Decorative top bar */}
              <div className="h-2 bg-clinical-600 w-full" />

              <div className={`p-6 sm:p-8 space-y-6 ${isUrdu ? "text-right" : "text-left"}`}>
                {/* Header with Title and Close */}
                <div className={`flex items-center justify-between pb-4 border-b border-clinical-100 ${isUrdu ? "flex-row-reverse" : ""}`}>
                  <div className={`flex items-center gap-3 ${isUrdu ? "flex-row-reverse" : ""}`}>
                    <div className="w-10 h-10 rounded-lg bg-clinical-50 flex items-center justify-center text-clinical-600">
                      {(() => {
                        const IconComponent = iconMap[selectedCondition.iconName] || ShieldAlert;
                        return <IconComponent className="w-5 h-5" />;
                      })()}
                    </div>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-clinical-900 tracking-tight">
                      {selectedCondition.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedCondition(null)}
                    className="p-1.5 rounded-full hover:bg-clinical-50 text-clinical-400 hover:text-clinical-700 transition-all duration-150 cursor-pointer"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-clinical-600 leading-relaxed">
                  {selectedCondition.description}
                </p>

                {/* Symptoms Checklist */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-clinical-500 uppercase tracking-widest">
                    {isUrdu ? "صحت کے مسائل کی عام علامات:" : "Common Symptoms to Monitor:"}
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedCondition.symptoms.map((symptom, sIdx) => (
                      <div key={sIdx} className={`flex items-start gap-2.5 ${isUrdu ? "flex-row-reverse" : ""}`}>
                        <CheckCircle2 className="w-4 h-4 text-accent-gold mt-0.5 shrink-0" />
                        <span className="text-sm text-clinical-700 leading-normal">{symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reassuring Clinical Note box */}
                <div className={`bg-clinical-50/70 p-4.5 ${isUrdu ? "border-r-4 border-accent-gold rounded-l-2xl border-l-0" : "border-l-4 border-clinical-600 rounded-r-2xl border-r-0"}`}>
                  <p className="text-xs italic text-clinical-800 leading-relaxed font-semibold">
                    "{selectedCondition.reassuringNote}"
                  </p>
                </div>

                {/* Action buttons inside modal */}
                <div className={`flex flex-col sm:flex-row gap-3 pt-2 ${isUrdu ? "sm:flex-row-reverse" : ""}`}>
                  <button
                    onClick={() => {
                      setSelectedCondition(null);
                      onBookClick();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-clinical-700 hover:bg-clinical-800 text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors duration-200 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{isUrdu ? "ملاقات کا وقت طے کریں" : "Schedule Consultation"}</span>
                  </button>
                  <button
                    onClick={() => setSelectedCondition(null)}
                    className="sm:flex-none border border-clinical-200 hover:bg-clinical-50 text-clinical-700 font-semibold text-xs sm:text-sm py-3 px-6 rounded-xl transition-all duration-150 cursor-pointer"
                  >
                    {isUrdu ? "بند کریں" : "Close Window"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
