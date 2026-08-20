import { Condition, Treatment, FAQ, Publication, Testimonial, AssessmentQuestion } from './types';

export const DOCTOR_INFO = {
  name: "Dr. Fahad Ul Zain",
  title: "Consultant Psychiatrist",
  pmdc: "54095-S",
  qualifications: [
    { code: "MBBS", label: "Bachelor of Medicine, Bachelor of Surgery" },
    { code: "MD (Psychiatry)", label: "Doctor of Medicine in Psychiatry" },
    { code: "CHPE", label: "Certificate in Health Professions Education" },
    { code: "CAMH-C", label: "Child & Adolescent Mental Health Certification" }
  ],
  bio: "Dr. Fahad Ul Zain is a highly respected Consultant Psychiatrist dedicated to helping individuals restore emotional harmony and mental resilience. Through compassionate, strictly confidential, and evidence-based psychiatric consultations, he delivers deeply personalized healthcare routes for patients navigating psychological challenges.",
  philosophy: "Every patient deserves to be heard, respected, and treated with absolute compassion. Mental health care should be safe, confidential, and personalized around the unique story of each individual.",
  scholarUrl: "https://scholar.google.com/citations?hl=en&user=qf2PRKIAAAAJ",
  phone: "+92 370 2207890", // Consultant call helpline
  email: "fahadzain4@gmail.com",
  whatsappNumber: "+92 333 7030787" // WhatsApp consultation link
};

export const CLINIC_TIMINGS = {
  physical: {
    name: "Wali Psychiatry Center",
    address: "Plot 68, Mohammadi Town, opposite Abu Oil Mill, near Zero Point, Nawabshah",
    days: "Monday – Friday",
    hours: "4:00 PM – 9:00 PM",
    mapQuery: "Wali Psychiatry Center, Plot 68, Mohammadi Town, Nawabshah"
  },
  sunday: {
    name: "Hyderabad Consultation Clinic",
    address: "Hyderabad City Dental & Medical Complex, Hyderabad",
    days: "Every Sunday",
    hours: "2:00 PM – 5:00 PM",
    mapQuery: "Hyderabad"
  }
};

