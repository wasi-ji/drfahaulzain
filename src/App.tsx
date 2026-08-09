import { useState } from "react";
import { HeartHandshake, HelpCircle, MessageCircle, ShieldCheck } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import AboutSection from "./components/AboutSection";
import ConditionsSection from "./components/ConditionsSection";
import ServicesSection from "./components/ServicesSection";
import ResearchSection from "./components/ResearchSection";
import SelfAssessment from "./components/SelfAssessment";
import ClinicTimings from "./components/ClinicTimings";
import FAQSection from "./components/FAQSection";
import Testimonials from "./components/Testimonials";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import { useLanguage } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import AuthModal from "./components/auth/AuthModal";
import AdminDashboardModal from "./components/admin/AdminDashboardModal";

import { BookingWizardModal } from "./components/booking/BookingWizardModal";
import { ConsultationMode, PhysicalLocation, PatientInfo, CountryOption } from "./types/booking";

function MainAppContent() {
  const { isUrdu } = useLanguage();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Interactive booking wizard state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingInitialMode, setBookingInitialMode] = useState<ConsultationMode>('physical');
  const [bookingInitialLocation, setBookingInitialLocation] = useState<PhysicalLocation>('nawabshah');
  const [bookingInitialPatient, setBookingInitialPatient] = useState<PatientInfo | undefined>(undefined);
  const [bookingInitialCountry, setBookingInitialCountry] = useState<CountryOption | undefined>(undefined);

  // Auth & Admin modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleOpenBooking = (
    mode: ConsultationMode = 'physical',
    location: PhysicalLocation = 'nawabshah',
    patient?: PatientInfo,
    country?: CountryOption
  ) => {
    setBookingInitialMode(mode);
    setBookingInitialLocation(location);
    setBookingInitialPatient(patient);
    setBookingInitialCountry(country);
    setIsBookingOpen(true);
  };

  return (
    <div className="relative min-h-screen font-sans bg-[#fcfbfc] antialiased text-clinical-900 selection:bg-accent-gold/20 selection:text-clinical-950">
      
      {/* Universal Reading progress line at the very top of screen */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent-gold origin-left z-55"
        style={{ scaleX }}
      />

      {/* Persistent Sticky WhatsApp chat Action Button */}
      <div className={`fixed bottom-6 ${isUrdu ? "left-6 items-start" : "right-6 items-end"} z-50 flex flex-col gap-3 pointer-events-none`}>
        
        {/* Soft reassuring info banner */}
        <motion.div
          initial={{ opacity: 0, x: isUrdu ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 5 }}
          className="backdrop-blur-md bg-white/95 border border-clinical-100 p-3 rounded-2xl shadow-xl max-w-xs pointer-events-auto hidden md:block"
        >
          <div className={`flex items-start gap-2.5 text-clinical-900 ${isUrdu ? "flex-row-reverse" : ""}`}>
            <HeartHandshake className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
            <div className={`${isUrdu ? "text-right" : "text-left"} space-y-0.5`}>
              <span className="block text-xs font-bold leading-tight">
                {isUrdu ? "رہنمائی کی ضرورت ہے؟" : "Need Support?"}
              </span>
              <p className="text-[11px] text-clinical-550 leading-relaxed font-sans font-medium">
                {isUrdu 
                  ? "ڈاکٹر فہد کو براہِ راست واٹس ایپ پر محفوظ پیغام بھیج کر اپوائنٹمنٹ معلوم کریں۔"
                  : "Tap below to send a secure WhatsApp booking message directly to Dr. Fahad."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Real Pulse Icon action */}
        <motion.a
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 2, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="https://wa.me/923337030787?text=Hello%20Dr.%20Fahad%252C%20I%20came%20from%20your%20homepage%20and%20would%20like%2520to%20register%20an%20appointment."
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 pointer-events-auto relative group"
          id="global-floating-whats-btn"
          title="Direct WhatsApp Appointment Helpline"
        >
          {/* Wave ripple */}
          <span className="absolute -inset-1 rounded-full border border-emerald-500/30 animate-ping pointer-events-none" />
          <MessageCircle className="w-7 h-7 fill-white/10" />
          
          {/* Tooltip trigger */}
          <span className={`absolute ${isUrdu ? "left-16 origin-left" : "right-16 origin-right"} scale-0 group-hover:scale-100 bg-clinical-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-md uppercase tracking-wider font-sans transition-transform duration-200 whitespace-nowrap`}>
            {isUrdu ? "ڈاکٹر سے بات کریں" : "WhatsApp Doctor"}
          </span>
        </motion.a>
      </div>

      {/* Header component */}
      <Header
        onBookClick={() => handleOpenBooking('physical', 'nawabshah')}
        onAuthClick={() => setIsAuthOpen(true)}
        onAdminClick={() => setIsAdminOpen(true)}
      />

      {/* Main sections */}
      <main className="relative" id="main-content">
        
        {/* 1. Hero */}
        <Hero onBookClick={() => handleOpenBooking('physical', 'nawabshah')} />

        {/* 2. Trust Metrics */}
        <TrustBar />

        {/* 3. About Doctor */}
        <AboutSection />

        {/* 4. Specialties Conditions */}
        <ConditionsSection onBookClick={() => handleOpenBooking('physical', 'nawabshah')} />

        {/* 5. Services & Specific Treatments */}
        <ServicesSection onBookClick={() => handleOpenBooking('online', 'nawabshah')} />

        {/* 6. Scientific Studies and Google Scholar */}
        <ResearchSection />

        {/* 7. Wellness Self-Assessment */}
        <SelfAssessment onBookClick={() => handleOpenBooking('physical', 'nawabshah')} />

        {/* 8. Testimonials Feedback */}
        <Testimonials />

        {/* 9. Branch Timelines */}
        <ClinicTimings />

        {/* 10. FAQs Accordions */}
        <FAQSection />

        {/* 11. Booking scheduler and Final CTA */}
        <ContactSection onOpenWizard={(mode, location, patient, country) => handleOpenBooking(mode, location, patient, country)} />
        
      </main>

      {/* Footer view */}
      <Footer />

      {/* Interactive Multi-step Appointment Booking Wizard Modal (Requirement 4: Public, No login needed!) */}
      <BookingWizardModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialMode={bookingInitialMode}
        initialLocation={bookingInitialLocation}
        initialPatient={bookingInitialPatient}
        initialCountry={bookingInitialCountry}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Admin Dashboard Portal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
