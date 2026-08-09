import {
  BookingRecord,
  BookingState,
  ConsultationMode,
  CountryOption,
  LocationDetail,
  PhysicalLocation,
  TimeSlot
} from '../types/booking';
import { isDateBlocked, getBlockedDateRecord } from './adminService';

export const DOCTOR_WHATSAPP = '923337030787'; // Standard Dr. Fahad WhatsApp helpline

export const LOCATION_DETAILS: Record<PhysicalLocation, LocationDetail> = {
  nawabshah: {
    id: 'nawabshah',
    nameEn: 'Wali Hospital, Nawabshah',
    nameUr: 'ولی ہسپتال، نوابشاہ',
    hospitalEn: 'Wali Psychiatry Centre, Wali Hospital',
    hospitalUr: 'ولی سائیکاٹری سینٹر، ولی ہسپتال',
    daysEn: 'Monday to Friday',
    daysUr: 'سوموار تا جمعہ',
    hoursEn: '04:00 PM – 09:00 PM',
    hoursUr: 'شام 4:00 بجے تا رات 9:00 بجے',
    maxSlots: 10,
    allowedDayIndexes: [1, 2, 3, 4, 5], // Mon, Tue, Wed, Thu, Fri
  },
  hyderabad: {
    id: 'hyderabad',
    nameEn: 'Hyderabad Specialist Clinic',
    nameUr: 'حیدرآباد اسپیشلسٹ کلینک',
    hospitalEn: 'Consultant OPD, Hyderabad',
    hospitalUr: 'کنسلٹنٹ او پی ڈی، حیدرآباد',
    daysEn: 'Sunday Only',
    daysUr: 'صرف اتوار',
    hoursEn: '03:00 PM – 05:00 PM',
    hoursUr: 'دوپہر 3:00 بجے تا شام 5:00 بجے',
    maxSlots: 4,
    allowedDayIndexes: [0], // Sun
  },
};

/**
  Check if date is within 30 days from today
*/
export function isWithin30Days(targetDate: Date, now: Date = new Date()): boolean {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30);

  const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  return target >= today && target <= maxDate;
}

/**
  Check if targetDate is today and current time is past 12:00 PM Noon cutoff
*/
export function isSameDayPastCutoff(targetDate: Date, now: Date = new Date()): boolean {
  const isToday =
    targetDate.getFullYear() === now.getFullYear() &&
    targetDate.getMonth() === now.getMonth() &&
    targetDate.getDate() === now.getDate();

  if (!isToday) return false;
  
  // Cutoff rule: 12:00 PM Noon (12:00)
  return now.getHours() >= 12;
}

/**
  Check if a day of week (0=Sun, 1=Mon...6=Sat) is allowed for mode + location
*/
export function isAllowedDayOfWeek(
  dayIndex: number,
  mode: ConsultationMode,
  location: PhysicalLocation
): boolean {
  if (dayIndex === 6) {
    // Saturday is closed
    return false;
  }

  if (mode === 'physical') {
    if (location === 'nawabshah') {
      return dayIndex >= 1 && dayIndex <= 5; // Mon-Fri
    } else if (location === 'hyderabad') {
      return dayIndex === 0; // Sun only
    }
  } else if (mode === 'online') {
    // Online allowed Mon-Fri (1-5) AND Sun (0)
    return (dayIndex >= 1 && dayIndex <= 5) || dayIndex === 0;
  }

  return false;
}

export interface DateValidationResult {
  allowed: boolean;
  reasonEn?: string;
  reasonUr?: string;
}