export const CONDITIONS: Condition[] = [
  {
    id: "anxiety",
    title: "Anxiety Disorders",
    description: "Generalized anxiety, obsessive worries, and intense physical symptoms of chronic alertness that disrupt daily functioning.",
    symptoms: [
      "Persistent worrying or feeling on edge",
      "Restlessness, muscle tension, or fatigue",
      "Irritability and panic sensations",
      "Avoidance of social or professional triggers"
    ],
    reassuringNote: "Anxiety is highly responsive to evidence-based pharmaceutical and therapeutic management. You are not alone, and calmness is achievable.",
    iconName: "ShieldAlert"
  },
  {
    id: "depression",
    title: "Depression & Low Mood",
    description: "Deep, persistent sadness, loss of interest in rewarding activities, energy depletion, and cognitive fatigue.",
    symptoms: [
      "Prolonged feelings of sadness or emptiness",
      "Loss of interest in hobbies and social circles",
      "Reduced energy, sluggishness, or sleep changes",
      "Feelings of worthlessness or excessive self-doubt"
    ],
    reassuringNote: "Depression is a physical, treatable neurological condition. Recovery is possible with structured clinical guidance.",
    iconName: "CloudRain"
  },
  {
    id: "panic",
    title: "Panic Attacks",
    description: "Sudden surges of overwhelming fear and intense physical sensations, often mimicking cardiovascular events.",
    symptoms: [
      "Sudden racing heart or chest tightness",
      "Shortness of breath and dizziness",
      "Trembling, sweating, or chills",
      "Fear of losing control or impending doom"
    ],
    reassuringNote: "Panic responses can be safely dysregulated and deactivated using clinical therapies and biological stabilizing management.",
    iconName: "Zap"
  },
  {
    id: "stress-burnout",
    title: "Stress & Chronic Burnout",
    description: "Extreme emotional and physical exhaustion caused by prolonged work stress, academic overload, or life adjustments.",
    symptoms: [
      "Complete physical and creative depletion",
      "Cynicism and emotional detachment",
      "Frequent headaches and lowered immunity",
      "Ineffectiveness and cognitive cloudiness"
    ],
    reassuringNote: "Slowing down and recovering is not a sign of failure. We configure practical boundary strategies and medical support to restore your spark.",
    iconName: "Flame"
  },
  {
    id: "sleep-problems",
    title: "Sleep Disorders",
    description: "Trouble falling asleep, night waking, early wakefulness, or restless sleep that impacts morning vitality.",
    symptoms: [
      "Taking over 30 minutes to drift off",
      "Waking up multiple times throughout the night",
      "Daytime drowsiness and lack of focus",
      "Pre-sleep racing thoughts and sleep-related anxiety"
    ],
    reassuringNote: "Restoring the natural circadian rhythm involves scientific sleep-hygiene protocols coupled with highly precise medical advice.",
    iconName: "Moon"
  },
  {
    id: "emotional-wellbeing",
    title: "Emotional Wellbeing Support",
    description: "Struggles with self-esteem, difficulty controlling high emotional peaks, mood sensitivity, and frequent self-criticism.",
    symptoms: [
      "Frequent shift in feelings and mood reactivity",
      "Harsh inner critic or persistent self-doubt",
      "Straining of personal relationships",
      "Overwhelming transitions or life setbacks"
    ],
    reassuringNote: "Developing strong psychological resilience is a learned clinical skill. It is normal to seek guidance during life transitions.",
    iconName: "Heart"
  },
  {
    id: "adjustment-difficulties",
    title: "Adjustment Difficulties",
    description: "Intense emotional distress, social withdrawal, or anxiety following a significant life change, loss, or relocation.",
    symptoms: [
      "Persistent state of feeling overwhelmed",
      "Difficulty accepting changes in health, family, or employment",
      "Social isolation or school/work underperformance",
      "Inability to concentrate or plan future steps"
    ],
    reassuringNote: "Navigating transitional storms is safer with professional mental scaffolding. Your coping reflexes can be nurtured.",
    iconName: "Compass"
  },
  {
    id: "mood-disorders",
    title: "Mood Disorders",
    description: "Significant fluctuations in energy, motivation, and temperament, extending beyond normal daily highs and lows.",
    symptoms: [
      "Cycles of heightened activation followed by severe drops",
      "Racing thoughts, fast speech, or impulsive choices",
      "Severe fatigue paired with despair in low phases",
      "Substantial impact on interpersonal relationships"
    ],
    reassuringNote: "Balanced mood regulation is achievable through evidence-based psychiatric observation and continuous chemical harmony.",
    iconName: "Sparkles"
  }
];

export const TREATMENTS: Treatment[] = [
  {
    id: "psych-eval",
    title: "Psychiatric Evaluation",
    description: "A deep-dive initial consultation exploring your biological, psychological, and social history to formulate a compassionate and precise mental health diagnosis.",
    benefits: [
      "Clear, stress-free clinical diagnosis",
      "Safe, unhurried space to share your history",
      "Collaborative baseline blueprint for recovery"
    ],
    suitableFor: "Anyone seeking a definitive, professional answer regarding their mental health symptoms.",
    iconName: "ClipboardCheck"
  },
  {
    id: "med-management",
    title: "Medication Management",
    description: "Carefully calibrated and strictly monitored pharmacotherapy utilizing modern, safe psychiatric medicines with minimal side effects to balance brain chemistry.",
    benefits: [
      "Minimization of side effects through conservative starting doses",
      "Continuous scientific review and medicine tuning",
      "Focus on dynamic weaning-off strategies when appropriate"
    ],
    suitableFor: "Patients with chemical imbalances like severe anxiety, mood swings, or biological depression.",
    iconName: "Pills"
  },
  {
    id: "anxiety-depression-rx",
    title: "Anxiety & Depression Treatments",
    description: "Dual-modality plans combining evidence-focused psychiatric medication, clinical psychoeducation, and specific cognitive stabilization guidance.",
    benefits: [
      "Targeted relief from physiological symptoms (palpitations, dread)",
      "Cognitive exercises to silence intrusive feedback loops",
      "Gradual return to a higher quality of life and peak vitality"
    ],
    suitableFor: "Individuals experiencing recurring dread, negative thoughts, or loss of life fulfillment.",
    iconName: "Activity"
  },
  {
    id: "sleep-management",
    title: "Sleep & Circadian Restoration",
    description: "Detailed analysis of insomnia and nightmares, blending medical solutions with modern Cognitive Behavioral Therapy for Insomnia (CBT-I) protocols.",
    benefits: [
      "Non-habit-forming medical sleeping aids when needed",
      "Custom body-clock resynchronization worksheets",
      "Deactivation of bedtime bedroom hyper-arousal"
    ],
    suitableFor: "Chronic insomniacs, night shift workers, or people with sleep maintenance challenges.",
    iconName: "RefreshCw"
  }
];

