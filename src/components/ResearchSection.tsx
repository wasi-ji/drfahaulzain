import { BookOpen, ExternalLink, GraduationCap, Award, Search, Sparkles, AlertCircle } from "lucide-react";
import { RESEARCH, DOCTOR_INFO } from "../data";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "motion/react";

export default function ResearchSection() {
  const { isUrdu } = useLanguage();

  const researchInterests = isUrdu ? [
    { title: "ذہنی کھچاؤ اور برن آؤٹ", desc: "ہیٹرک ڈیوٹی، تعلیمی بوجھ اور دفتری ملازمین میں مسلسل دباؤ کے اثرات اور ان سے پُرسکون نجات پر تحقیق۔" },
    { title: "بے خوابی اور باڈی کلاک بگاڑ", desc: "سندھ کے مختلف طبقات اور نوجوانوں میں دیر سے سونے کے امراض اور اس کے سائنسی تدارک کا طبی جائزہ۔" },
    { title: "مریض اور معالج کا شفیق رابطہ", desc: "بچے اور نو عمر افراد کے نفسیاتی معائنے کے دوران ہمدردی اور دوستانہ رابطے کے شاندار اثرات پر مقالہ۔" },
    { title: "مستند سائیکو فارماکولوجی", desc: "انتہائی معتدل دوز اور دورِ جدید کی کم ترین سائیڈ ایفیکٹس والی ادویات کے دیرپا اور مثبت نتائج پر تحقیق۔" }
  ] : [
    { title: "Psychological Distress & Burnout", desc: "Studying stressors and fatigue dynamics in critical medical occupations and healthcare departments." },
    { title: "Insomnia & Circadian Rhythm Issues", desc: "Evaluating post-crisis alterations in sleep depth among adult cohorts across Sindh." },
    { title: "Patient Communication", desc: "Analyzing communicative empathy variables across modern pediatric and adolescent psychiatric programs." },
    { title: "Evidence-Based Psychopharmacology", desc: "Evaluating symptom recovery timelines using safe, minor-dose clinical medications." }
  ];

  return (
    <section id="research" className="py-20 md:py-28 bg-clinical-50/50 relative overflow-hidden">
      {/* Decorative background grid vector */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-clinical-200/20 rounded-full filter blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center mb-16 ${isUrdu ? "lg:direction-rtl text-right" : "text-left"}`}>
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent-gold-dark block">
              {isUrdu ? "علمی و طبی خدمات" : "ACADEMIC CONTRIBUTIONS"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-clinical-900 tracking-tight">
              {isUrdu ? "ریسرچ اور سائنسی اشاعتیں" : "Research & Scientific Publications"}
            </h2>
            <div className={`w-16 h-1 bg-accent-gold rounded-full ${isUrdu ? "mr-0 ml-auto" : ""}`} />
            <p className="text-clinical-650 text-sm sm:text-base leading-relaxed">
              {isUrdu 
                ? "ڈاکٹر فہد الزین پاکستان کی معروف نفسیاتی سائنسی تحقیق اور طبی تعلیم میں ایک معتبر نام ہیں۔ ان کا کام نجی اور سرکاری طبقات میں ذہنی مسائل پر نظر رکھنا اور ان کے لئے بہترین روڈ میپ تجویز کرنا ہے۔"
                : "Dr. Fahad Ul Zain is an active contributor to psychiatric science and medical education. His work focuses on studying localized mental health stress, sleep hygiene, and improving psychiatric support delivery systems."}
            </p>
          </div>
          
          <div className="lg:col-span-4" id="google-scholar-integration">
            {/* Elegant Callout Card referencing Scholar ID */}
            <div className="backdrop-blur-md bg-white border border-clinical-150 p-6.5 rounded-3xl shadow-sm text-center flex flex-col justify-center gap-4">
              <div className="w-10 h-10 rounded-full bg-clinical-100 flex items-center justify-center text-clinical-600 mx-auto animate-pulse">
                <GraduationCap className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-clinical-900">
                  {isUrdu ? "گوگل سکالر پروفائل" : "Google Scholar Profile"}
                </h4>
                <p className="text-xs text-clinical-500 mt-1 leading-normal">
                  {isUrdu ? "تمام ریسرچ پیپرز اور تصدیق شدہ مقالے پڑھیں۔" : "Read live peer citations and complete article lists."}
                </p>
              </div>
              <a
                href={DOCTOR_INFO.scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full bg-clinical-700 hover:bg-clinical-800 text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl shadow-xs transition-colors duration-200 cursor-pointer"
              >
                <span>{isUrdu ? "پروفائل تلاش کریں" : "Browse Profile"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Commitment Statement banner */}
        <div className="bg-clinical-700 text-white p-8 md:p-12 rounded-3xl mb-16 relative overflow-hidden shadow-lg border border-clinical-800">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10 scale-150 pointer-events-none">
            <BookOpen className="w-72 h-72" />
          </div>
          <div className={`relative max-w-4xl space-y-4 ${isUrdu ? "text-right" : "text-left"}`}>
            <div className={`inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-mono font-medium ${isUrdu ? "flex-row-reverse" : ""}`}>
              <Sparkles className="w-3.5 h-3.5 text-accent-soft" />
              <span>{isUrdu ? "طبی ریسرچ کا مشن" : "Scientific Mission Statement"}</span>
            </div>
            <p className="text-lg sm:text-xl font-serif italic text-accent-soft leading-relaxed font-semibold">
              {isUrdu 
                ? "“ذہنی صحت کے کونسلنگ ٹرینڈز کو سائنسی تحقیق، تعلیمی کونسلنگ اور سو فیصد اخلاقی اصولوں کی مدد سے مستحکم کرنا میرا مشن ہے۔”"
                : '"Committed to advancing mental health care through research, education, and evidence-based psychiatric practice."'}
            </p>
            <div className={`flex flex-wrap gap-4 pt-2 text-xs text-white/75 font-mono ${isUrdu ? "justify-start flex-row-reverse" : ""}`}>
              <span>• {isUrdu ? "طبی ریسرچ اسکالر" : "Active Researcher in Psychiatry"}</span>
              <span>• {isUrdu ? "طبی اخلاقیات کے معاون" : "Medical Ethics Contributor"}</span>
              <span>• {isUrdu ? "مقامی ذہنی مسائل پر ریسرچ" : "Dedicated to Local Community Recovery Stats"}</span>
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 ${isUrdu ? "lg:direction-rtl" : ""}`}>
          {/* Left: Research Studies Publications (Zain FU et al.) */}
          <div className={`lg:col-span-7 space-y-6 ${isUrdu ? "text-right" : "text-left"}`} id="publications-container">
            <h3 className={`text-xs font-mono font-bold tracking-widest text-clinical-400 uppercase flex items-center gap-2 ${isUrdu ? "flex-row-reverse" : ""}`}>
              <BookOpen className="w-4 h-4 text-clinical-400" />
              <span>{isUrdu ? "منتخب کردہ ریسرچ آرٹیکلز" : "Selected Peer-Reviewed Publications"}</span>
            </h3>

            <div className="space-y-4">
              {RESEARCH.map((pub, idx) => (
                <motion.div
                  key={pub.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white border border-clinical-100 p-6 rounded-2xl shadow-xs hover:border-accent-gold/40 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className={`flex items-center justify-between flex-wrap gap-2 text-[11px] font-mono font-bold text-accent-gold-dark ${isUrdu ? "flex-row-reverse" : ""}`}>
                      <span>{pub.journal}</span>
                      <span>{pub.year}</span>
                    </div>

                    <h4 className="text-base sm:text-lg font-serif font-bold text-clinical-900 tracking-tight hover:text-clinical-700 transition-colors duration-150">
                      <a href={pub.googleScholarUrl} target="_blank" rel="noopener noreferrer">
                        {pub.title}
                      </a>
                    </h4>

                    <p className="text-xs text-clinical-450 italic mt-1 font-sans">
                      {isUrdu ? "محققین:" : "Authors:"} {pub.authors}
                    </p>

                    <p className="text-xs text-clinical-600 leading-relaxed font-sans mt-2">
                      {pub.citation}
                    </p>
                  </div>

                  <div className={`flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-clinical-50 ${isUrdu ? "justify-start" : ""}`}>
                    {pub.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-clinical-50 text-clinical-600 text-[9px] sm:text-[10px] font-semibold font-mono uppercase px-2 py-0.5 rounded-lg border border-clinical-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Research Interests & Methodologies */}
          <div className={`lg:col-span-5 space-y-6 ${isUrdu ? "text-right" : "text-left"}`} id="research-interests-container">
            <h3 className={`text-xs font-mono font-bold tracking-widest text-clinical-400 uppercase flex items-center gap-2 ${isUrdu ? "flex-row-reverse" : ""}`}>
              <Search className="w-4 h-4 text-clinical-400" />
              <span>{isUrdu ? "نفسیاتی تحقیق کے خاص میدان" : "Core Psychiatry Research Interests"}</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {researchInterests.map((interest, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 border border-clinical-100 p-5 rounded-2xl shadow-xs hover:bg-white transition-all duration-200"
                >
                  <h4 className="text-sm font-semibold text-clinical-850">
                    {interest.title}
                  </h4>
                  <p className="text-xs text-clinical-600 leading-relaxed mt-1">
                    {interest.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Scholar Citation note */}
            <div className={`bg-accent-soft/75 border border-accent-gold/25 p-5 rounded-2xl flex gap-3 ${isUrdu ? "flex-row-reverse" : ""}`}>
              <AlertCircle className="w-5 h-5 text-accent-gold-dark shrink-0 mt-0.5" />
              <p className="text-xs text-clinical-700 leading-relaxed">
                {isUrdu ? (
                  <>
                    مستقل طبی تحقیق اور نئی عالمی ریسرچ کی بدولت، ڈاکٹر فہد الزین بین الاقوامی سطح کے جدید نفسیاتی علاج براہِ راست <strong>والی سائیکاٹری سینٹر</strong> نوابشاہ پر لاگو کرتے ہیں۔
                  </>
                ) : (
                  <>
                    By maintaining active research operations, Dr. Fahad integrates the latest international psychiatry protocols directly into treatments served at <strong>Wali Psychiatry Centre</strong> Nawabshah, ensuring world-class mental health support.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
