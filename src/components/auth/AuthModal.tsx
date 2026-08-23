import React, { useState } from "react";
import { X, LogIn, UserPlus, ShieldCheck, Lock, Mail, Phone, User, Key, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialMode = "signin" }: AuthModalProps) {
  const { isUrdu } = useLanguage();
  const { login, signup } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);
    setIsSubmitting(true);

    if (mode === "signin") {
      const res = await login(email, password);
      if (res.success) {
        setFeedbackMsg({ type: "success", text: isUrdu ? res.messageUr : res.messageEn });
        setTimeout(() => {
          onClose();
          setFeedbackMsg(null);
        }, 1000);
      } else {
        setFeedbackMsg({ type: "error", text: isUrdu ? res.messageUr : res.messageEn });
      }
    } else {
      const res = await signup(name, email, password, phone);
      if (res.success) {
        setFeedbackMsg({ type: "success", text: isUrdu ? res.messageUr : res.messageEn });
        setTimeout(() => {
          onClose();
          setFeedbackMsg(null);
        }, 1200);
      } else {
        setFeedbackMsg({ type: "error", text: isUrdu ? res.messageUr : res.messageEn });
      }
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-clinical-950/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className={`relative bg-white rounded-3xl shadow-2xl border border-clinical-100 w-full max-w-md overflow-hidden z-10 ${isUrdu ? "text-right" : "text-left"
            }`}
          dir={isUrdu ? "rtl" : "ltr"}
        >
          {/* Top Bar Header */}
          <div className="bg-gradient-to-r from-clinical-850 to-clinical-900 text-white p-6 relative">
            <button
              onClick={onClose}
              className={`absolute top-5 p-2 rounded-full text-clinical-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ${isUrdu ? "left-5" : "right-5"
                }`}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`flex items-center gap-3 ${isUrdu ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-accent-soft shrink-0 border border-white/10">
                <ShieldCheck className="w-5.5 h-5.5 text-accent-soft" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white tracking-tight">
                  {mode === "signin"
                    ? isUrdu
                      ? "اکاؤنٹ میں سائن ان کریں"
                      : "Sign In to Account"
                    : isUrdu
                      ? "نیا اکاؤنٹ بنائیں"
                      : "Create Client Account"}
                </h3>
                <p className="text-xs text-clinical-200 mt-0.5">
                  {isUrdu
                    ? "ڈاکٹر فہد الزین پورٹل سروسز تک رسائی حاصل کریں"
                    : "Access Dr. Fahad Consultation Portal"}
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-white/10 p-1 rounded-xl mt-5 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setFeedbackMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${mode === "signin" ? "bg-white text-clinical-900 shadow-sm" : "text-clinical-200 hover:text-white"
                  }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isUrdu ? "سائن ان (Sign In)" : "Sign In"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setFeedbackMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${mode === "signup" ? "bg-white text-clinical-900 shadow-sm" : "text-clinical-200 hover:text-white"
                  }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isUrdu ? "سائن اپ (Sign Up)" : "Sign Up"}</span>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 space-y-5">
            {feedbackMsg && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2.5 ${feedbackMsg.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-red-50 border-red-200 text-red-800"
                  } ${isUrdu ? "flex-row-reverse text-right" : ""}`}
              >
                {feedbackMsg.type === "success" && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />}
                <span>{feedbackMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-clinical-700 mb-1">
                      {isUrdu ? "پورا نام" : "Full Name"} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder={isUrdu ? "مثال: علی احمد" : "e.g. Muhammad Ali"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full ${isUrdu ? "pr-10 pl-4" : "pl-10 pr-4"
                          } py-2.5 rounded-xl border border-clinical-200 text-sm focus:ring-2 focus:ring-clinical-500 outline-none bg-clinical-50/30 text-clinical-900`}
                      />
                      <User className={`w-4 h-4 text-clinical-400 absolute top-3 ${isUrdu ? "right-3.5" : "left-3.5"}`} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-clinical-700 mb-1">
                      {isUrdu ? "موبائل یا واٹس ایپ نمبر (غیر ضروری)" : "Phone / WhatsApp (Optional)"}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="03001234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full ${isUrdu ? "pr-10 pl-4" : "pl-10 pr-4"
                          } py-2.5 rounded-xl border border-clinical-200 text-sm focus:ring-2 focus:ring-clinical-500 outline-none bg-clinical-50/30 text-clinical-900`}
                      />
                      <Phone className={`w-4 h-4 text-clinical-400 absolute top-3 ${isUrdu ? "right-3.5" : "left-3.5"}`} />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-clinical-700 mb-1">
                  {isUrdu ? "ای میل ایڈریس" : "Email Address"} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full ${isUrdu ? "pr-10 pl-4" : "pl-10 pr-4"
                      } py-2.5 rounded-xl border border-clinical-200 text-sm focus:ring-2 focus:ring-clinical-500 outline-none bg-clinical-50/30 text-clinical-900`}
                  />
                  <Mail className={`w-4 h-4 text-clinical-400 absolute top-3 ${isUrdu ? "right-3.5" : "left-3.5"}`} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-clinical-700 mb-1">
                  {isUrdu ? "پاس ورڈ" : "Password"} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full ${isUrdu ? "pr-10 pl-4" : "pl-10 pr-4"
                      } py-2.5 rounded-xl border border-clinical-200 text-sm focus:ring-2 focus:ring-clinical-500 outline-none bg-clinical-50/30 text-clinical-900`}
                  />
                  <Lock className={`w-4 h-4 text-clinical-400 absolute top-3 ${isUrdu ? "right-3.5" : "left-3.5"}`} />
                </div>
              </div>

              {/* Requirement 5 Notice */}
              {mode === "signup" && (
                <div className="p-3 bg-clinical-50 border border-clinical-150 rounded-xl text-[11px] text-clinical-600">
                  {isUrdu
                    ? "نوٹ: نیا سائن اپ کرنے پر خودکار طور پر کلائنٹ/مریض کا رول تفویض کیا جاتا ہے۔"
                    : "Note: New signups are registered as Client/Patient role by default."}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-clinical-800 hover:bg-clinical-900 text-white font-semibold py-3 px-5 rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>{isUrdu ? "براہ کرم انتظار کریں..." : "Please wait..."}</span>
                ) : mode === "signin" ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>{isUrdu ? "سائن ان کریں" : "Sign In"}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>{isUrdu ? "اکاؤنٹ رجسٹر کریں" : "Register Account"}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
