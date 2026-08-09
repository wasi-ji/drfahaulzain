import { useState, FormEvent } from "react";
import { Phone, Mail, MessageSquare, CheckCircle, ShieldCheck, Send, Calendar, Sparkles, Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { DOCTOR_INFO } from "../data";
import { ConsultationMode, PhysicalLocation, PatientInfo, CountryOption } from "../types/booking";
import { ALL_COUNTRIES, PAKISTAN_COUNTRY } from "../data/countries";

interface ContactSectionProps {
  onOpenWizard?: (mode?: ConsultationMode, location?: PhysicalLocation, patient?: PatientInfo, country?: CountryOption) => void;
}

export default function ContactSection({ onOpenWizard }: ContactSectionProps) {
  const { isUrdu, t } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    branch: "Wali Psychiatry Centre, Nawabshah",
    symptom: "Anxiety & Stress",
    countryCode: "PK",
    note: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      if (isUrdu) {
        alert("برائے مہربانی اپنا نام اور موبائل نمبر درج کریں تاکہ اپوائنٹمنٹ کی بکنگ کا عمل مکمل ہو سکے۔");
      } else {
        alert("Please enter both your name and phone number to proceed with appointment slot selection.");
      }
      return;
    }

    // Map branch selection to mode & location
    let mode: ConsultationMode = "physical";
    let location: PhysicalLocation = "nawabshah";

    if (formData.branch.includes("Hyderabad")) {
      mode = "physical";
      location = "hyderabad";
    } else if (formData.branch.includes("Online")) {
      mode = "online";
      location = "nawabshah";
    } else {
      mode = "physical";
      location = "nawabshah";
    }

    const patientInfo: PatientInfo = {
      fullName: formData.name,
      age: "25", // Default placeholder age if not specified
      phone: formData.phone,
      email: "",
      reason: `${formData.symptom}${formData.note ? ` - ${formData.note}` : ""}`,
    };

    const selectedCountry = ALL_COUNTRIES.find(c => c.code === formData.countryCode) || PAKISTAN_COUNTRY;

    if (onOpenWizard) {
      onOpenWizard(mode, location, patientInfo, selectedCountry);
    } else {
      setIsSubmitted(true);
    }
  };

  const getWhatsAppPrefil = () => {
    const text = isUrdu 
      ? `پیارے ڈاکٹر فہد الزین! میں معائنے کے لیے اپوائنٹمنٹ کی درخواست کر رہا ہوں۔
تفصیلات درج ذیل ہیں:
- مریض کا نام: ${formData.name}
- موبائل نمبر: ${formData.phone}
- مقام: ${formData.branch}
- مسئلہ: ${formData.symptom}
- مناسب ترین دن: ${formData.day}
- اضافی تفصیل: ${formData.note || "کوئی خصوصی نوٹ نہیں"}`
      : `Hello Dr. Fahad Ul Zain, I am requesting a psychiatric consultation.
*Details:*
- *Name:* ${formData.name}
- *Phone:* ${formData.phone}
- *Clinic Branch:* ${formData.branch}
- *Support Area:* ${formData.symptom}
- *Preferred Days:* ${formData.day}
- *Message:* ${formData.note || "No specific note"}`;
    return `https://wa.me/923337030787?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-clinical-900 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-clinical-800/60 rounded-full filter blur-3xl -z-10" />
      <div className="absolute bottom-10 right-0 w-64 h-64 bg-accent-gold/10 rounded-full filter blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start ${isUrdu ? "direction-rtl" : ""}`}>
          
          {/* Left Column: Final Reassuring CTA & Info */}
          <div className={`lg:col-span-5 space-y-8 ${isUrdu ? "text-right" : "text-left"}`} id="contact-details">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent-gold block">
                {t("contact_subtitle")}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-[1.17]">
                {t("contact_title")}
              </h2>
              <div className={`w-16 h-1 bg-accent-gold rounded-full ${isUrdu ? "mr-0 ml-auto" : "mr-auto"}`} />
              <p className="text-clinical-200 text-sm sm:text-base leading-relaxed font-sans font-medium">
                {isUrdu 
                  ? "محفوظ، صیغہ راز میں اور شفقت پر مبنی ماحول میں مستند نفسیاتی و دماغی رہنمائی حاصل کریں۔ اپنے سوالات پوچھنے یا ملاقات کا وقت حاصل کرنے کے لیے سیکیور فارم یا واٹس ایپ پر رجوع کریں۔"
                  : "Professional psychiatric support in a safe, respectful, confidential, and compassionate environment. Reach out to ask a question, request consultations, or reserve times."}
              </p>
            </div>

            {/* Quick Contact metrics */}
            <div className="space-y-5 pt-4">
              <div className={`flex gap-4 items-start ${isUrdu ? "flex-row-reverse text-right" : "text-left"}`}>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-accent-gold">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-mono text-clinical-400 uppercase tracking-wider">
                    {isUrdu ? "رابطہ اور فون نمبر" : "Call Consultation Desk"}
                  </span>
                  <a href="tel:+923702207890" className="block text-base font-semibold hover:text-accent-gold transition-colors">
                    +92 370 2207890
                  </a>
                  <span className="block text-[11px] text-clinical-350">
                    {isUrdu ? "روزانہ صبح 10:00 سے رات 9:00 بجے تک" : "Active 10:00 AM – 9:00 PM Daily"}
                  </span>
                </div>
              </div>

              <div className={`flex gap-4 items-start ${isUrdu ? "flex-row-reverse text-right" : "text-left"}`}>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-accent-gold">
                  <MessageSquare className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-mono text-clinical-400 uppercase tracking-wider">
                    {isUrdu ? "براہِ راست واٹس ایپ" : "Direct WhatsApp Support"}
                  </span>
                  <a
                    href="https://wa.me/923337030787?text=Hello%20Dr.%20Fahad%20Ul%20Zain%2C%20I%20would%20like%20to%20inquire%20about%20a%20consultation."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-base font-semibold text-emerald-400 hover:text-emerald-350 transition-colors"
                  >
                    {isUrdu ? "واٹس ایپ پر میسج بھیجیں (+92 333 7030787)" : "Send WhatsApp (+92 333 7030787)"}
                  </a>
                  <span className="block text-[11px] text-clinical-350">
                    {isUrdu ? "ٹوکن نمبر اور اوقات کا فوری تعیّن" : "Instant automated token responses"}
                  </span>
                </div>
              </div>

              <div className={`flex gap-4 items-start ${isUrdu ? "flex-row-reverse text-right" : "text-left"}`}>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-accent-gold">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-mono text-clinical-400 uppercase tracking-wider">
                    {isUrdu ? "طبی اور تعلیمی ای میل" : "Academic & Corporate Email"}
                  </span>
                  <a href={`mailto:${DOCTOR_INFO.email}`} className="block text-base font-semibold hover:text-accent-gold transition-colors">
                    {DOCTOR_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Timings summary banner */}
            <div className={`bg-clinical-800/50 border border-clinical-700/60 p-6 rounded-2xl space-y-3 max-w-sm ${isUrdu ? "mr-0 ml-auto" : "mr-auto ml-0"}`}>
              <span className="block text-xs font-mono font-bold tracking-widest text-accent-gold uppercase">
                {isUrdu ? "کلینکل برانچوں کا خلاصہ:" : "Active Branches Summary:"}
              </span>
              <div className="space-y-2 text-xs text-clinical-200">
                {isUrdu ? (
                  <>
                    <p>📍 <strong>نوابشاہ (ولی سائیکاٹری سینٹر):</strong> سوموار تا جمعہ • 4:00 PM سے 9:00 PM</p>
                    <p>📍 <strong>حیدرآباد سنڈے کلینک:</strong> ہر اتوار • 2:00 PM سے 5:00 PM</p>
                  </>
                ) : (
                  <>
                    <p>📍 <strong>Nawabshah (Wali Psychiatry Centre):</strong> Mon–Fri • 4:00 PM – 9:00 PM</p>
                    <p>📍 <strong>Hyderabad Sunday Clinic:</strong> Every Sunday • 2:00 PM – 5:00 PM</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Form panel */}
          <div className="lg:col-span-7" id="contact-form-panel">
            <div className="bg-white text-clinical-900 p-6 sm:p-10 rounded-3xl shadow-xl border border-clinical-150 relative space-y-6">
              
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className={`space-y-1 pb-2 border-b border-clinical-100 ${isUrdu ? "text-right" : "text-left"}`}>
                      <h3 className="text-xl font-serif font-bold text-clinical-900">
                        {isUrdu ? "سیکیور او پی ڈی اور آن لائن اپوائنٹمنٹ فارم" : "Secure OPD & Video Appointment Registration"}
                      </h3>
                      <p className={`text-xs text-clinical-400 flex items-center gap-1 ${isUrdu ? "flex-row-reverse" : ""}`}>
                        <ShieldCheck className="w-4 h-4 text-clinical-500 shrink-0" />
                        <span>{isUrdu ? "پی ایم ڈی سی اخلاقی ضابطے کے مطابق سو فیصد رازداری" : "HIPAA/PMDC Compliant Confidential Registration"}</span>
                      </p>
                    </div>

                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${isUrdu ? "text-right" : "text-left"}`}>
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-clinical-500">
                          {t("contact_field_name")} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={isUrdu ? "مثلاً آصف رشید" : "e.g. Asif Rashid"}
                          className="w-full bg-clinical-50 border border-clinical-100 placeholder:text-clinical-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-clinical-600 focus:bg-white"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-clinical-500">
                          {t("contact_field_phone")} *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder={isUrdu ? "مثلاً 03001234567" : "e.g. 0300 1234567"}
                          className="w-full bg-clinical-50 border border-clinical-100 placeholder:text-clinical-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-clinical-600 focus:bg-white text-left"
                        />
                      </div>
                    </div>

                    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${isUrdu ? "text-right" : "text-left"}`}>
                      {/* Branch Choice */}
                      <div className="space-y-1.5 col-span-1 sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-clinical-500">
                          {t("contact_field_visit")} *
                        </label>
                        <select
                          value={formData.branch}
                          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                          className="w-full bg-clinical-50 border border-clinical-100 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-clinical-600 focus:bg-white cursor-pointer"
                        >
                          <option value="Wali Psychiatry Centre, Nawabshah">
                            {isUrdu ? "نوابشاہ (ولی سائیکاٹری سینٹر)" : "Nawabshah (Wali Psychiatry Centre)"}
                          </option>
                          <option value="Hyderabad Specialty Clinic">
                            {isUrdu ? "حیدرآباد (اتوار کی اوپی ڈی)" : "Hyderabad (Specialist Sunday Consult)"}
                          </option>
                          <option value="Secure Online Consultation">
                            {isUrdu ? "آن لائن سیکیور ویڈیو مشاورت" : "Online Secure Video Consultation"}
                          </option>
                        </select>
                      </div>

                      {/* Country Selection */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-clinical-500">
                          {isUrdu ? "ملک" : "Country"} *
                        </label>
                        <select
                          value={formData.countryCode}
                          onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                          className="w-full bg-clinical-50 border border-clinical-100 rounded-xl px-2.5 py-3 text-sm focus:outline-none focus:border-clinical-600 focus:bg-white cursor-pointer"
                        >
                          {ALL_COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Support category */}
                    <div className={`space-y-1.5 ${isUrdu ? "text-right" : "text-left"}`}>
                      <label className="block text-xs font-bold uppercase tracking-wider text-clinical-500">
                        {isUrdu ? "اہم مسئلہ / علامات" : "Primary Support Area"}
                      </label>
                      <select
                        value={formData.symptom}
                        onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                        className="w-full bg-clinical-50 border border-clinical-100 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-clinical-600 focus:bg-white cursor-pointer"
                      >
                        <option value="Anxiety & Stress">
                          {isUrdu ? "بے چینی، گھبراہٹ یا شدید تناؤ" : "Anxiety, Panic, or General Stress"}
                        </option>
                        <option value="Depression & Low Mood">
                          {isUrdu ? "ڈپریشن یا مایوسی" : "Depression / Loss of Interest"}
                        </option>
                        <option value="Sleep Problems">
                          {isUrdu ? "نیند کے مسائل یا بے خوابی" : "Sleep Disorders & Insomnia"}
                        </option>
                        <option value="Student Burnout">
                          {isUrdu ? "ذہنی سستی، برن آؤٹ یا الجھن" : "Burnout / Psychological Distress"}
                        </option>
                        <option value="Routine Mental Consultation">
                          {isUrdu ? "ذہنی تندرستی کا عمومی جائزہ" : "General Mental Health Review"}
                        </option>
                      </select>
                    </div>

                    {/* Short Notes */}
                    <div className={`space-y-1.5 ${isUrdu ? "text-right" : "text-left"}`}>
                      <label className="block text-xs font-bold uppercase tracking-wider text-clinical-500">
                        {t("contact_field_problem")}
                      </label>
                      <textarea
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        placeholder={t("contact_problem_placeholder")}
                        rows={3}
                        className="w-full bg-clinical-50 border border-clinical-100 placeholder:text-clinical-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-clinical-600 focus:bg-white"
                      />
                    </div>

                    {/* Policy reassurance */}
                    <p className={`text-[11px] text-clinical-450 leading-relaxed font-sans ${isUrdu ? "text-right" : "text-left"}`}>
                      {isUrdu 
                        ? "درخواست جمع کرنے پر، فزیکل ٹوکن کی تصدیق اور مناسب وقت فراہم کرنے کے لیے ہمارے کلینک کا معاون بذریعہ واٹس ایپ یا کال آپ سے رابطہ کرے گا۔ آپ کا ذہنی ہیلتھ ڈیٹا کہیں شیئر نہیں ہوتا۔"
                        : "By submitting, you agree to have our clinic assistant securely contact you to deliver your token. No healthcare histories are shared with external servers."}
                    </p>

                    {/* Action button */}
                    <button
                      type="submit"
                      className={`w-full flex items-center justify-center gap-2.5 bg-clinical-800 hover:bg-clinical-900 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer ${isUrdu ? "flex-row-reverse" : ""}`}
                    >
                      <Calendar className="w-4.5 h-4.5 text-accent-gold" />
                      <span className="text-sm font-sans tracking-wide">
                        {isUrdu ? "تاریخ اور وقت منتخب کریں (اپوائنٹمنٹ بک کریں)" : "Book Appointment (Select Date & Time Slot)"}
                      </span>
                      <Sparkles className="w-4 h-4 text-accent-gold" />
                    </button>
                  </motion.form>
                ) : (
                  /* Success Frame */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 space-y-6 animate-fade-in"
                    id="booking-form-success"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-2xl font-serif font-bold text-clinical-900 leading-tight">
                        {t("contact_success_title")}
                      </h4>
                      <p className="text-sm text-clinical-605 max-w-md mx-auto leading-relaxed font-medium">
                        {(isUrdu ? "محترم " : "Thank you, ") + formData.name + (isUrdu ? "! آپ کی معائنے کی تجویز کو کامیابی سے درج کر لیا گیا ہے۔ اچھے علاج کے لیے کوآرڈینیٹر رابطہ قائم کرے گا۔" : ". Your private diagnostic consultation details have been logged securely inside our patient panel.")}
                      </p>
                    </div>

                    <div className={`bg-clinical-50 border border-clinical-100 rounded-2xl p-4.5 max-w-sm mx-auto text-xs text-clinical-650 space-y-1 ${isUrdu ? "text-right" : "text-left"}`}>
                      <p>📍 <strong>{isUrdu ? "منتخب کردہ لوکیشن:" : "Requested Location:"}</strong> {formData.branch}</p>
                      <p>🗓️ <strong>{isUrdu ? "وقت کا انتخاب:" : "Times Segment:"}</strong> {formData.day}</p>
                      <p>🔑 <strong>{isUrdu ? "درخواست کی حالت:" : "Token Status:"}</strong> <span className="text-amber-600 font-bold">{isUrdu ? "تصدیق کے عمل میں" : "Pending confirmation"}</span></p>
                    </div>

                    <div className="space-y-4 pt-4">
                      <p className="text-xs text-clinical-500 font-medium leading-relaxed">
                        {isUrdu ? "ٹیلی فونک قطار کی بندش سے بچنے اور فوری تصدیق کے لیے واٹس ایپ کا استعمال کریں:" : "To bypass queue processing and book right away via WhatsApp:"}
                      </p>
                      <a
                        href={getWhatsAppPrefil()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer ${isUrdu ? "flex-row-reverse" : ""}`}
                      >
                        <MessageSquare className="w-4.5 h-4.5" />
                        <span>{isUrdu ? "واٹس ایپ چاٹ پر فوری بھیجیں" : "Instant Send on WhatsApp"}</span>
                      </a>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => {
                          setFormData({ name: "", phone: "", branch: "Wali Psychiatry Centre, Nawabshah", symptom: "Anxiety & Stress", day: "Monday-Friday Block", note: "" });
                          setIsSubmitted(false);
                        }}
                        className="text-xs text-clinical-450 hover:text-clinical-700 underline cursor-pointer"
                      >
                        {t("contact_btn_another")}
                      </button>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