/**
  Comprehensive check whether a calendar date is selectable
*/
export function validateBookingDate(
  date: Date,
  mode: ConsultationMode,
  location: PhysicalLocation,
  now: Date = new Date()
): DateValidationResult {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Check if date is blocked by clinic administration
  const dateFormatted = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  if (isDateBlocked(dateFormatted)) {
    const blockedInfo = getBlockedDateRecord(dateFormatted);
    return {
      allowed: false,
      reasonEn: blockedInfo?.reasonEn || 'This date is closed for bookings by clinic administration',
      reasonUr: blockedInfo?.reasonUr || 'یہ تاریخ کلینک انتظامیہ کی طرف سے بکنگ کے لیے بند کی گئی ہے',
    };
  }

  // Past dates
  if (target < today) {
    return {
      allowed: false,
      reasonEn: 'Past dates cannot be selected',
      reasonUr: 'گزشتہ تاریخ منتخب نہیں کی جا سکتی',
    };
  }

  // Beyond 30 days
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30);

  if (target > maxDate) {
    return {
      allowed: false,
      reasonEn: 'Bookings are strictly limited to 30 days in advance',
      reasonUr: 'اپوائنٹمنٹ صرف 30 دن پہلے تک بک کی جا سکتی ہے',
    };
  }

  // Same-day cutoff rule (12:00 PM Noon)
  if (target.getTime() === today.getTime() && now.getHours() >= 12) {
    return {
      allowed: false,
      reasonEn: 'Same-day booking closes at 12:00 PM Noon. Please select tomorrow or a future date.',
      reasonUr: 'آج کی اپوائنٹمنٹ کا وقت دوپہر 12:00 بجے ختم ہو چکا ہے۔ برائے مہربانی کل یا آئندہ دن کی تاریخ منتخب کریں۔',
    };
  }

  // Day of week operating rule
  const dayIndex = date.getDay();
  if (!isAllowedDayOfWeek(dayIndex, mode, location)) {
    if (dayIndex === 6) {
      return {
        allowed: false,
        reasonEn: 'Clinic is closed on Saturdays',
        reasonUr: 'ہفتے کے دن کلینک بند ہوتا ہے',
      };
    }
    if (mode === 'physical' && location === 'nawabshah') {
      return {
        allowed: false,
        reasonEn: 'Nawabshah clinic operates Monday to Friday only',
        reasonUr: 'نوابشاہ کلینک صرف سوموار تا جمعہ آن ہے',
      };
    }
    if (mode === 'physical' && location === 'hyderabad') {
      return {
        allowed: false,
        reasonEn: 'Hyderabad OPD operates on Sundays only',
        reasonUr: 'حیدرآباد او پی ڈی صرف اتوار کو آن ہوتی ہے',
      };
    }
    return {
      allowed: false,
      reasonEn: 'Doctor is unavailable on this day for selected consultation mode',
      reasonUr: 'اس دن منتخب کردہ سہولت دستیاب نہیں ہے',
    };
  }

  return { allowed: true };
}

/**
  Generate available 30-minute time slots for a specific date
*/
export function generateTimeSlots(
  dateStr: string, // YYYY-MM-DD
  mode: ConsultationMode,
  location: PhysicalLocation,
  bookedSlotIds: string[] = [],
  now: Date = new Date()
): TimeSlot[] {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayIndex = dateObj.getDay();

  // Validate date first
  const dateValidation = validateBookingDate(dateObj, mode, location, now);
  if (!dateValidation.allowed) {
    return [];
  }

  // Determine hours range
  // Nawabshah or (Online on Mon-Fri) -> 16:00 to 21:00 (10 slots)
  // Hyderabad or (Online on Sunday) -> 15:00 to 17:00 (4 slots)
  let startHour = 16;
  let endHour = 21;

  if (mode === 'physical' && location === 'hyderabad') {
    startHour = 15;
    endHour = 17;
  } else if (mode === 'online' && dayIndex === 0) {
    // Sunday online
    startHour = 15;
    endHour = 17;
  }

  const slots: TimeSlot[] = [];

  for (let hour = startHour; hour < endHour; hour++) {
    for (const mins of [0, 30]) {
      const time24 = `${hour.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      const hour12 = hour > 12 ? hour - 12 : hour;
      const hourStr = hour12.toString().padStart(2, '0');
      const minsStr = mins.toString().padStart(2, '0');
      const label = `${hourStr}:${minsStr} PM`;
      const slotId = `${dateStr}_${time24}`;

      let available = true;
      let reasonDisabled: string | undefined = undefined;

      // Check if already booked
      const isBooked = bookedSlotIds.some(
        (id) => id === slotId || id === `${dateStr}_${time24}` || id === `${dateStr}_${label}`
      );

      if (isBooked) {
        available = false;
        reasonDisabled = 'Booked';
      }

      // Check if today and slot time has passed
      const isToday =
        dateObj.getFullYear() === now.getFullYear() &&
        dateObj.getMonth() === now.getMonth() &&
        dateObj.getDate() === now.getDate();

      if (isToday) {
        if (now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= mins)) {
          available = false;
          reasonDisabled = 'Time Passed';
        }
      }

      slots.push({
        id: slotId,
        time24,
        label,
        available,
        reasonDisabled,
      });
    }
  }

  return slots;
}

/**
  Generate unique Reference Code
*/
export function generateReferenceCode(): string {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `DRF-${random}`;
}

/**
  Supabase connection helpers.
  All bookings live in the 'appointments' table so every device (patient or admin)
  reads/writes the same central source of truth instead of per-browser localStorage.
*/
function getSupabaseConfig(): { url: string; key: string } | null {
  const url = (import.meta as any).env?.VITE_SUPABASE_URL;
  const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

async function supabaseRequest(
  path: string,
  options: RequestInit = {}
): Promise<Response | null> {
  const config = getSupabaseConfig();
  if (!config) return null;
  try {
    return await fetch(`${config.url}/rest/v1/${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        ...(options.headers || {}),
      },
    });
  } catch (err) {
    console.info('Supabase request skipped or failed gracefully:', err);
    return null;
  }
}

