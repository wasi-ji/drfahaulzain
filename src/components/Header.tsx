import { useState, useEffect, useRef } from "react";
import { Menu, X, Calendar, MessageCircle, Heart, LogIn, LogOut, ShieldAlert, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { DOCTOR_INFO } from "../data";

interface HeaderProps {
  onBookClick: () => void;
  onAuthClick: () => void;
  onAdminClick: () => void;
}

export default function Header({ onBookClick, onAuthClick, onAdminClick }: HeaderProps) {
  const { language, setLanguage, isUrdu, t } = useLanguage();
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile/tablet menu automatically when the person taps or clicks
  // anywhere outside of it (not just the menu button itself).
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: t("nav_home"), href: "#home" },
    { label: t("nav_about"), href: "#about" },
    { label: t("nav_conditions"), href: "#conditions" },
    { label: t("nav_treatments"), href: "#treatments" },
    { label: t("nav_research"), href: "#research" },
    { label: t("nav_assessment"), href: "#assessment" },
    { label: t("nav_faqs"), href: "#faqs" }
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const whatsappCleanNumber = DOCTOR_INFO.whatsappNumber.replace(/[^0-9]/g, "");

  // Modern language picker pill component (without world icon)
  const LanguageSwitcher = () => (
    <div className="flex items-center gap-0.5 border border-clinical-200/80 bg-clinical-50/50 p-0.5 rounded-full shadow-xs relative z-50 shrink-0">
      <button
        onClick={() => setLanguage("en")}
        className={`px-1.5 xl:px-2.5 py-0.5 text-[10px] xl:text-[11px] font-bold rounded-full transition-all duration-200 cursor-pointer ${language === "en" ? "bg-clinical-700 text-white shadow-xs" : "text-clinical-600 hover:text-clinical-950"
          }`}
        title="Switch to English"
        id="btn-lang-en"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("ur")}
        className={`px-1.5 xl:px-2.5 py-0.5 text-[10px] xl:text-[11px] font-bold rounded-full transition-all duration-200 cursor-pointer ${language === "ur" ? "bg-clinical-700 text-white shadow-xs font-sans" : "text-clinical-600 hover:text-clinical-950"
          }`}
        title="اردو زبان منتخب کریں"
        id="btn-lang-ur"
      >
        اردو
      </button>
    </div>
  );

  return (
    <header
      ref={headerRef}
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-clinical-100 py-2 sm:py-2.5"
          : "bg-transparent py-3 sm:py-4"
        }`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-4 xl:px-8">
        <div className="flex items-center justify-between gap-1.5 lg:gap-2 xl:gap-5">

          {/* Logo with Doctor Name on a single line */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#home");
            }}
            className={`flex items-center ${isUrdu ? "flex-row-reverse text-right" : "flex-row text-left"} gap-2 group shrink-0`}
            id="header-logo"
          >
            <div className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-full bg-clinical-500 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-105 shrink-0">
              <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-accent-soft fill-accent-soft/10" />
            </div>
            <div className="whitespace-nowrap">
              <span className="block text-xs sm:text-sm lg:text-base font-serif font-bold text-clinical-900 tracking-tight leading-none whitespace-nowrap">
                {isUrdu ? "ڈاکٹر فہد الزین" : "Dr. Fahad Ul Zain"}
              </span>
              <span className="block text-[9px] sm:text-[10px] font-sans font-semibold tracking-wide text-clinical-500 mt-0.5 whitespace-nowrap">
                {isUrdu ? "ماہرِ امراضِ نفسيات" : "Consultant Psychiatrist"}
              </span>
            </div>
          </a>

          {/* Desktop Nav - Perfectly Aligned & Equally Spaced Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-1.5 lg:gap-2 xl:gap-4 2xl:gap-5 shrink" id="desktop-nav">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="text-[11px] lg:text-[11.5px] xl:text-[12.5px] 2xl:text-[13.5px] font-semibold text-clinical-700 hover:text-clinical-950 transition-colors duration-200 uppercase tracking-tight xl:tracking-wider whitespace-nowrap leading-none relative group py-1"
              >
                {item.label}
                <span className="absolute bottom-[-3px] left-0 w-0 h-0.5 bg-accent-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Header Action Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-1 lg:gap-1.5 xl:gap-2.5 shrink-0">
            <LanguageSwitcher />

            {/* Auth / Admin Stack for Desktop */}
            {isAuthenticated ? (
              <div className="flex flex-col items-stretch justify-center gap-0.5 shrink-0 min-w-[82px] lg:min-w-[88px]">
                {/* Admin Portal Button */}
                {isAdmin && (
                  <button
                    onClick={onAdminClick}
                    className="flex items-center justify-center bg-gradient-to-r from-purple-900 to-indigo-950 text-amber-300 hover:text-white border border-purple-700/60 px-2 py-0.5 rounded-full text-[10px] xl:text-[11px] font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap w-full text-center"
                    title="Admin Database Portal"
                  >
                    <span>{isUrdu ? "ایڈمن پورٹل" : "Admin Portal"}</span>
                  </button>
                )}

                {/* Log Out Button directly underneath Admin Portal */}
                <button
                  onClick={logout}
                  className="flex items-center justify-center gap-0.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200/80 px-1.5 py-0.5 rounded-full text-[9.5px] xl:text-[10.5px] font-bold transition-all cursor-pointer whitespace-nowrap w-full text-center"
                  title={isUrdu ? "سائن آؤٹ کریں" : "Sign Out"}
                >
                  <LogOut className="w-2.5 h-2.5 shrink-0" />
                  <span>
                    {isUrdu ? "لاگ آؤٹ" : "Log Out"}
                  </span>
                </button>
              </div>
            ) : (
              /* Sign In Button without icon symbol */
              <button
                onClick={onAuthClick}
                className="flex items-center justify-center bg-clinical-50 hover:bg-clinical-100 text-clinical-800 border border-clinical-200 px-2.5 xl:px-3.5 py-1 rounded-full text-[11px] xl:text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
              >
                <span>{isUrdu ? "سائن ان" : "Sign In"}</span>
              </button>
            )}

            {/* Desktop WhatsApp icon button only */}
            <a
              href={`https://wa.me/${whatsappCleanNumber}?text=Hello%20Dr.%20Fahad%20Ul%20Zain,%20I%20would%20like%20to%20book%20a%20psychiatry%20consultation.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7.5 h-7.5 xl:w-8.5 xl:h-8.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 flex items-center justify-center transition-all duration-300 border border-emerald-200/80 shadow-xs cursor-pointer shrink-0 group"
              title={isUrdu ? "واٹس ایپ پر رابطہ کریں" : "Chat on WhatsApp"}
              aria-label="WhatsApp"
              id="header-whatsapp-btn"
            >
              <MessageCircle className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-emerald-600 fill-emerald-500/20 group-hover:scale-110 transition-transform duration-200" />
            </a>

            <button
              onClick={onBookClick}
              className="flex items-center gap-1 bg-clinical-700 text-white hover:bg-clinical-850 px-2.5 xl:px-3.5 py-1.5 rounded-full text-[11px] xl:text-xs font-medium transition-all duration-300 shadow-xs border border-transparent cursor-pointer whitespace-nowrap shrink-0"
              id="header-booking-btn"
            >
              <Calendar className="w-3 h-3 xl:w-3.5 xl:h-3.5 shrink-0" />
              <span>{isUrdu ? "اپوائنٹمنٹ" : "Appointment"}</span>
            </button>
          </div>

          {/* Mobile & Tablet Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full text-clinical-700 hover:text-clinical-900 hover:bg-clinical-50 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
              id="mobile-menu-trigger"
            >
              {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-white border-t border-clinical-100 shadow-lg mt-1 sm:mt-2 max-h-[calc(100dvh-64px)] sm:max-h-[calc(100vh-72px)] overflow-y-auto scrollbar-thin scrollbar-thumb-clinical-300"
            id="mobile-drawer"
          >
            <div className={`px-4 pt-2 pb-6 space-y-1 ${isUrdu ? "text-right" : "text-left"}`}>
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-clinical-700 hover:text-clinical-900 hover:bg-clinical-50"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3 flex flex-col gap-2 px-3">
                {/* Admin Portal Button for Mobile */}
                {isAdmin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onAdminClick();
                    }}
                    className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-900 to-indigo-950 text-amber-300 py-2.5 rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>{isUrdu ? "ایڈمن پورٹل (Admin Dashboard)" : "Admin Portal & Reports"}</span>
                  </button>
                )}

                {/* Sign In / Sign Out for Mobile */}
                {isAuthenticated ? (
                  <button
                    onClick={async () => {
                      await logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 py-2.5 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isUrdu ? `سائن آؤٹ (${currentUser?.name})` : `Sign Out (${currentUser?.name})`}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onAuthClick();
                    }}
                    className="flex items-center justify-center gap-1.5 bg-clinical-100 text-clinical-900 hover:bg-clinical-200 py-2.5 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{isUrdu ? "سائن ان / رجسٹر" : "Sign In / Register"}</span>
                  </button>
                )}

                {/* Full WhatsApp button for mobile and tablets */}
                <a
                  href={`https://wa.me/${whatsappCleanNumber}?text=Hello%20Dr.%20Fahad%20Ul%20Zain,%20I%20would%20like%20to%20book%20a%20psychiatry%20consultation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 text-clinical-700 bg-clinical-50 hover:bg-clinical-100 py-2.5 rounded-lg text-xs font-medium border border-clinical-200"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <span>{t("btn_whatsapp_us")}</span>
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onBookClick();
                  }}
                  className="flex items-center justify-center gap-1.5 bg-clinical-700 text-white hover:bg-clinical-800 py-2.5 rounded-lg text-xs font-medium shadow-sm cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t("btn_request_appointment")}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
