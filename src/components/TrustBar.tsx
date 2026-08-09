import { Shield, CheckSquare, GraduationCap, Users, Lock, Milestone } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

export default function TrustBar() {
  const { isUrdu } = useLanguage();

  const trustStats = [
    {
      icon: Shield,
      title: isUrdu ? "پی ایم ڈی سی رجسٹرڈ" : "PMDC Registered",
      value: isUrdu ? "54095-S نمبر" : "No. 54095-S",
      desc: isUrdu ? "تصدیق شدہ ماہرِ امراضِ نفسیات" : "Verified Practitioner"
    },
    {
      icon: GraduationCap,
      title: isUrdu ? "کنسلٹنٹ سائیکاٹرسٹ" : "Consultant Psychiatrist",
      value: isUrdu ? "ایم ڈی (سائیکاٹری)" : "MD (Psychiatry)",
      desc: isUrdu ? "پوسٹ گریجویٹ اسپیشلائزڈ ڈگری" : "Postgrad Specialization"
    },
    {
      icon: Lock,
      title: isUrdu ? "خفیہ اور محفوظ علاج" : "Confidential Care",
      value: isUrdu ? "۱۰۰٪ صیغہ راز" : "100% Secure",
      desc: isUrdu ? "سخت طبی اخلاقیات کے مطابق" : "Strict Ethics Compliant"
    },
    {
      icon: CheckSquare,
      title: isUrdu ? "مستند سائنسی علاج" : "Evidence-Based",
      value: isUrdu ? "طبی تحقیق شدہ" : "Science-Backed",
      desc: isUrdu ? "غیر تصدیق شدہ ادویات سے پرہیز" : "No Unproved Therapy"
    },
    {
      icon: Users,
      title: isUrdu ? "ہمدردانہ رہنمائی" : "Patient-Centered",
      value: isUrdu ? "شفیق اور دوستانہ" : "Compassionate",
      desc: isUrdu ? "انفرادی تشخیصی سیشنز" : "Tailored Consultations"
    },
    {
      icon: Milestone,
      title: isUrdu ? "برانچز کا دائرہ" : "Dual Focus",
      value: isUrdu ? "نوابشاہ اور حیدرآباد" : "Nawabshah & Hyd",
      desc: isUrdu ? "فزیکل اور آن لائن تھیراپی" : "Accessible Sessions"
    }
  ];

  return (
    <div className="bg-white border-y border-clinical-100 py-10" id="trust-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center divide-x-0 divide-y-0 md:divide-x md:divide-clinical-150">
          {trustStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col items-center px-4 space-y-2 first:border-0"
              >
                <div className="w-10 h-10 rounded-full bg-clinical-50 flex items-center justify-center text-clinical-600 mb-1">
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold tracking-widest text-clinical-400 uppercase">
                    {stat.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg font-serif font-bold text-clinical-800 tracking-tight mt-0.5">
                    {stat.value}
                  </p>
                  <p className="text-[11px] sm:text-[12px] text-clinical-500 font-medium leading-normal">
                    {stat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
