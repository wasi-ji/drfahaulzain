import { MapPin, Phone, GraduationCap, Heart, ArrowUp, CalendarClock } from "lucide-react";
import { DOCTOR_INFO } from "../data";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { isUrdu, t } = useLanguage();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const seoTags = isUrdu
    ? [
      "نوابشاہ میں ماہر نفسیات",
      "حیدرآباد میں ماہر امراض نفسيات",
      "ڈپریشن کا سائنسی علاج",
      "اینگزائٹی اور گھبراہٹ کا علاج",
      "بے خوابی کا طبی علاج",
      "ڈاکٹر فہد الزین",
      "پیر سے جمعہ او پی ڈی",
      "اتوار کی او پی ڈی",
      "رازداری کے ساتھ کونسلنگ",
      "ذہنی برن آؤٹ"
    ]
    : [
      "Psychiatrist in Nawabshah",
      "Psychiatrist in Hyderabad",
      "Mental Health Specialist",
      "Anxiety Treatment",
      "Depression Treatment",
      "Consultant Psychiatrist",
      "Mental Health Clinic",
      "Psychiatric Consultation",
      "Sleep Disorder Treatment",
      "Stress Management"
    ];

  return (
    <footer className="bg-clinical-950 text-slate-200 border-t border-clinical-800 pt-16 pb-8" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 ${isUrdu ? "direction-rtl text-right" : "text-left"}`}>

          {/* Col 1: Brand Info */}
          <div className="space-y-4" id="footer-col-1">
            <div className={`flex items-center gap-2.5 ${isUrdu ? "flex-row-reverse" : ""}`}>
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0">
                <Heart className="w-4.5 h-4.5 fill-white/20" />
              </div>
              <span className="text-xl font-serif font-bold text-white tracking-tight">
                {isUrdu ? "ڈاکٹر فہد الزین" : "Dr. Fahad Ul Zain"}
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans font-normal">
              {t("footer_desc")}
            </p>
            <div className={`text-xs font-mono text-amber-300 font-bold ${isUrdu ? "text-right" : "text-left"}`}>
              {isUrdu ? "پی ایم ڈی سی نمبر: 54095-S" : `PMDC Reg: ${DOCTOR_INFO.pmdc}`}
            </div>
          </div>

          {/* Col 2: Timings Hours */}
          <div className="space-y-4" id="footer-col-2">
            <h4 className={`text-xs font-mono uppercase font-bold text-amber-400 tracking-widest flex items-center gap-1.5 ${isUrdu ? "flex-row-reverse" : ""}`}>
              <CalendarClock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{isUrdu ? "ملاقات کے اوقات" : "Consultation Times"}</span>
            </h4>
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="block font-semibold text-white text-sm">
                  {isUrdu ? "ولی سائیکاٹری نوابشاہ" : "Wali Psychiatry Nawabshah"}
                </span>
                <span className="block text-slate-200 mt-1 font-sans">
                  {isUrdu ? "سوموار تا جمعہ: 4:00 PM سے 9:00 PM" : "Mon – Fri: 4:00 PM – 9:00 PM"}
                </span>
              </div>
              <div>
                <span className="block font-semibold text-white text-sm">
                  {isUrdu ? "حیدرآباد سنڈے کلینک" : "Hyderabad Sunday Clinic"}
                </span>
                <span className="block text-slate-200 mt-1 font-sans">
                  {isUrdu ? "ہر اتوار: 2:00 PM سے 5:00 PM" : "Sunday: 2:00 PM – 5:00 PM"}
                </span>
              </div>
            </div>
          </div>

          {/* Col 3: Addresses Info */}
          <div className="space-y-4" id="footer-col-3">
            <h4 className={`text-xs font-mono uppercase font-bold text-amber-400 tracking-widest flex items-center gap-1.5 ${isUrdu ? "flex-row-reverse" : ""}`}>
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{isUrdu ? "کلینکل پتے" : "Clinic Addresses"}</span>
            </h4>
            <div className="space-y-3.5 text-xs">
              <div className={`flex gap-2.5 items-start ${isUrdu ? "flex-row-reverse text-right" : ""}`}>
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-200 font-sans leading-relaxed">
                  {isUrdu
                    ? "والی سائیکاٹری سینٹر، پلاٹ 68، محمدی ٹاؤن، ابو آئل مل کے سامنے، زیرو پوائنٹ کے قریب، نوابشاہ"
                    : "Wali Psychiatry Center, Plot 68, Mohammadi Town, opposite Abu Oil Mill, near Zero Point, Nawabshah"}
                </span>
              </div>
              <div className={`flex gap-2.5 items-start ${isUrdu ? "flex-row-reverse text-right" : ""}`}>
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-200 font-sans leading-relaxed">
                  {isUrdu ? "حیدرآباد کنسلٹیشن کلینک، حیدرآباد سٹی" : "Hyderabad Consultation Clinic, Hyderabad City"}
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: Rapid Contact */}
          <div className="space-y-4" id="footer-col-4">
            <h4 className="text-xs font-mono uppercase font-bold text-amber-400 tracking-widest">
              {isUrdu ? "رابطہ کے ذرائع" : "Direct Channels"}
            </h4>
            <div className="space-y-3.5 text-xs">
              <a href={`tel:${DOCTOR_INFO.phone.replace(/\s+/g, '')}`} className={`flex gap-2.5 items-center hover:text-white transition-colors text-slate-200 ${isUrdu ? "flex-row-reverse" : ""}`}>
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-left font-sans font-medium">{DOCTOR_INFO.phone}</span>
              </a>
              <a
                href="https://wa.me/923337030787?text=Hello%20Dr.%20Fahad%20Ul%20Zain%2C%20I%20would%20like%20to%20book%20a%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                className={`flex gap-2.5 items-center hover:text-white transition-colors text-emerald-300 font-medium ${isUrdu ? "flex-row-reverse" : ""}`}
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isUrdu ? "واٹس ایپ اپوائنٹمنٹ (+92 333 7030787)" : "WhatsApp (+92 333 7030787)"}</span>
              </a>
              <a href={DOCTOR_INFO.scholarUrl} target="_blank" rel="noopener noreferrer" className={`flex gap-2.5 items-center hover:text-amber-200 transition-colors text-amber-300 font-medium ${isUrdu ? "flex-row-reverse" : ""}`}>
                <GraduationCap className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{isUrdu ? "گوگل اسکالر پروفائل" : "Google Scholar citations"}</span>
              </a>
            </div>
          </div>

        </div>

        {/* SEO Tags Paragraph Indexing */}
        <div className="border-t border-slate-800 pt-8 pb-4 text-center space-y-3">
          <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 block font-bold">
            {isUrdu ? "طبی تحقیق اور کلینکل فیلڈ" : "Health Care Specialty Specialties"}
          </span>
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {seoTags.map((tag) => (
              <span
                key={tag}
                className="text-slate-300 hover:text-white text-[11px] font-mono tracking-wide transition-colors bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-md"
                title={`Clinical support for ${tag}`}
              >
                • {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic bottom copyrights */}
        <div className={`border-t border-slate-800 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 font-mono gap-4 ${isUrdu ? "sm:flex-row-reverse" : ""}`}>
          <p>{t("footer_copyright").replace("{year}", "2026")}</p>
          <button
            onClick={handleScrollToTop}
            className={`flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors cursor-pointer bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-3.5 py-1.5 rounded-xl font-sans font-medium shadow-xs ${isUrdu ? "flex-row-reverse" : ""}`}
            aria-label="Back to top"
          >
            <span>{isUrdu ? "اوپر واپس جائیں" : "Back to top"}</span>
            <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>
    </footer>
  );
}
