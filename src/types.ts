export interface Condition {
  id: string;
  title: string;
  description: string;
  symptoms: string[];
  reassuringNote: string;
  iconName: string;
}

export interface Treatment {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  suitableFor: string;
  iconName: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Publication {
  id: string;
  title: string;
  journal: string;
  year: number;
  authors: string;
  citation: string;
  googleScholarUrl: string;
  tags: string[];
}

export interface Testimonial {
  id: string;
  patientInitials: string;
  location: string;
  feedback: string;
  feelingText: string;
  timeframe: string;
}

export interface AssessmentQuestion {
  id: number;
  text: string;
  category: 'anxiety' | 'depression' | 'stress' | 'sleep';
  options: {
    label: string;
    score: number;
  }[];
}
