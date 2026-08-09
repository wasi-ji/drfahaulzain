export type ConsultationMode = 'physical' | 'online';

export type PhysicalLocation = 'nawabshah' | 'hyderabad';

export interface CountryOption {
  code: string;
  name: string;
  currency: 'PKR' | 'USD';
  fee: number;
  flag: string;
  isPakistan: boolean;
}

export interface TimeSlot {
  id: string;
  time24: string; // e.g. "16:00"
  label: string;  // e.g. "04:00 PM"
  available: boolean;
  reasonDisabled?: string;
}

export type BookingStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface PatientInfo {
  fullName: string;
  age: string;
  phone: string;
  email: string;
  reason: string;
}

export type PaymentMethod = 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'stripe';

export interface BookingState {
  step: BookingStep;
  mode: ConsultationMode;
  location: PhysicalLocation; // 'nawabshah' default
  country: CountryOption | null;
  selectedDate: string; // YYYY-MM-DD
  selectedSlot: TimeSlot | null;
  patient: PatientInfo;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  referenceCode: string;
  createdAt?: string;
}

export interface BookingRecord extends BookingState {
  id: string;
  createdAt: string;
  status: 'confirmed' | 'pending_payment' | 'completed' | 'cancelled';
}

export interface LocationDetail {
  id: PhysicalLocation;
  nameEn: string;
  nameUr: string;
  hospitalEn: string;
  hospitalUr: string;
  daysEn: string;
  daysUr: string;
  hoursEn: string;
  hoursUr: string;
  maxSlots: number;
  allowedDayIndexes: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
}