/**
  Convert a raw Supabase 'appointments' row back into a BookingRecord
  that the rest of the app (admin dashboard, slot picker) already understands.
*/
function mapRowToBookingRecord(row: any): BookingRecord {
  return {
    id: row.id,
    referenceCode: row.reference_code,
    step: 6,
    mode: row.mode,
    location: row.location,
    country: row.country
      ? {
          code: '',
          name: row.country,
          currency: (row.currency || 'PKR') as 'PKR' | 'USD',
          fee: Number(row.fee) || 0,
          flag: '',
          isPakistan: row.currency === 'PKR',
        }
      : null,
    selectedDate: row.booking_date,
    selectedSlot: row.slot_time
      ? { id: `${row.booking_date}_${row.slot_time}`, time24: '', label: row.slot_time, available: false }
      : null,
    patient: {
      fullName: row.patient_name,
      age: row.patient_age != null ? String(row.patient_age) : '',
      phone: row.patient_phone,
      email: row.patient_email,
      reason: row.patient_reason,
    },
    paymentMethod: row.payment_method,
    isPaid: !!row.is_paid,
    createdAt: row.created_at,
    status: row.status,
  };
}

/**
  Fetch all bookings from Supabase (central database).
  Falls back to an empty array if Supabase is unreachable/unconfigured,
  so callers should merge this with getSavedBookings() for offline safety.
*/
export async function fetchBookingsFromSupabase(): Promise<BookingRecord[]> {
  const res = await supabaseRequest('appointments?select=*&order=created_at.desc');
  if (!res || !res.ok) return [];
  try {
    const rows = await res.json();
    return rows.map(mapRowToBookingRecord);
  } catch {
    return [];
  }
}

/**
  Combined bookings list: Supabase (source of truth across all devices)
  merged with any local-only bookings that haven't synced yet (e.g. offline).
  This is what the Admin Dashboard and slot-availability checks should use.
*/
export async function getAllBookingsAsync(): Promise<BookingRecord[]> {
  const remote = await fetchBookingsFromSupabase();
  const local = getSavedBookings();

  const seenRefCodes = new Set(remote.map((b) => b.referenceCode));
  const localOnly = local.filter((b) => !seenRefCodes.has(b.referenceCode));

  return [...remote, ...localOnly];
}

/**
  Get list of booked slot IDs from the combined (Supabase + local) bookings.
  Used to disable already-booked slots for every patient, on every device.
*/
export async function getBookedSlotIdsAsync(): Promise<string[]> {
  const bookings = await getAllBookingsAsync();
  return computeBookedSlotIds(bookings);
}

/**
  Persistent Local Storage Key
*/
const STORAGE_KEY = 'dr_fahad_appointment_bookings';

/**
  Retrieve all saved bookings from LocalStorage
*/
export function getSavedBookings(): BookingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
  Compute booked slot IDs from any list of bookings (ignoring cancelled ones)
