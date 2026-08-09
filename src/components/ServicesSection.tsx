import {
  ClipboardCheck,
  Pill,
  Activity,
  RefreshCw,
  Clock,
  Check,
  UserCheck,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "motion/react";

const iconMap: Record<string, any> = {
  ClipboardCheck,
  Pills: Pill,
  Activity,
  RefreshCw
};

interface ServicesSectionProps {
  onBookClick: () => void;
}

export default function ServicesSection({ onBookClick }: ServicesSectionProps) {
  const { isUrdu, t, localizedTreatments } = useLanguage();

  const specificTreatments = isUrdu ? [
    { title: "تفصیلی نفسیاتی معائنہ", desc: "مرض کی جڑ تک پہنچنے کے لئے فیملی اور ذاتی پس منظر کا بے حد سست رفتار اور تفصیلی طبی جائزہ۔" },
    { title: "ذہنی صحت کی کونسلنگ", desc: "روزمرہ کی الجھنوں، وہم یا ناامیدی کے بوجھ کو کم کرنے کے لئے شفیق اور محفوظ مشاورت۔" },
    { title: "ادویات کا سائنسی انتظام", desc: "انتہائی جدید، محفوظ اور بے حد معتدل ادویات کا ہلکی ترین دوز سے انتخاب اور تسلی بخش معائنہ۔" },
    { title: "بے چینی (اینگزائٹی) کا حل", desc: "سینے کی گھبراہٹ، خوف اور ہاتھ پیر کانپنے کے جسمانی و ذہنی علاج کے لئے مستند پلان۔" },
    { title: "ڈپریشن کا علاج", desc: "دماغ کی کیمیائی ہارمونز کو درست طبی طریقہ کار اور کسٹمر تھراپی کے امتزاج سے متوازن لہروں پر لانا۔" },
    { title: "سٹریس اور برن آؤٹ مینیجمنٹ", desc: "نوکری، کاروبار یا پڑھائی کے مغلوب کرنے والے دباؤ سے محفوظ نجات اور نئی توانائی کا احساس۔" },
    { title: "نیند کے امراض کا تدارک", desc: "بغیر کسی نشے کے عادات باڈی کلاک کی بحالی اور بستر پر جانے کی گھبراہٹ کا مکمل خاتمہ۔" },
    { title: "فالو اپ اور مستقل سرورز", desc: "صحت یابی کے بعد ادویات کو کم سے کم کرنے اور ان سے باحفاظت سست رفتاری سے چھٹکارا دلانے کے فالو اپ سیشنز۔" }
  ] : [
    { title: "Psychiatric Evaluation", desc: "In-depth history check to establish accurate neurological diagnostics." },
    { title: "Mental Health Consultation", desc: "Expert assessment for persistent worries, emotional blockades, or mood drops." },
    { title: "Medication Management", desc: "Calibrated conservative medical plans with regular, safe tuning." },
    { title: "Anxiety Treatment", desc: "Evidence-backed pharmacotherapy linked with targeted cognitive stabilizing guides." },
    { title: "Depression Treatment", desc: "Restoring neural neurotransmitter equilibrium using modern medicines." },
    { title: "Stress Management", desc: "Restoring active stress boundaries to cure physiological exhaustion & burnout." },
    { title: "Sleep Disorder Management", desc: "Tackling circadian dysregulation, waking anxieties, and nightmare issues." },
    { title: "Follow-up Care", desc: "Continuous routine feedback check-ins to monitor long-term safety and tapering." }
  ];

  return (
    <section id="treatments" className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20" id="services-header">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent-gold-dark block">
            {isUrdu ? "طبی راستے" : "CLINICAL PATHWAYS"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-clinical-900 tracking-tight">
            {isUrdu ? "علاج کے مربوط اور محفوظ طریقہ کار" : "Comprehensive Treatments"}
          </h2>
          <div className="w-16 h-1 bg-accent-gold mx-auto rounded-full" />
          <p className="text-clinical-600 text-sm sm:text-base leading-relaxed">
            {isUrdu 
              ? "مریض اور معالج کے درمیان ایک پُراعتماد تعلق کے ذریعے حیاتیاتی توازن کی بحالی اور جدید سائنسی اصولوں کے عین مطابق بہترین نفسیاتی علاج۔"
              : "Professional psychiatric care tailored to your unique history, combining modern biological treatments with a highly supportive doctor-patient bond."}
          </p>
        </div>

        {/* Primary Pathway Panels */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 ${isUrdu ? "direction-rtl" : ""}`} id="primary-treatments-grid">
          {localizedTreatments.map((treatment, idx) => {
            const IconComponent = iconMap[treatment.iconName] || ClipboardCheck;
            return (
              <motion.div
                key={treatment.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -25 : 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className={`bg-clinical-50/50 hover:bg-clinical-50 border border-clinical-100/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${isUrdu ? "text-right" : "text-left"}`}
              >
                <div className="space-y-6">
                  {/* Top line banner */}
                  <div className={`flex items-center gap-4 ${isUrdu ? "flex-row-reverse" : ""}`}>
                    <div className="w-12 h-12 rounded-2xl bg-clinical-100 flex items-center justify-center text-clinical-600 shadow-xs shrink-0">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-clinical-900 leading-tight">
                        {treatment.title}
                      </h3>
                      <span className="text-[10px] font-mono font-bold text-accent-gold-dark uppercase tracking-wide">
                        {isUrdu ? "طبی معائنے کا اعلیٰ معیار" : "Clinical Standard Pathway"}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-clinical-700 leading-relaxed font-sans">
                    {treatment.description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="text-xs font-mono font-semibold tracking-wider uppercase text-clinical-500">
                      {isUrdu ? "علاج سے حاصل ہونے والے نتائج:" : "Key Healing Outcomes:"}
                    </h4>
                    <ul className="grid grid-cols-1 gap-2.5">
                      {treatment.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className={`flex items-start gap-2 text-sm text-clinical-700 ${isUrdu ? "flex-row-reverse" : ""}`}>
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-tight">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={`pt-8 border-t border-clinical-100/60 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 ${isUrdu ? "sm:flex-row-reverse" : ""}`}>
                  <div className={`w-full sm:w-auto ${isUrdu ? "text-right" : "text-left"}`}>
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-clinical-400">
                      {isUrdu ? "یہ علاج کس کے لئے مناسب ہے؟" : "Ideal Candidates"}
                    </span>
                    <span className="block text-xs font-medium text-clinical-600 leading-normal mt-0.5 max-w-[280px]">
                      {treatment.suitableFor}
                    </span>
                  </div>
                  <button
                    onClick={onBookClick}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-clinical-700/10 hover:bg-clinical-700 hover:text-white text-clinical-800 transition-all duration-200 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer font-mono"
                  >
                    <span>{isUrdu ? "تقاضہ معلومات" : "Request Info"}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic treatment checklist grid (Ensures 100% checklist mapping) */}
        <div className="bg-clinical-50/25 border border-clinical-100 rounded-3xl p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-10">
            <h3 className="text-xl font-serif font-bold text-clinical-900">
              {isUrdu ? "انفرادی تشخیصی اور تھراپی مینیو" : "Personalized Treatment Modal Grid"}
            </h3>
            <p className="text-xs text-clinical-500 font-mono tracking-wider">
              {isUrdu 
                ? "طبی سائنٹفک اصول • محفوظ دوز • رازدارانہ فکشن"
                : "EVIDENCE-BASED • TAILORED DOSES • EMPATHETIC DIALOGUE"}
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${isUrdu ? "direction-rtl text-right" : "text-left"}`}>
            {specificTreatments.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-clinical-100 p-5 rounded-2xl shadow-xs flex flex-col gap-2.5 hover:shadow-sm transition-all duration-200"
              >
                <div className={`flex items-center gap-2 ${isUrdu ? "flex-row-reverse" : ""}`}>
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-gold shrink-0" />
                  <h4 className="text-sm font-semibold text-clinical-850 leading-tight">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs text-clinical-600 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