export const RESEARCH: Publication[] = [
  {
    id: "pub-1",
    title: "Mental Health Burden and Psychological Distress Among Medical Professionals and Students",
    journal: "PUMHS Academic Journal of Psychiatry",
    year: 2023,
    authors: "Zain FU., et al.",
    citation: "Explores the psychological impact, prevalence of burnout, and coping indexes among front-line healthcare trainees.",
    googleScholarUrl: "https://scholar.google.com/citations?hl=en&user=qf2PRKIAAAAJ",
    tags: ["Burnout", "Medical Education", "Anxiety", "Depression"]
  },
  {
    id: "pub-2",
    title: "Prevalence of Generalized Anxiety Disorder and Sleep Quality Anomalies in the Post-Pandemic Era",
    journal: "Pakistan Journal of Medical & Health Sciences (PJMHS)",
    year: 2022,
    authors: "Zain FU., Malik AR., Farooq S.",
    citation: "A multi-center cohort study evaluating high levels of sleep degradation and persistent panic profiles within Sindh populations.",
    googleScholarUrl: "https://scholar.google.com/citations?hl=en&user=qf2PRKIAAAAJ",
    tags: ["Anxiety", "Sleep Medicine", "Sindh Population"]
  },
  {
    id: "pub-3",
    title: "Evaluating the Efficacy of Clinical Health Professions Education (CHPE) Models on Patient-Doctor Communication",
    journal: "Journal of Medical Education and Ethics",
    year: 2021,
    authors: "Zain FU., Qureshi MH.",
    citation: "A comprehensive critique of pediatric and adolescent mental health consultation models, highlighting the impact of compassionate inquiry on patient diagnostics.",
    googleScholarUrl: "https://scholar.google.com/citations?hl=en&user=qf2PRKIAAAAJ",
    tags: ["CHPE", "Communication Skills", "Ethical Psychiatry"]
  }
];

export const WHY_TRUST_US = [
  {
    id: "confidential",
    title: "Confidential & Safe",
    description: "Every consult occurs in strict compliance with globally accepted psychiatric ethics. Your details are fully secure.",
    iconName: "Lock"
  },
  {
    id: "evidence",
    title: "Evidence-Based Support",
    description: "No pseudoscience. Our pharmaceutical choices and counseling tools have been validated by top academic peer testing.",
    iconName: "GraduationCap"
  },
  {
    id: "patient-centered",
    title: "Patient-Centered Comfort",
    description: "You are the expert of your lived experience. We listen unhurriedly and craft strategies alongside you rather than declaring them.",
    iconName: "HeartHandshake"
  },
  {
    id: "scholarly",
    title: "Academic Eminence",
    description: "Dr. Fahad is a registered PMDC practitioner, CHPE qualified, and an active psychiatric researcher with published scientific proof.",
    iconName: "BookOpen"
  }
];