*/
export function computeBookedSlotIds(bookings: BookingRecord[]): string[] {
  const bookedSet = new Set<string>();

  bookings.forEach((b) => {
    if (b.status === 'cancelled') return;

    if (b.selectedSlot?.id) {
      bookedSet.add(b.selectedSlot.id);
    }
    if (b.selectedDate && b.selectedSlot?.time24) {
      bookedSet.add(`${b.selectedDate}_${b.selectedSlot.time24}`);
    }
    if (b.selectedDate && b.selectedSlot?.label) {
      bookedSet.add(`${b.selectedDate}_${b.selectedSlot.label}`);
      const parts = b.selectedSlot.label.trim().split(' ');
      if (parts.length === 2) {
        const [timeStr, period] = parts;
        const [hStr, mStr] = timeStr.split(':');
        let h = parseInt(hStr, 10);
        const m = parseInt(mStr, 10) || 0;
        if (period.toUpperCase() === 'PM' && h < 12) h += 12;
        if (period.toUpperCase() === 'AM' && h === 12) h = 0;
        const time24 = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        bookedSet.add(`${b.selectedDate}_${time24}`);
      }
    }
  });

  return Array.from(bookedSet);
}

/**
  Get list of booked slot IDs from LOCAL storage only (offline fallback).
  Prefer getBookedSlotIdsAsync() wherever possible so slots stay in sync across devices.
*/
export function getBookedSlotIds(): string[] {
  return computeBookedSlotIds(getSavedBookings());
}

