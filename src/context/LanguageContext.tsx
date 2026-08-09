import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { urTranslations, enTranslations } from "../translations";
import { Condition, Treatment, FAQ, Testimonial, AssessmentQuestion } from "../types";

type Language = "en" | "ur";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isUrdu: boolean;
  dir: "ltr" | "rtl";
  t: (key: keyof typeof enTranslations) => string;
  localizedConditions: Condition[];
  localizedTreatments: Treatment[];
  localizedFAQs: FAQ[];
  localizedTestimonials: Testimonial[];
  localizedQuestions: AssessmentQuestion[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("site_language");
    return (saved === "ur" || saved === "en") ? saved : "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("site_language", lang);
  };

  const isUrdu = language === "ur";
  const dir = isUrdu ? "rtl" : "ltr";

  // Side-effect to set html dir and lang attribute
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    
    // Add extra class to html/body for custom Urdu styling options if needed
    if (isUrdu) {
      document.documentElement.classList.add("urdu-mode");
    } else {
      document.documentElement.classList.remove("urdu-mode");
    }
  }, [language, dir, isUrdu]);

  const t = (key: keyof typeof enTranslations): string => {
    const dict = isUrdu ? urTranslations : enTranslations;
    return dict[key] || enTranslations[key] || String(key);
  };

  // Translated dynamic data based on current language state
  const localizedConditions: Condition[] = [
    {
      id: "anxiety",
      title: isUrdu ? "بے چینی اور اضطراب (Anxiety)" : "Anxiety Disorders",
      description: isUrdu
        ? "مسلسل پریشانی، وہم، اور ہر وقت ذہنی تناؤ یا جسمانی کھچاؤ محسوس ہونا جو روزمرہ کی زندگی کو متاثر کرتا ہے۔"
        : "Generalized anxiety, obsessive worries, and intense physical symptoms of chronic alertness that disrupt daily functioning.",
      symptoms: isUrdu
        ? [
            "مسلسل پریشانی یا حد سے زیادہ الجھن محسوس ہونا",
            "کھچاؤ، بے چینی، سر درد، جسمانی تھکن اور پٹھوں کا درد",
            "چڑچڑاپن اور اچانک خوف کا ابھرنا",
            "معاشرتی یا روزمرہ کے کاموں سے کترانا"
          ]
        : [
            "Persistent worrying or feeling on edge",
            "Restlessness, muscle tension, or fatigue",
            "Irritability and panic sensations",
            "Avoidance of social or professional triggers"
          ],
      reassuringNote: isUrdu
        ? "اضطراب کا علاج ادویات اور سائنسی تھراپی کی مدد سے انتہائی کامیابی کے ساتھ کیا جا سکتا ہے۔ آپ اکیلے نہیں ہیں۔"
        : "Anxiety is highly responsive to evidence-based pharmaceutical and therapeutic management. You are not alone, and calmness is achievable.",
      iconName: "ShieldAlert"
    },
    {
      id: "depression",
      title: isUrdu ? "ڈپریشن اور اداسی (Depression)" : "Depression & Low Mood",
      description: isUrdu
        ? "گہری اور مسلسل اداسی، زندگی کی دلچسپیوں کا خاتمہ، توانائی کی شدید کمی اور ذہنی تھکن۔"
        : "Deep, persistent sadness, loss of interest in rewarding activities, energy depletion, and cognitive fatigue.",
      symptoms: isUrdu
        ? [
            "مسلسل اداسی، مایوسی یا خالی پن کا احساس",
            "مشاغل اور قریبی دوستوں سے کترانا یا ملنے کا دل نہ کرنا",
            "شدید جسمانی سستی، نیند کے مسائل یا حد سے زیادہ سونا",
            "خود اعتمادی کی کمی اور خود کو قصوروار ٹھہرانا"
          ]
        : [
            "Prolonged feelings of sadness or emptiness",
            "Loss of interest in hobbies and social circles",
            "Reduced energy, sluggishness, or sleep changes",
            "Feelings of worthlessness or excessive self-doubt"
          ],
      reassuringNote: isUrdu
        ? "ڈپریشن ایک قابلِ علاج نیورولوجیکل (دماغی کیڑے کا) مسئلہ ہے۔ مناسب رہنمائی سے بحالی ممکن ہے۔"
        : "Depression is a physical, treatable neurological condition. Recovery is possible with structured clinical guidance.",
      iconName: "CloudRain"
    },
    {
      id: "panic",
      title: isUrdu ? "شدید پینک اٹیک (Panic Attacks)" : "Panic Attacks",
      description: isUrdu
        ? "اچانک خوف کا خوابناک حملہ اور شدید ہراس، جیسے دل کا تیز دھڑکنا یا دم گھٹنا۔"
        : "Sudden surges of overwhelming fear and intense physical sensations, often mimicking cardiovascular events.",
      symptoms: isUrdu
        ? [
            "اچانک دل کی دھڑکن کا تیز ہونا یا سینے میں دباؤ محسوس ہونا",
            "سانس لینے میں دقت اور سر کا چکرانا",
            "ہاتھوں کا کانپنا، پسینہ آنا یا سرد پٹھوں کی لہریں",
            "حواس کھو دینے یا جان نکل جانے کا شدید وہم اور خوف"
          ]
        : [
            "Sudden racing heart or chest tightness",
            "Shortness of breath and dizziness",
            "Trembling, sweating, or chills",
            "Fear of losing control or impending doom"
          ],
      reassuringNote: isUrdu
        ? "پینک اٹیک کو نیورو کیمیکل توازن اور تھراپی کی مدد سے مکمل طور پر روکا جا سکتا ہے۔"
        : "Panic responses can be safely dysregulated and deactivated using clinical therapies and biological stabilizing management.",
      iconName: "Zap"
    },
    {
      id: "stress-burnout",
      title: isUrdu ? "ذہنی تناؤ اور برن آؤٹ (Stress)" : "Stress & Chronic Burnout",
      description: isUrdu
        ? "طویل کام، کاروباری یا پڑھائی کے بوجھ کی وجہ سے پیدا ہونے والی مسلسل تھکن اور توانائی کی کمی۔"
        : "Extreme emotional and physical exhaustion caused by prolonged work stress, academic overload, or life adjustments.",
      symptoms: isUrdu
        ? [
            "جسمانی اور ذہنی کام کرنے کی قوت مکمل طور پر ختم ہو جانا",
            "کام یا پڑھائی کے متعلق مایوسی اور بیزاری محسوس کرنا",
            "بار بار سر درد ہونا اور قوتِ مدافعت کا کمزور ہونا",
            "توجہ مرکوز کرنے میں مشکلات اور بھولنے کی عادت"
          ]
        : [
            "Complete physical and creative depletion",
            "Cynicism and emotional detachment",
            "Frequent headaches and lowered immunity",
            "Ineffectiveness and cognitive cloudiness"
          ],
      reassuringNote: isUrdu
        ? "آرام کرنا اور مدد حاصل کرنا کمزوری نہیں ہے۔ ہم بہتر عادات اور علاج سے قوتِ مدافعت بحال کرتے ہیں۔"
        : "Slowing down and recovering is not a sign of failure. We configure practical boundary strategies and medical support to restore your spark.",
      iconName: "Flame"
    },
    {
      id: "sleep-problems",
      title: isUrdu ? "نیند کے امراض (Sleep)" : "Sleep Disorders",
      description: isUrdu
        ? "سونے میں دشواری، رات کو بار بار جاگنا، یا صبح مکمل نیند نہ ہونے کے بعد تھکن محسوس کرنا۔"
        : "Trouble falling asleep, night waking, early wakefulness, or restless sleep that impacts morning vitality.",
      symptoms: isUrdu
        ? [
            "بستر پر لیٹنے کے بعد ادھا گھنٹہ یا زیادہ دیر تک نیند نہ آنا",
            "رات کے وقت بار بار آنکھ کھلنا اور دوبارہ سونے میں دشواری",
            "دن بھر سستی چھائی رہنا اور کام پر توجہ نہ دے پانا",
            "سونے سے پہلے دماغ میں خیالات کا طوفان اور گھبراہٹ"
          ]
        : [
            "Taking over 30 minutes to drift off",
            "Waking up multiple times throughout the night",
            "Daytime drowsiness and lack of focus",
            "Pre-sleep racing thoughts and sleep-related anxiety"
          ],
      reassuringNote: isUrdu
        ? "باڈی کلاک کی بحالی کے لیے ہمارے پاس محفوظ اور غیر نشہ آور طبی حل موجود ہیں۔"
        : "Restoring the natural circadian rhythm involves scientific sleep-hygiene protocols coupled with highly precise medical advice.",
      iconName: "Moon"
    },
    {
      id: "emotional-wellbeing",
      title: isUrdu ? "جذباتی سکون کی بحالی (Wellbeing)" : "Emotional Wellbeing Support",
      description: isUrdu
        ? "خود اعتمادی میں کمی، موڈ کا مزاج تیزی سے تبدیل ہونا، اور ضرورت سے زیادہ خود پر تنقید کرنا۔"
        : "Struggles with self-esteem, difficulty controlling high emotional peaks, mood sensitivity, and frequent self-criticism.",
      symptoms: isUrdu
        ? [
            "موڈ کا غیر معمولی ردعمل یا چھوٹی باتوں پر زیادہ پریشان ہونا",
            "خود پر حد سے زیادہ تنقید اور کمتری کا احساس",
            "لوگوں یا گھر والوں کے ساتھ تعلقات میں جھنجھلاہٹ",
            "زندگی میں آنے والی کسی بڑی تبدیلی کو قبول کرنے میں مشکلات"
          ]
        : [
            "Frequent shift in feelings and mood reactivity",
            "Harsh inner critic or persistent self-doubt",
            "Straining of personal relationships",
            "Overwhelming transitions or life setbacks"
          ],
      reassuringNote: isUrdu
        ? "ذہنی لچک پیدا کرنا سیکھا ہوا کلینکل ہنر ہے۔ زندگی کے مشکل مراحل میں رہنمائی حاصل کرنا دانشمندی ہے۔"
        : "Developing strong psychological resilience is a learned clinical skill. It is normal to seek guidance during life transitions.",
      iconName: "Heart"
    },
    {
      id: "adjustment-difficulties",
      title: isUrdu ? "رنگ و مائل مشکلات (Adjustment)" : "Adjustment Difficulties",
      description: isUrdu
        ? "نئی جگہ منتقلی، نوکری کی تبدیلی یا کسی بڑے نقصان کے بعد زندگی میں تعطل کا شکار ہونا۔"
        : "Intense emotional distress, social withdrawal, or anxiety following a significant life change, loss, or relocation.",
      symptoms: isUrdu
        ? [
            "ہر وقت دباؤ اور حالات کی مغلوبیت کا احساس",
            "صحت، رقم یا خاندان کے بدلتے ہوئے اصول ماننے میں دشواری",
            "سب سے کٹ کر رہنا اور سماجی تنہائی اختیار کرنا",
            "مستقبل کے فیصلے کرنے اور منصوبہ بندی کرنے میں عاجز ہونا"
          ]
        : [
            "Persistent state of feeling overwhelmed",
            "Difficulty accepting changes in health, family, or employment",
            "Social isolation or school/work underperformance",
            "Inability to concentrate or plan future steps"
          ],
      reassuringNote: isUrdu
        ? "حالات کی تبدیلی سے نبرد آزما ہونا اکیلے مشکل ہو سکتا ہے۔ ہم آپ کو مناسب سہارا فراہم کرتے ہیں۔"
        : "Navigating transitional storms is safer with professional mental scaffolding. Your coping reflexes can be nurtured.",
      iconName: "Compass"
    },
    {
      id: "mood-disorders",
      title: isUrdu ? "شدید موڈ موصلیات (Mood Disorders)" : "Mood Disorders",
      description: isUrdu
        ? "توانائی، حوصلے اور مزاج میں آنے والا بڑا اتار چڑھاؤ جو روزمرہ تعلقات کو شدید متاثر کرتا ہے۔"
        : "Significant fluctuations in energy, motivation, and temperament, extending beyond normal daily highs and lows.",
      symptoms: isUrdu
        ? [
            "کچھ دن غیر معمولی خوشی اور توانائی، اور کچھ دن گہری اداسی کے چکر",
            "تیز رفتاری سے بولنا یا جلد بازی میں اہم فیصلے کر لینا",
            "اداسی کے فیز میں جسمانی توانائی کی شدید کمی اور مایوسی",
            "کام کی کارکردگی اور رشتوں پر منفی نتائج کا بار بار ظاہر ہونا"
          ]
        : [
            "Cycles of heightened activation followed by severe drops",
            "Racing thoughts, fast speech, or impulsive choices",
            "Severe fatigue paired with despair in low phases",
            "Substantial impact on interpersonal relationships"
          ],
      reassuringNote: isUrdu
        ? "موڈ کو اعتدال پر لانا سائنسی طبی مشاہدے اور جدید ادویات کی مدد سے سو فیصد یقینی ہے۔"
        : "Balanced mood regulation is achievable through evidence-based psychiatric observation and continuous chemical harmony.",
      iconName: "Sparkles"
    }
  ];

  const localizedTreatments: Treatment[] = [
    {
      id: "psych-eval",
      title: isUrdu ? "تفصیلی نفسیاتی معائنہ" : "Psychiatric Evaluation",
      description: isUrdu
        ? "آپ کی جسمانی، نفسیاتی اور خاندانی تاریخ کا گہرائی سے اطمینان بخش جائزہ تاکہ ایک درست تشخیص کی جا سکے۔"
        : "A deep-dive initial consultation exploring your biological, psychological, and social history to formulate a compassionate and precise mental health diagnosis.",
      benefits: isUrdu
        ? [
            "بغیر کسی جلد بازی کے مسائل اور تاریخ شیئر کرنے کا پرسکون ماحول",
            "ایک مستند اور سائنسی طور پر درست تشخیص کا حصول",
            "صحت یابی کے لیے باہمی مشورے سے تشکیلی روڈ میپ"
          ]
        : [
            "Clear, stress-free clinical diagnosis",
            "Safe, unhurried space to share your history",
            "Collaborative baseline blueprint for recovery"
          ],
      suitableFor: isUrdu
        ? "ہر وہ فرد جو اپنی ذہنی صحت اور علامات کے بارے میں درست ترین حتمی رائے مانگتا ہے۔"
        : "Anyone seeking a definitive, professional answer regarding their mental health symptoms.",
      iconName: "ClipboardCheck"
    },
    {
      id: "med-management",
      title: isUrdu ? "ادویات کا سائنسی انتظام" : "Medication Management",
      description: isUrdu
        ? "دماغی کیمیکلز کو متوازن کرنے کے لیے انتہائی جدید، محفوظ اور کم سے کم سائیڈ ایفیکٹس والی درست دوا تجویز کرنا۔"
        : "Carefully calibrated and strictly monitored pharmacotherapy utilizing modern, safe psychiatric medicines with minimal side effects to balance brain chemistry.",
      benefits: isUrdu
        ? [
            "دورِ جدید کی محفوظ ترین ادویات کا ہلکی ترین مقدار سے ہدف دار آغاز",
            "باقاعدگی سے دوز اور اثرات کا سائنسی مشاہدہ اور تبدیلی",
            "نشے سے پاک اور صحت یابی کے بعد گاہے بگاہے دوا کم کرنے کا نظام"
          ]
        : [
            "Minimization of side effects through conservative starting doses",
            "Continuous scientific review and medicine tuning",
            "Focus on dynamic weaning-off strategies when appropriate"
          ],
      suitableFor: isUrdu
        ? "وہ افراد جنہیں شدید ذہنی تناؤ، ڈیپریشن یا ہارمونل توازن کے لیے طبی مدد درکار ہے۔"
        : "Patients with chemical imbalances like severe anxiety, mood swings, or biological depression.",
      iconName: "Pills"
    },
    {
      id: "anxiety-depression-rx",
      title: isUrdu ? "ڈپریشن اور اینگزائٹی کا مربوط علاج" : "Anxiety & Depression Treatments",
      description: isUrdu
        ? "ایک ایسا مربوط علاج جس میں ادویات کے ساتھ ساتھ کونسلنگ، شعوری تربیت اور مشورے شامل ہیں۔"
        : "Dual-modality plans combining evidence-focused psychiatric medication, clinical psychoeducation, and specific cognitive stabilization guidance.",
      benefits: isUrdu
        ? [
            "جسمانی علامات، گھبراہٹ اور دل کی دھڑکن کے مسائل سے فوری نجات",
            "نفی خیالات اور وہم کے طوفان کو قابو کرنے کی تھراپی",
            "ایک صحت مند، پرسکون اور بہتر معیار زندگی کی طرف واپسی"
          ]
        : [
            "Targeted relief from physiological symptoms (palpitations, dread)",
            "Cognitive exercises to silence intrusive feedback loops",
            "Gradual return to a higher quality of life and peak vitality"
          ],
      suitableFor: isUrdu
        ? "ایسے لوگ جو مسلسل گہرے خوف، اداسی، مایوسی یا دل کی گھبراہٹ کا سامنا کر رہے ہیں۔"
        : "Individuals experiencing recurring dread, negative thoughts, or loss of life fulfillment.",
      iconName: "Activity"
    },
    {
      id: "sleep-management",
      title: isUrdu ? "نیند اور باڈی کلاک کی درستی" : "Sleep & Circadian Restoration",
      description: isUrdu
        ? "نیند نہ آنے (Insomnia) اور رات کو خوابوں کے ڈراؤنے اثرات کا معائنہ اور ان کا بہترین سائنسی علاج۔"
        : "Detailed analysis of insomnia and nightmares, blending medical solutions with modern Cognitive Behavioral Therapy for Insomnia (CBT-I) protocols.",
      benefits: isUrdu
        ? [
            "غیر نشہ آور طریقے سے نیند لانے کے لیے خصوصی مددگار ادویات کا درست استعمال",
            "طبی باڈی کلاک کو درست کرنے کا پرسنلائزڈ چارٹ",
            "بستر پر جانے کے خوف اور بے چینی کو پُرسکون طریقے سے زائل کرنا"
          ]
        : [
            "Non-habit-forming medical sleeping aids when needed",
            "Custom body-clock resynchronization worksheets",
            "Deactivation of bedtime bedroom hyper-arousal"
          ],
      suitableFor: isUrdu
        ? "وہ مریض جو نیند کے شدید بگاڑ، دیر تک بیدار رہنے، یا صبح بیدار ہو کر شدید تھکن محسوس کرتے ہیں۔"
        : "Chronic insomniacs, night shift workers, or people with sleep maintenance challenges.",
      iconName: "RefreshCw"
    }
  ];

  const localizedFAQs: FAQ[] = [
    {
      id: "faq-1",
      question: isUrdu
        ? "کیا میرى مشاورت اور تفصیلا ت مکمل طور پر صیغہ راز میں رکھی جائیں گی؟"
        : "Is my psychiatric consultation completely confidential?",
      answer: isUrdu
        ? "جی ہاں، بالکل۔ رازداری نفسیاتی علاج کا بنیادی ستون ہے۔ آپ کی تاریخ، آپ کی علامات، اور جو کچھ بھی آپ ڈاکٹر صاحب سے شیئر کرتے ہیں، وہ مکمل طور پر قانوناً اور اخلاقاً خفیہ رکھا جاتا ہے۔ کوئی بھی تفصیلات آپ کی اجازت کے بغیر کسی دوسرے فرد سے شیئر نہیں کی جاتیں۔"
        : "Absolutely. Confidentiality is the cornerstone of clinical psychiatric practice. Everything shared during your session—including your history, symptoms, and medical records—is protected under strict physician-patient confidentiality rules and will never be shared without your explicit consent."
    },
    {
      id: "faq-2",
      question: isUrdu
        ? "نفسیاتی علاج کا پورا عمل کس طرح کام کرتا ہے؟"
        : "How does the psychiatric treatment process actually work?",
      answer: isUrdu
        ? "علاج کا آغاز ایک تفصیلاتی معائنے (تقریباً 40 سے 50 منٹ) سے ہوتا ہے جس میں آپ کا پس منظر سمجھا جاتا ہے۔ اس کے بعد ڈاکٹر فہد آپ کی تشخیص کے مطابق ایک طریقہ کار مرتب کرتے ہیں جس میں احتیاط سے ادویات، طرز زندگی میں تبدیلیاں، اور مشاورت شامل ہوتی ہے۔ ہر 2 سے 4 ہفتوں کے بعد فالو اپ سیشنز ہوتے ہیں تاکہ آپ کے سکون اور بہتری کا جائزہ لیا جا سکے۔"
        : "The process begins with an initial, unhurried diagnostic evaluation (40-50 minutes) to understand your history. Dr. Fahad then discusses your diagnosis and collaborates with you on a personalized action plan, which may include modern medication, science-backed lifestyle modifications, and practical coping exercises. Follow-up reviews are typically scheduled every 2 to 4 weeks to track your comfort and biological progress."
    },
    {
      id: "faq-3",
      question: isUrdu
        ? "کیا گھر بیٹھے آن لائن ویڈیو کال کے ذریعے بھی معائنہ کرایا جا سکتا ہے؟"
        : "Are remote or online video consultations available?",
      answer: isUrdu
        ? "جی بالکل۔ ڈاکٹر فہد ان مریضوں کے لیے جو نوابشاہ یا حیدرآباد کے فزیکل کلینک کا سفر نہیں کر سکتے، محفوظ اور انتہائی آسان آن لائن ویڈیو کال کے ذریعے مشاورت فراہم کرتے ہیں۔ آپ کا ڈیجیٹل نسخہ واٹس ایپ یا ای میل پر بھیج دیا جاتا ہے جو کہ ہر معتبر میڈیکل اسٹور پر کارآمد ہے۔"
        : "Yes, Dr. Fahad offers secure and compliant online consultations via video call for patients who cannot travel to the Nawabshah or Hyderabad physical clinics. Prescriptions are generated digitally and transmitted securely to your mobile or email."
    },
    {
      id: "faq-4",
      question: isUrdu
        ? "نفسیاتی علاج میں عام طور پر کتنا عرصہ لگتا ہے؟"
        : "How long does psychiatric treatment usually take?",
      answer: isUrdu
        ? "علاج کا دورانیہ ہر مریض کی نوعیت پر منحصر ہوتا ہے۔ ہلکے یا درمیانے درجے کے اینگزائٹی یا ڈپریشن کے لیے عموماً 6 سے 9 ماہ کا کورس درکار ہوتا ہے۔ بعض طویل العمری مسائل کو طویل وقتی نگرانی کی ضرورت ہوتی ہے تاکہ مرض دوبارہ سر نہ اٹھائے۔ ہمارا مقصد ہمیشہ آپ کو ادویات سے بتدریج اور بحفاظت نجات دلانا ہوتا ہے۔"
        : "The duration of treatment is deeply personal and depends on the condition. For a single episode of mild-to-moderate anxiety or depression, patients typically complete a 6 to 9-month medical course. Chronic conditions might benefit from longer maintenance care to protect against symptom relapse. Our eventual goal is always to restore natural brain balance and help you taper off medications safely."
    },
    {
      id: "faq-5",
      question: isUrdu
        ? "کیا گہری اینگزائٹی اور پرانے ڈپریشن سے واقعی نجات مل سکتی ہے؟"
        : "Can severe anxiety and deep depression really improve?",
      answer: isUrdu
        ? "جی ہاں، سو فیصد۔ اینگزائٹی اور ڈپریشن مروجہ کیمیائی اور نیورو بائیولوجیکل مسائل ہیں جن کا علاج میڈیکل سائنس میں بہترین انداز میں موجود ہے۔ تقریباً 85 فیصد سے زائد مریض مناسب طریقہ علاج پر کاربند رہنے کے بعد بالکل نارمل ذہنی توازن حاصل کرتے ہیں اور اپنی خوشگوار زندگی کی طرف لوٹ جاتے ہیں۔"
        : "Yes, overwhelmingly so. Anxiety and depression are recognized clinical, neurobiological conditions that respond very well to modern science. Over 85% of patients experience significant symptom reduction, emotional stability, and a complete return to daily fulfillment when adhering to a professional clinical strategy."
    },
    {
      id: "faq-6",
      question: isUrdu
        ? "مجھے کب سمجھنا چاہیے کہ مجھے اب سائیکاٹرسٹ سے رجوع کرنا ضروری ہے؟"
        : "When should I consider consulting a professional psychiatrist?",
      answer: isUrdu
        ? "جب آپ کی جذباتی بے چینی یا اداسی آپ کی روزمرہ زندگی، نیند، نوکری، گھریلو تعلقات یا آپ کی حفاظت کو متاثر کرنے لگے۔ اگر مسلسل دو ہفتوں سے زیادہ اداسی، گھبراہٹ یا دماغ میں برے خیالات تانتے باندھے رہیں، تو کسی ماہر سے مشورہ کرنے میں ہچکچاہٹ بالکل نہیں کرنی چاہیے۔"
        : "You should consult a psychiatrist if emotional distress begins interfering with your sleep, job performance, physical safety, or relationships. If feelings of sadness, anxiety, sudden panic, or racing thoughts persist for more than two consecutive weeks, speaking with a specialist is the safest step toward reclaiming control."
    }
  ];

  const localizedTestimonials: Testimonial[] = [
    {
      id: "t-1",
      patientInitials: "اے ایس",
      location: isUrdu ? "نوابشاہ" : "Nawabshah",
      feedback: isUrdu
        ? "میں پچھلے تین سالوں سے شدید پینک اٹیک اور بے خوابی کا شکار تھا۔ ڈاکٹر فہد کے پاس آکر مجھے پہلی بار لگا کہ میری بات غور سے سنی جا رہی ہے۔ ان کا ادویات دینے کا انداز بہت سمجھدار اور پرسکون ہے، دوز بھی مناسب رکھتی ہے جِس کا سائیڈ ایفیکٹ نہیں ہوا۔ میں اب بالکل ٹھیک ہوں اور سکون کی نیند سوتا ہوں۔"
        : "I struggled with chronic insomnia and panic attacks for over three years. Under Dr. Fahad's care, I felt immediately respected and listened to. His medication plan was very conservative, and he thoroughly answered all my worries. I now sleep safely and feel back to my true self.",
      feelingText: isUrdu
        ? "خود کو پُرسکون، صیغہ راز میں اور توازن کی طرف لوٹتا پایا"
        : "Felt secure, understood, and emotionally balanced",
      timeframe: isUrdu ? "4 ماہ کا بہترین سفر" : "4-month recovery"
    },
    {
      id: "t-2",
      patientInitials: "ایم آر",
      location: isUrdu ? "حیدرآباد" : "Hyderabad",
      feedback: isUrdu
        ? "شدید برن آؤٹ اور اداسی کی وجہ سے صبح بستر سے اٹھنا بھی عذاب لگتا تھا۔ ڈاکٹر فہد نے مجھے صرف گولیاں نہیں دیں، بلکہ میرے دماغ کی کیمیکل تبدیلیوں کو بڑی خوبصورتی سے سمجھایا اور ہمدردی سے میرا حوصلہ بڑھایا۔ ان کی کونسلنگ سے مجھے مایوسی سے بچنے کی نوید ملی۔"
        : "Deep work-related burnout and exhausting depression made it impossible to get out of bed. Dr. Fahad didn't just prescribe pills; he explained the biological chemistry of my symptoms and partnered with me on my healing. His compassionate check-ins gave me hope when I had none.",
      feelingText: isUrdu
        ? "دوبارہ حاصل شدہ توانائی، ذہنی صفائی اور بھرپور توجہ"
        : "Restored energy, mental clarity, and clear focus",
      timeframe: isUrdu ? "6 ماہ کا بحالی نظام" : "6-month recovery"
    },
    {
      id: "t-3",
      patientInitials: "ایس کے",
      location: isUrdu ? "مورو" : "Moro",
      feedback: isUrdu
        ? "سندھ میں ایسے ڈاکٹر ملنا جو آپ کے مسائل سو فیصد والہانہ رازداری سے رکھیں بہت نایاب ہے۔ ڈاکٹر فہد ال زین کا رویہ اور علمی قابلیت مثالی ہے۔ ان کے ساتھ واٹس ایپ سے بکنگ کرنا بےحد آسان اور تیز ترین تھا۔"
        : "Finding a psychiatrist who respects confidentiality completely is tough in Sindh. Dr. Fahad Ul Zain's clinical approach is exemplary. He is exceptionally knowledgeable, ethical, and calm. Booking through WhatsApp was incredibly fast and stress-free.",
      feelingText: isUrdu
        ? "شاندار رازداری، بہترین مشورے اور بھروسہ"
        : "Exceptional confidentiality, warmth, and safe guidance",
      timeframe: isUrdu ? "مشکل وقت میں مکمل معاونت" : "Recovered during transitions"
    }
  ];

  const localizedQuestions: AssessmentQuestion[] = [
    {
      id: 1,
      text: isUrdu
        ? "پچھلے ۲ ہفتوں کے دوران، آپ کو کتنی بار بے چینی، گھبراہٹ، یا حد سے زیادہ الجھن کا احساس ہوا ہے؟"
        : "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
      category: "anxiety",
      options: [
        { label: isUrdu ? "بالکل بھی نہیں" : "Not at all", score: 0 },
        { label: isUrdu ? "کچھ دن" : "Several days", score: 1 },
        { label: isUrdu ? "آدھے سے زیادہ دن" : "More than half the days", score: 2 },
        { label: isUrdu ? "تقریباً روزانہ" : "Nearly every day", score: 3 }
      ]
    },
    {
      id: 2,
      text: isUrdu
        ? "کیا آپ کو پُرسکون ہونے میں دشواری محسوس ہوئی، یا اتنی بے چینی تھی کہ ایک جگہ ٹکنا مشکل تھا؟"
        : "How often have you had trouble relaxing, or felt so restless that it's hard to sit still?",
      category: "anxiety",
      options: [
        { label: isUrdu ? "بالکل بھی نہیں" : "Not at all", score: 0 },
        { label: isUrdu ? "کچھ دن" : "Several days", score: 1 },
        { label: isUrdu ? "آدھے سے زیادہ دن" : "More than half the days", score: 2 },
        { label: isUrdu ? "تقریباً روزانہ" : "Nearly every day", score: 3 }
      ]
    },
    {
      id: 3,
      text: isUrdu
        ? "پچھلے ۲ ہفتوں کے دوران، آپ کو کاموں یا اپنی پسندیدہ چیزوں میں دلچسپی یا خوشی محسوس ہونے کی کمی نے کتنا متاثر کیا؟"
        : "Over the last 2 weeks, have you been bothered by little interest or pleasure in doing things?",
      category: "depression",
      options: [
        { label: isUrdu ? "بالکل بھی نہیں" : "Not at all", score: 0 },
        { label: isUrdu ? "کچھ دن" : "Several days", score: 1 },
        { label: isUrdu ? "آدھے سے زیادہ دن" : "More than half the days", score: 2 },
        { label: isUrdu ? "تقریباً روزانہ" : "Nearly every day", score: 3 }
      ]
    },
    {
      id: 4,
      text: isUrdu
        ? "کیا آپ کو مایوسی، شدید اداسی، سستی یا ناامیدی محسوس ہوئی ہے؟"
        : "Have you been feeling down, depressed, flat, or severely hopeless?",
      category: "depression",
      options: [
        { label: isUrdu ? "بالکل بھی نہیں" : "Not at all", score: 0 },
        { label: isUrdu ? "کچھ دن" : "Several days", score: 1 },
        { label: isUrdu ? "آدھے سے زیادہ دن" : "More than half the days", score: 2 },
        { label: isUrdu ? "تقریباً روزانہ" : "Nearly every day", score: 3 }
      ]
    },
    {
      id: 5,
      text: isUrdu
        ? "کیا آپ کو سونے میں دشواری ہوتی ہے، یا بیدار ہونے پر شدید دماغی تناؤ اور تھکن لگتی ہے؟"
        : "How often do you struggle to fall asleep or wake up exhausted, feeling your mind running with stress?",
      category: "sleep",
      options: [
        { label: isUrdu ? "شاذ و نادر یا کبھی نہیں" : "Rarely or never", score: 0 },
        { label: isUrdu ? "ہفتے میں چند دن" : "A few times a week", score: 1 },
        { label: isUrdu ? "بیشتر راتیں" : "Most nights", score: 2 },
        { label: isUrdu ? "ہر سنگل رات" : "Every single night", score: 3 }
      ]
    },
    {
      id: 6,
      text: isUrdu
        ? "کیا یہ گھبراہٹ، پریشانیاں، یا تھکن آپ کے روزمرہ کاموں اور نوکری کی صلاحیت کو مغلوب کرتی ہیں؟"
        : "Do psychological problems, worry, or physical exhaustion restrict your productivity and career performance?",
      category: "stress",
      options: [
        { label: isUrdu ? "شاید ہی کبھی" : "Hardly ever", score: 0 },
        { label: isUrdu ? "معمولی یا تھوڑا برن آؤٹ" : "Slightly or occasional burnout", score: 1 },
        { label: isUrdu ? "کافی حد تک مشکلات" : "Significantly difficult", score: 2 },
        { label: isUrdu ? "انتہائی بھاری اور مغلوب کن" : "Overwhelming physical weight", score: 3 }
      ]
    }
  ];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isUrdu,
        dir,
        t,
        localizedConditions,
        localizedTreatments,
        localizedFAQs,
        localizedTestimonials,
        localizedQuestions
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
