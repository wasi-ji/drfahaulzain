import React, { useState } from "react";
import { X, Star, Heart, CheckCircle2, MessageSquare, Send, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { Testimonial } from "../types";
import { DOCTOR_INFO } from "../data";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (newFeedback: Testimonial) => void;
}

export default function FeedbackModal({ isOpen, onClose, onSubmitSuccess }: FeedbackModalProps) {
  const { isUrdu, t } = useLanguage();

  const [name, setName] = useState("");
  const [useInitialsOnly, setUseInitialsOnly] = useState(true);
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feelingText, setFeelingText] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastCreatedFeedback, setLastCreatedFeedback] = useState<Testimonial | null>(null);

  if (!isOpen) return null;

  // Helper to get clean initials from name
  const getInitials = (inputName: string) => {
    if (!inputName.trim()) return isUrdu ? "م ش" : "P.V.";
    const parts = inputName.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + "." + parts[1][0] + ".").toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    const initials = useInitialsOnly ? getInitials(name) : (name.trim() || (isUrdu ? "تصدیق شدہ مریض" : "Verified Patient"));
    
    const newFeedback: Testimonial = {
      id: "custom-" + Date.now(),
      patientInitials: initials,
      location: location.trim() || (isUrdu ? "نوابشاہ / آن لائن" : "Nawabshah / Online"),
      feedback: feedbackText.trim(),
      feelingText: feelingText.trim() || (isUrdu ? "پُرسکون اور مطمئن محسوس کر رہا ہوں" : "Felt supported, calm & relieved"),
      timeframe: isUrdu ? "حالیہ فیڈ بیک" : "Recent Patient Review"
    };

    // Save to localStorage
    try {
      const existing = localStorage.getItem("custom_patient_feedbacks");
      const list: Testimonial[] = existing ? JSON.parse(existing) : [];
      list.unshift(newFeedback);
      localStorage.setItem("custom_patient_feedbacks", JSON.stringify(list));
    } catch (err) {
      console.error("Could not save feedback to local storage:", err);
    }

    setLastCreatedFeedback(newFeedback);
    onSubmitSuccess(newFeedback);
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setName("");
    setLocation("");
    setFeelingText("");
    setFeedbackText("");
    setRating(5);
    onClose();
  };

  const cleanWhatsappNumber = DOCTOR_INFO.whatsappNumber.replace(/[^0-9]/g, "");

  const handleSendToWhatsapp = () => {
    const stars = "⭐".repeat(rating);
    const text = isUrdu
      ? `السلام علیکم ڈاکٹر فہد صاحب!\n\nمیں نے ویب سائٹ پر اپنا فیڈ بیک درج کیا ہے:\n\n*درجہ بندی:* ${stars}\n*مریض کا نام/مخفف:* ${lastCreatedFeedback?.patientInitials || name}\n*شہر:* ${lastCreatedFeedback?.location}\n*کیفیت:* ${lastCreatedFeedback?.feelingText}\n*فیڈ بیک:* "${feedbackText}"`
      : `Hello Dr. Fahad Ul Zain,\n\nI just shared my feedback on your consultation website:\n\n*Rating:* ${stars}\n*Patient Initials/Name:* ${lastCreatedFeedback?.patientInitials || name}\n*City:* ${lastCreatedFeedback?.location}\n*Outcome:* ${lastCreatedFeedback?.feelingText}\n*Review:* "${feedbackText}"`;

    window.open(`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-clinical-950/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className={`relative bg-white rounded-3xl shadow-2xl border border-clinical-100 w-full max-w-lg overflow-hidden z-10 ${
            isUrdu ? "text-right" : "text-left"
          }`}
          dir={isUrdu ? "rtl" : "ltr"}
        >
          {/* Top Bar Header */}
          <div className="bg-gradient-to-r from-clinical-850 to-clinical-900 text-white p-6 relative">
            <button
              onClick={handleResetAndClose}
              className={`absolute top-5 p-2 rounded-full text-clinical-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ${
                isUrdu ? "left-5" : "right-5"
              }`}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`flex items-center gap-3 ${isUrdu ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-accent-gold shrink-0 border border-white/10">
                <Sparkles className="w-5 h-5 text-accent-soft" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white tracking-tight">
                  {t("feedback_modal_title")}
                </h3>
                <p className="text-xs text-clinical-200 mt-0.5">
                  {t("feedback_modal_subtitle")}
                </p>
              </div>
            </div>
          </div>

          {/* Form Content or Success Screen */}
          <div className="p-6 sm:p-8">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Rating selection */}
                <div>
                  <label className="block text-xs font-semibold text-clinical-700 mb-2">
                    {t("feedback_field_rating")}
                  </label>
                  <div className={`flex items-center gap-2 ${isUrdu ? "flex-row-reverse justify-start" : ""}`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-yellow-400 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-clinical-200 fill-clinical-50"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-bold text-clinical-500 mx-2">
                      ({rating}/5)
                    </span>
                  </div>
                </div>

                {/* Patient Name & Initials Toggle */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-clinical-700">
                    {t("feedback_field_name")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isUrdu ? "مثال: علی خان یا A.K." : "e.g. Muhammad Ali or M.A."}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-clinical-200 text-sm focus:ring-2 focus:ring-clinical-500 focus:border-transparent outline-none bg-clinical-50/30 text-clinical-900"
                  />
                  <label className={`flex items-center gap-2 text-xs text-clinical-600 cursor-pointer pt-1 ${isUrdu ? "flex-row-reverse" : ""}`}>
                    <input
                      type="checkbox"
                      checked={useInitialsOnly}
                      onChange={(e) => setUseInitialsOnly(e.target.checked)}
                      className="rounded border-clinical-300 text-clinical-700 focus:ring-clinical-500 w-4 h-4"
                    />
                    <span>{t("feedback_privacy_checkbox")}</span>
                  </label>
                </div>

                {/* City / Location & Feeling Tag */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-clinical-700 mb-1">
                      {t("feedback_field_location")}
                    </label>
                    <input
                      type="text"
                      placeholder={isUrdu ? "نوابشاہ / حیدرآباد" : "Nawabshah / Hyderabad"}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-clinical-200 text-sm focus:ring-2 focus:ring-clinical-500 outline-none bg-clinical-50/30 text-clinical-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-clinical-700 mb-1">
                      {t("feedback_field_feeling")}
                    </label>
                    <input
                      type="text"
                      placeholder={isUrdu ? "مثال: پرسکون نیند، ڈپریشن میں بہتری" : "e.g. Anxiety relieved, peaceful sleep"}
                      value={feelingText}
                      onChange={(e) => setFeelingText(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-clinical-200 text-sm focus:ring-2 focus:ring-clinical-500 outline-none bg-clinical-50/30 text-clinical-900"
                    />
                  </div>
                </div>

                {/* Detailed Feedback Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-clinical-700 mb-1">
                    {t("feedback_field_text")} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder={
                      isUrdu
                        ? "ڈاکٹر فہد الزین کی کونسلنگ یا علاج سے آپ کی صحت میں کیا مثبت تبدیلی آئی؟ اپنا تجربہ شیئر کریں..."
                        : "Describe how Dr. Fahad's consultation helped your mental health and recovery..."
                    }
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-clinical-200 text-sm focus:ring-2 focus:ring-clinical-500 outline-none bg-clinical-50/30 text-clinical-900 resize-none"
                  />
                </div>

                {/* Confidentiality Reminder Notice */}
                <div className={`p-3 rounded-xl bg-clinical-50 border border-clinical-150 flex items-center gap-2.5 text-xs text-clinical-600 ${isUrdu ? "flex-row-reverse text-right" : ""}`}>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {isUrdu
                      ? "آپ کا تاثر رازداری کی سخت اخلاقی پالیسی کے تحت پبلش کیا جائے گا۔"
                      : "Your review adheres strictly to medical ethics and privacy guidelines."}
                  </span>
                </div>

                {/* Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full flex-1 bg-clinical-800 hover:bg-clinical-900 text-white font-medium py-3 px-5 rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t("feedback_btn_submit")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="w-full sm:w-auto px-5 py-3 border border-clinical-200 text-clinical-600 hover:bg-clinical-50 rounded-xl text-xs font-medium cursor-pointer"
                  >
                    {isUrdu ? "منسوخ کریں" : "Cancel"}
                  </button>
                </div>
              </form>
            ) : (
              /* Success Screen */
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-serif font-bold text-clinical-900">
                    {t("feedback_success_title")}
                  </h4>
                  <p className="text-sm text-clinical-600 max-w-sm mx-auto">
                    {t("feedback_success_desc")}
                  </p>
                </div>

                {/* WhatsApp optional send button */}
                <div className="pt-2 space-y-3">
                  <button
                    onClick={handleSendToWhatsapp}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-white/20" />
                    <span>{t("feedback_btn_whatsapp")}</span>
                  </button>

                  <button
                    onClick={handleResetAndClose}
                    className="w-full py-2.5 text-xs text-clinical-500 hover:text-clinical-800 font-medium cursor-pointer"
                  >
                    {isUrdu ? "واپس پیج پر جائیں" : "Return to Page"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
