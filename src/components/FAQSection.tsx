import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { FAQS } from "../data";

export default function FAQSection() {
  const { isUrdu, t, localizedFAQs } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // AEO: FAQPage structured data. This lets AI answer engines (ChatGPT,
  // Perplexity, Google AI Overviews) read these Q&A pairs directly in a
  // machine-readable format, instead of only seeing the visual accordion.
  // Always uses the English FAQ text so the schema stays consistent
  // regardless of which language the visitor has selected.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section id="faqs" className="py-20 md:py-28 bg-clinical-50/50 border-t border-clinical-100">
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent-gold-dark block">
            {t("faqs_subtitle")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-clinical-900 tracking-tight">
            {t("faqs_title")}
          </h2>
          <div className="w-16 h-1 bg-accent-gold mx-auto rounded-full" />
          <p className="text-clinical-600 text-sm max-w-xl mx-auto leading-relaxed">
            {isUrdu 
              ? "طبی علاج، رازداری کے حدود، اور فیس و شیڈول کے متعلق عام مریضوں کے اذہان میں پیدا ہونے والے شکوک و سوالات کے مخلصانہ جوابات۔"
              : "Clear responses regarding treatment procedures, confidentiality limits, and scheduling options to help you feel informed."}
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4" id="faq-accordions-list">
          {localizedFAQs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id}
                className="bg-white border border-clinical-100/80 rounded-2xl overflow-hidden shadow-xs hover:border-clinical-200.5 transition-all duration-200"
              >
                {/* Trigger bar */}
                <button
                  onClick={() => toggleIndex(idx)}
                  className={`w-full flex items-center justify-between text-left p-6 sm:p-7 gap-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-clinical-100 ${isUrdu ? "flex-row-reverse text-right" : "text-left"}`}
                  aria-expanded={isOpen}
                >
                  <div className={`flex items-start gap-3 ${isUrdu ? "flex-row-reverse text-right" : "text-left"}`}>
                    <HelpCircle className="w-5.5 h-5.5 text-clinical-500 mt-0.5 shrink-0" />
                    <span className="text-base font-serif font-bold text-clinical-900 tracking-tight leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-1 rounded-full bg-clinical-50 text-clinical-500 shrink-0"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                {/* Content block */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className={`px-6 pb-7 sm:px-7 sm:pb-8 pt-0 border-t border-clinical-50 ${isUrdu ? "text-right" : "text-left"}`}>
                        <p className="text-sm text-clinical-650 leading-relaxed font-sans font-medium whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