export const FAQS: FAQ[] = [
  {
    id: "faq-1",
    question: "Is my psychiatric consultation completely confidential?",
    answer: "Absolutely. Confidentiality is the cornerstone of clinical psychiatric practice. Everything shared during your session—including your history, symptoms, and medical records—is protected under strict physician-patient confidentiality rules and will never be shared without your explicit consent."
  },
  {
    id: "faq-2",
    question: "How does the psychiatric treatment process actually work?",
    answer: "The process begins with an initial, unhurried diagnostic evaluation (40-50 minutes) to understand your history. Dr. Fahad then discusses your diagnosis and collaborates with you on a personalized action plan, which may include modern medication, science-backed lifestyle modifications, and practical coping exercises. Follow-up reviews are typically scheduled every 2 to 4 weeks to track your comfort and biological progress."
  },
  {
    id: "faq-3",
    question: "Are remote or online video consultations available?",
    answer: "Yes, Dr. Fahad offers secure and compliant online consultations via video call for patients who cannot travel to the Nawabshah or Hyderabad physical clinics. Prescriptions are generated digitally and transmitted securely to your mobile or email."
  },
  {
    id: "faq-4",
    question: "How long does psychiatric treatment usually take?",
    answer: "The duration of treatment is deeply personal and depends on the condition. For a single episode of mild-to-moderate anxiety or depression, patients typically complete a 6 to 9-month medical course. Chronic conditions might benefit from longer maintenance care to protect against symptom relapse. Our eventual goal is always to restore natural brain balance and help you taper off medications safely."
  },
  {
    id: "faq-5",
    question: "Can severe anxiety and deep depression really improve?",
    answer: "Yes, overwhelmingly so. Anxiety and depression are recognized clinical, neurobiological conditions that respond very well to modern science. Over 85% of patients experience significant symptom reduction, emotional stability, and a complete return to daily fulfillment when adhering to a professional clinical strategy."
  },
  {
    id: "faq-6",
    question: "When should I consider consulting a professional psychiatrist?",
    answer: "You should consult a psychiatrist if emotional distress begins interfering with your sleep, job performance, physical safety, or relationships. If feelings of sadness, anxiety, sudden panic, or racing thoughts persist for more than two consecutive weeks, speaking with a specialist is the safest step toward reclaiming control."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    patientInitials: "A. S.",
    location: "Nawabshah",
    feedback: "I struggled with chronic insomnia and panic attacks for over three years. Under Dr. Fahad's care, I felt immediately respected and listened to. His medication plan was very conservative, and he thoroughly answered all my worries. I now sleep safely and feel back to my true self.",
    feelingText: "Felt secure, understood, and emotionally balanced",
    timeframe: "4-month recovery"
  },
  {
    id: "t-2",
    patientInitials: "M. R.",
    location: "Hyderabad",
    feedback: "Deep work-related burnout and exhausting depression made it impossible to get out of bed. Dr. Fahad didn't just prescribe pills; he explained the biological chemistry of my symptoms and partnered with me on my healing. His compassionate check-ins gave me hope when I had none.",
    feelingText: "Restored energy, mental clarity, and clear focus",
    timeframe: "6-month recovery"
  },
  {
    id: "t-3",
    patientInitials: "S. K.",
    location: "Moro",
    feedback: "Finding a psychiatrist who respects confidentiality completely is tough in Sindh. Dr. Fahad Ul Zain's clinical approach is exemplary. He is exceptionally knowledgeable, ethical, and calm. Booking through WhatsApp was incredibly fast and stress-free.",
    feelingText: "Exceptional confidentiality, warmth, and safe guidance",
    timeframe: "Recovered during transitions"
  }
];

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    text: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
    category: "anxiety",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 2,
    text: "How often have you had trouble relaxing, or felt so restless that it's hard to sit still?",
    category: "anxiety",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 3,
    text: "Over the last 2 weeks, have you been bothered by little interest or pleasure in doing things?",
    category: "depression",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 4,
    text: "Have you been feeling down, depressed, flat, or severely hopeless?",
    category: "depression",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 5,
    text: "How often do you struggle to fall asleep or wake up exhausted, feeling your mind running with stress?",
    category: "sleep",
    options: [
      { label: "Rarely or never", score: 0 },
      { label: "A few times a week", score: 1 },
      { label: "Most nights", score: 2 },
      { label: "Every single night", score: 3 }
    ]
  },
  {
    id: 6,
    text: "Do psychological problems, worry, or physical exhaustion restrict your productivity and career performance?",
    category: "stress",
    options: [
      { label: "Hardly ever", score: 0 },
      { label: "Slightly or occasional burnout", score: 1 },
      { label: "Significantly difficult", score: 2 },
      { label: "Overwhelming physical weight", score: 3 }
    ]
  }
];
