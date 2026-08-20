import { MapPin, MessageSquare, Clock, ArrowUpRight, ShieldAlert } from "lucide-react";
import { CLINIC_TIMINGS } from "../data";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "motion/react";
import clinicLobbyImage from "../assets/images/serene_clinic_lobby_1781719436801.jpg";

export default function ClinicTimings() {
  const { isUrdu, t } = useLanguage();

  const timings = [
    {
      type: isUrdu ? "فزیکل کلینک (پیر سے جمعہ)" : "Physical Clinic (Mon – Fri)",
      facility: isUrdu ? "ولی سائیکاٹری سینٹر" : CLINIC_TIMINGS.physical.name,
      location: isUrdu ? "پلاٹ 68، محمدی ٹاؤن، ابو آئل مل کے سامنے، زیرو پوائنٹ کے قریب، نوابشاہ" : CLINIC_TIMINGS.physical.address,
      duration: isUrdu ? "شام 4:00 بجے سے رات 9:00 بجے تک" : CLINIC_TIMINGS.physical.hours,
      days: isUrdu ? "سوموار تا جمعہ" : CLINIC_TIMINGS.physical.days,
      mapUrl: "https://maps.app.goo.gl/Ms6NNUeoZBsGagsP9",
      color: "border-clinical-200 bg-white"
    },
    {
      type: isUrdu ? "اتوار کی خصوصی اوپی ڈی" : "Sunday Specialist Session",
      facility: isUrdu ? "حیدرآباد کنسلٹیشن کلینک" : CLINIC_TIMINGS.sunday.name,
      location: isUrdu ? "حیدرآباد سٹی ڈینٹل اینڈ میڈیکل کمپلیکس، حیدرآباد" : CLINIC_TIMINGS.sunday.address,
      duration: isUrdu ? "دوپہر 2:00 بجے سے شام 5:00 بجے تک" : CLINIC_TIMINGS.sunday.hours,
      days: isUrdu ? "ہر اتوار" : CLINIC_TIMINGS.sunday.days,
      mapUrl: "https://maps.google.com/?q=Hyderabad+City+Dental+Medical+Complex+Pakistan",
      color: "border-accent-gold/25 bg-accent-soft/45"
    }
  ];

  return (
    <section id="timings" className="py-20 md:py-28 bg-white border-t border-clinical-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent-gold-dark block">
            {t("timings_subtitle")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-clinical-900 tracking-tight">
            {t("timings_title")}
          </h2>
          <div className="w-16 h-1 bg-accent-gold mx-auto rounded-full" />
          <p className="text-clinical-600 text-sm sm:text-base leading-relaxed">
            {isUrdu
              ? "ڈاکٹر فہد الزین سے نوابشاہ اور حیدرآباد کے نجی کلینکس پر ملاقات حاصل کریں۔ طویل انتظار سے بچنے کے لیے وقت کا پہلے تعیّن کرنا بے حد ضروری ہے۔"
              : "Visit Dr. Fahad Ul Zain at these private physical clinic consultations in Sindh. Please schedule in advance to guarantee zero coordinates queue stress."}
          </p>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch ${isUrdu ? "direction-rtl text-right" : "text-left"}`} id="timings-grid">

          {/* Left Side: Schedule Cards */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            <div className="grid grid-cols-1 gap-6">
              {timings.map((tItem, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: isUrdu ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`border p-6 sm:p-8 rounded-3xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between ${tItem.color}`}
                >
                  <div className="space-y-4">
                    <div className={`flex items-center justify-between ${isUrdu ? "flex-row-reverse" : ""}`}>
                      <span className="text-[11px] font-mono font-bold text-clinical-500 uppercase tracking-widest bg-clinical-50 px-3 py-1 rounded-full">
                        {tItem.days}
                      </span>
                      <span className="text-[11px] font-mono text-accent-gold-dark font-bold uppercase">
                        {tItem.duration}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-serif font-bold text-clinical-900 leading-tight">
                        {tItem.facility}
                      </h3>
                      <p className={`text-xs text-clinical-550 mt-1.5 flex items-start gap-1.5 ${isUrdu ? "flex-row-reverse text-right" : ""}`}>
                        <MapPin className="w-4 h-4 text-accent-gold-dark shrink-0 mt-0.5" />
                        <span>{tItem.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className={`flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-clinical-100/60 ${isUrdu ? "sm:flex-row-reverse" : ""}`}>
                    <a
                      href={tItem.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-clinical-50 hover:bg-clinical-100 text-clinical-700 hover:text-clinical-900 px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors duration-150 border border-clinical-200/50 cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-clinical-600" />
                      <span>{isUrdu ? "نقشہ دیکھیں" : "Directions Map"}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={`https://wa.me/923337030787?text=Hello%20Dr.%20Fahad%20Ul%20Zain,%20I%20would%20like%20to%20book%20a%20consultation.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-clinical-700 hover:bg-clinical-800 text-white px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors duration-150 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{isUrdu ? "واٹس ایپ بکنگ" : "WhatsApp Book"}</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Reassuring contact prompt */}
            <div className={`bg-clinical-50/70 p-6 rounded-3xl border border-clinical-100 flex items-start gap-4 ${isUrdu ? "flex-row-reverse text-right" : "text-left"}`}>
              <ShieldAlert className="w-5.5 h-5.5 text-clinical-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="block text-xs font-semibold text-clinical-900">
                  {isUrdu ? "کلینک میں داخلے کے اصول" : "Patient Entry Requirements"}
                </span>
                <p className="text-xs text-clinical-600 leading-relaxed font-sans">
                  {isUrdu
                    ? "واٹس ایپ یا فون سے بکنگ کے عمل کے بعد مریض کو سیکیور ٹوکن جاری کیا جاتا ہے۔ کلینک پر انتظار کا اوسط وقت ۱۰ منٹ سے کم ہے۔"
                    : "Appointments booked through WhatsApp or phone inquiry receive instant digital diagnostic tokens. Safe patient seating limits queuing waits to under 10 minutes."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Virtual Google Maps view */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-md border border-clinical-155 min-h-[350px] bg-clinical-50 flex flex-col justify-between">
            {/* Visual Header indicating mapped facilities */}
            <div className={`absolute top-4 left-4 right-4 z-10 backdrop-blur-md bg-white/90 p-4 rounded-2xl shadow-md border border-clinical-55 flex items-center justify-between ${isUrdu ? "flex-row-reverse text-right" : ""}`}>
              <div>
                <span className="block text-[10px] font-medium text-clinical-450 font-mono tracking-wider text-accent-gold-dark">
                  {isUrdu ? "متحرک لوکیشنز" : "ACTIVE LOCATIONS"}
                </span>
                <span className="block text-sm font-serif font-bold text-clinical-900 leading-tight">
                  {isUrdu ? "سندھ کنسلٹیشن کلینکس" : "Sindh Consultation Clinics"}
                </span>
              </div>
              <span className="bg-emerald-500 w-2.5 h-2.5 rounded-full animate-pulse" />
            </div>

            {/* Simulated Clean Map Visual Placeholder */}
            <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
              <img
                src={clinicLobbyImage}
                alt="Wali Psychiatry Centre Nawabshah Interior Lobby Map Location"
                className="absolute inset-0 w-full h-full object-cover brightness-[0.45]"
                referrerPolicy="no-referrer"
              />
              <div className="relative text-center p-8 space-y-4 z-10 text-white max-w-sm">
                <MapPin className="w-10 h-10 text-accent-gold mx-auto animate-bounce" />
                <h4 className="text-lg font-serif font-bold">{isUrdu ? "نوابشاہ اور حیدرآباد" : "Wali Psychiatry & Hyd"}</h4>
                <p className="text-xs text-white/85 leading-relaxed font-sans">
                  {isUrdu
                    ? "نوابشاہ یا حیدرآباد سٹی کے برانچز کے مکمل راستے (GPS) کے حصول کے لیے جدول میں دیئے گئے بٹن پر کلک کریں۔"
                    : "Click 'Directions Map' in the timetables to trigger complete GPS routes using real-time Google Maps coordinates for Nawabshah or Hyderabad City."}
                </p>
                <div className="pt-2">
                  <a
                    href="https://maps.app.goo.gl/Ms6NNUeoZBsGagsP9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-clinical-900 font-bold text-[11px] uppercase tracking-wider py-2.5 px-5 rounded-lg hover:bg-clinical-50 transition-colors"
                  >
                    {isUrdu ? "ولی سینٹر نوابشاہ کا لائیو نقشہ" : "Open Wali Centre Nawabshah GPS"}
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