/**
  Save booking record persistently
*/
export async function saveBookingRecord(bookingState: BookingState): Promise<BookingRecord> {
  const record: BookingRecord = {
    ...bookingState,
    id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: bookingState.isPaid ? 'confirmed' : 'pending_payment',
  };

  try {
    const existing = getSavedBookings();
    const alreadySaved = existing.some((b) => b.referenceCode === bookingState.referenceCode);
    if (!alreadySaved) {
      const updated = [record, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.warn('LocalStorage save warning:', err);
  }

  // Attempt Supabase insert if configured
  try {
    const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
    const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      await fetch(`${supabaseUrl}/rest/v1/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          reference_code: record.referenceCode,
          patient_name: record.patient.fullName,
          patient_age: record.patient.age,
          patient_phone: record.patient.phone,
          patient_email: record.patient.email,
          patient_reason: record.patient.reason,
          mode: record.mode,
          location: record.location,
          country: record.country?.name,
          currency: record.country?.currency,
          fee: record.country?.fee,
          booking_date: record.selectedDate,
          slot_time: record.selectedSlot?.label,
          payment_method: record.paymentMethod,
          is_paid: record.isPaid,
          created_at: record.createdAt,
        }),
      });
    }
  } catch (err) {
    console.info('Supabase sync skipped or failed gracefully:', err);
  }

  return record;
}

/**
  Update a booking's status on Supabase by reference code (e.g. mark as cancelled).
  Returns true if the remote update succeeded (or Supabase isn't configured, in which
  case the caller should still keep the local update as the source of truth).
*/
export async function updateBookingStatusRemote(
  referenceCode: string,
  status: BookingRecord['status']
): Promise<boolean> {
  const res = await supabaseRequest(
    `appointments?reference_code=eq.${encodeURIComponent(referenceCode)}`,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ status }),
    }
  );
  return !!res && res.ok;
}

/**
  Format Doctor WhatsApp Message
*/
export function formatDoctorWhatsAppMessage(booking: BookingState | BookingRecord, isUrdu = false): string {
  const modeLabel = booking.mode === 'physical'
    ? (booking.location === 'nawabshah' ? 'Physical - Nawabshah (Wali Hospital)' : 'Physical - Hyderabad OPD')
    : 'Online Video Consultation';

  const feeLabel = booking.country
    ? `${booking.country.currency} ${booking.country.fee.toLocaleString()}`
    : 'N/A';

  if (isUrdu) {
    return `السلام علیکم ڈاکٹر فہد الزین!
میں نے ویب سائٹ سے اپوائنٹمنٹ بک کی ہے:

🆔 ٹوکن کوڈ: ${booking.referenceCode}
👤 مریض کا نام: ${booking.patient.fullName}
🎂 عمر: ${booking.patient.age} سال
📱 واٹس ایپ: ${booking.patient.phone}
📧 ای میل: ${booking.patient.email || 'فراہم نہیں کی گئی'}
🌍 ملک: ${booking.country?.flag || ''} ${booking.country?.name || 'پاکستان'}
🏥 مشاورت کا طریقہ: ${modeLabel}
📅 منتخب کردہ تاریخ: ${booking.selectedDate}
⏰ وقت کا سلاٹ: ${booking.selectedSlot?.label || 'N/A'}
💰 مجوزہ فیس: ${feeLabel}
💳 ادائیگی کا طریقہ: ${booking.paymentMethod.toUpperCase()}

📝 بیماری / مسئلہ: ${booking.patient.reason || 'عام معائنہ'}

برائے مہربانی اس سلاٹ کی حتمی تصدیق فرما دیں۔ شکریہ!`;
  }

  return `Hello Dr. Fahad Ul Zain,
I have booked an appointment through your official website:

*Booking Ref:* ${booking.referenceCode}
*Patient Name:* ${booking.patient.fullName}
*Age:* ${booking.patient.age} Yrs
*WhatsApp Phone:* ${booking.patient.phone}
*Email:* ${booking.patient.email || 'Not provided'}
*Country:* ${booking.country?.flag || ''} ${booking.country?.name || 'Pakistan'}
*Consultation Mode:* ${modeLabel}
*Date:* ${booking.selectedDate}
*Time Slot:* ${booking.selectedSlot?.label || 'N/A'}
*Fee:* ${feeLabel}
*Payment Method:* ${booking.paymentMethod.toUpperCase()}

*Reason for Visit:* ${booking.patient.reason || 'General Psychiatry Review'}

Please confirm this appointment slot. Thank you!`;
}

/**
  Format Patient WhatsApp Confirmation Message
*/
export function formatPatientWhatsAppMessage(booking: BookingState | BookingRecord, isUrdu = false): string {
  const modeLabel = booking.mode === 'physical'
    ? (booking.location === 'nawabshah' ? 'Wali Hospital, Nawabshah' : 'Hyderabad Clinic OPD')
    : 'Online Secure Video Consultation';

  if (isUrdu) {
    return `محترم/محترمہ ${booking.patient.fullName}!
ڈاکٹر فہد الزین کی کلینک ویب سائٹ پر آپ کی اپوائنٹمنٹ رجسٹر ہو چکی ہے۔

🆔 آن لائن ٹوکن نمبر: ${booking.referenceCode}
📅 تاریخ: ${booking.selectedDate}
⏰ وقت: ${booking.selectedSlot?.label}
📍 مرکز: ${modeLabel}

کلینک کوآرڈینیٹر بذریعہ واٹس ایپ آپ سے مزید رہنمائی شیئر کرے گا۔`;
  }

  return `Dear ${booking.patient.fullName},
Your appointment with Dr. Fahad Ul Zain has been registered successfully.

*Ref Code:* ${booking.referenceCode}
*Date:* ${booking.selectedDate}
*Time:* ${booking.selectedSlot?.label}
*Format:* ${modeLabel}

Our clinic team will get in touch shortly to assist you.`;
}

/**
  Generate WhatsApp URL
*/
export function getWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
  Generate Mailto URL
*/
export function getEmailDraftUrl(booking: BookingState | BookingRecord): string {
  const subject = `Appointment Confirmation - Ref: ${booking.referenceCode} (${booking.patient.fullName})`;
  const body = `Dear Dr. Fahad Ul Zain Clinic,

I am writing to confirm my appointment request.

Reference Code: ${booking.referenceCode}
Patient Name: ${booking.patient.fullName}
Age: ${booking.patient.age}
Phone: ${booking.patient.phone}
Country: ${booking.country?.name}
Date: ${booking.selectedDate}
Time Slot: ${booking.selectedSlot?.label}
Consultation Mode: ${booking.mode} (${booking.location})
Reason for Visit: ${booking.patient.reason}

Thank you!`;

  return `mailto:fahadzain4@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
