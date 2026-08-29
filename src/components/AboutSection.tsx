import { Award, BookOpen, Quote, Sparkles, GraduationCap, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";


export default function AboutSection() {
  const { isUrdu, t } = useLanguage();

  const highlights = isUrdu ? [
    "امراضِ نفسیات کے اعلیٰ تعلیم یافتہ ماہر (MD)",
    "ذہنی و اعصابی امراض کے اسپیشلسٹ",
    "فعال طبی ریسرچ اسکالر",
    "سو فیصد سائنسی و طبی اصولوں پر مبنی علاج",
    "رازداری اور انسانی وقار کی پاسداری"
  ] : [
    "Consultant Psychiatrist (MD)",
    "Mental Health Specialist",
    "Active Research Scholar",
    "Evidence-Based Treatment Approach",
    "Patient Confidentiality & Empathy First"
  ];

  const qualifications = isUrdu ? [
    { code: "MBBS", label: "بیچلر آف میڈیسن، بیچلر آف سرجری (قائد اعظم میڈیکل کالج)" },
    { code: "MD (نفسیات)", label: "ڈاکٹر آف میڈیسن ان سائیکاٹری (ماہرِ امراضِ نفسيات) - لیاقت یونیورسٹی" },
    { code: "CHPE", label: "سرٹیفکیٹ ان ہیلتھ پروفیشنز ایجوکیشن" },
    { code: "CAMH-C", label: "چائلڈ اینڈ ایڈولیسنٹ کی ذہنی صحت کی فیلوشپ سرٹیفیکیشن" }
  ] : [
    { code: "MBBS", label: "Bachelor of Medicine, Bachelor of Surgery (QAMC)" },
    { code: "MD (Psychiatry)", label: "Doctor of Medicine in Psychiatry (Postgrad Specialist) - LUMHS" },
    { code: "CHPE", label: "Certificate in Health Professions Education" },
    { code: "CAMH-C", label: "Child & Adolescent Mental Health Certification" }
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${isUrdu ? "lg:direction-rtl" : ""}`}>

          {/* Left Column: Visual Collage or Side Banner */}
          <div className="lg:col-span-5 relative" id="about-visuals">
            <div className="relative max-w-sm mx-auto">
              <div className="absolute inset-0 bg-clinical-100 rounded-3xl transform rotate-3 pointer-events-none" />
              <div className="absolute inset-0 border-2 border-accent-gold/20 rounded-3xl transform -rotate-1 pointer-events-none" />

              {/* Profile Image card layout */}
              <div className="relative bg-clinical-50 shadow-md rounded-3xl overflow-hidden aspect-[4/5] border border-clinical-100">
                <img
                  src="/images/dr-fahad-ul-zain-consultant-psychiatrist.jpg"
                  alt="Dr. Fahad Ul Zain Clinical Consultation Portrait"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Float Badge */}
              <div className={`absolute bottom-6 ${isUrdu ? "-left-4" : "-right-4"} bg-white border border-clinical-100 p-4.5 rounded-2xl shadow-xl max-w-[200px]`}>
                <div className={`flex items-center gap-2 text-accent-gold-dark mb-1 font-semibold text-xs font-mono uppercase ${isUrdu ? "flex-row-reverse" : ""}`}>
                  <Sparkles className="w-4 h-4" />
                  <span>{isUrdu ? "اصولِ صحت" : "Clinical Ethos"}</span>
                </div>
                <p className={`text-xs font-medium text-clinical-600 leading-normal ${isUrdu ? "text-right" : "text-left"}`}>
                  {isUrdu ? "ہر گفتگو میں راز داری اور انسانی وقار کا احترام۔" : "Honoring human dignity in every conversation."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Authority Biography & Credentials */}
          <div className={`lg:col-span-7 space-y-8 ${isUrdu ? "text-right" : "text-left"}`} id="about-content">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent-gold-dark block">
                {t("about_subtitle")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-clinical-900 tracking-tight">
                {t("about_title")}
              </h2>
              <div className={`w-16 h-1 bg-accent-gold rounded-full ${isUrdu ? "mr-0" : ""}`} />
            </div>

            <p className="text-clinical-700 leading-relaxed text-base">
              {isUrdu ? t("about_bio_p1") : t("about_bio_p1")}
            </p>
            <p className="text-clinical-700 leading-relaxed text-base">
              {t("about_bio_p2")}
            </p>

            {/* Qualifications Matrix */}
            <div className="space-y-4">
              <h3 className={`text-sm font-mono font-bold uppercase tracking-wider text-clinical-500 flex items-center gap-2 ${isUrdu ? "flex-row-reverse text-right" : ""}`}>
                <GraduationCap className="w-4 h-4 text-clinical-500" />
                <span>{isUrdu ? "تعلیمی قابلیتیں اور اسناد" : "Degrees & Registered Qualifications"}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {qualifications.map((qual) => (
                  <div
                    key={qual.code}
                    className="flex flex-col bg-clinical-50/55 border border-clinical-100 p-4.5 rounded-xl hover:bg-clinical-50 transition-colors duration-200"
                  >
                    <span className="text-base font-serif font-semibold text-clinical-800">
                      {qual.code}
                    </span>
                    <span className="text-xs text-clinical-500 mt-1 leading-tight">
                      {qual.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Highlights List */}
            <div className="space-y-4">
              <h3 className={`text-sm font-mono font-bold uppercase tracking-wider text-clinical-500 flex items-center gap-2 ${isUrdu ? "flex-row-reverse text-right" : ""}`}>
                <Award className="w-4 h-4 text-clinical-500" />
                <span>{isUrdu ? "پیشہ ورانہ نمایاں معلومات" : "Professional Highlights"}</span>
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {highlights.map((item, idx) => (
                  <li key={idx} className={`flex items-start gap-2.5 ${isUrdu ? "flex-row-reverse text-right" : ""}`}>
                    <CheckCircle className="w-4.5 h-4.5 text-accent-gold shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-clinical-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Care Philosophy blockquote */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`relative bg-clinical-50/70 ${isUrdu ? "border-r-4 pr-6 pl-4 border-l-0 text-right rounded-l-2xl" : "border-l-4 pl-6 pr-4 text-left rounded-r-2xl"} border-accent-gold p-6 shadow-xs`}
              id="care-philosophy-card"
            >
              <Quote className={`absolute top-4 ${isUrdu ? "left-4 text-left" : "right-4 text-right"} w-12 h-12 text-accent-gold/10 pointer-events-none`} />
              <h4 className={`text-xs font-mono font-semibold text-accent-gold-dark uppercase tracking-widest mb-2 flex items-center gap-1.5 ${isUrdu ? "flex-row-reverse" : ""}`}>
                <span>{isUrdu ? "ملاقات کا اصول" : "Care Philosophy"}</span>
              </h4>
              <blockquote className="text-base sm:text-lg font-serif italic text-clinical-800 leading-relaxed font-semibold">
                "{t("about_philosophy_text")}"
              </blockquote>
              <cite className="block text-xs font-mono text-clinical-500 uppercase tracking-widest mt-3.5 not-italic">
                {isUrdu
                  ? "— ڈاکٹر فہد الزین، پی ایم ڈی سی رجسٹریشن: 54095-S"
                  : "— Dr. Fahad Ul Zain, PMDC Registration: 54095-S"}
              </cite>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
