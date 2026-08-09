import { BlockedDateRecord, UserAccount } from '../types/auth';
import { BookingRecord } from '../types/booking';

const BLOCKED_DATES_KEY = 'dr_fahad_blocked_dates';
const BOOKINGS_KEY = 'dr_fahad_appointment_bookings';

/**
 * Get all blocked dates records
 */
export function getBlockedDates(): BlockedDateRecord[] {
  try {
    const raw = localStorage.getItem(BLOCKED_DATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse blocked dates from localStorage', e);
    return [];
  }
}

/**
 * Check if a specific YYYY-MM-DD date is blocked
 */
export function isDateBlocked(dateStr: string): boolean {
  const list = getBlockedDates();
  return list.some((item) => item.dateStr === dateStr);
}

/**
 * Get blocked record details for a date
 */
export function getBlockedDateRecord(dateStr: string): BlockedDateRecord | undefined {
  const list = getBlockedDates();
  return list.find((item) => item.dateStr === dateStr);
}

export interface BlockDateResult {
  success: boolean;
  messageEn: string;
  messageUr: string;
  activeCount?: number;
}

/**
 * Rule 3 Implementation:
 * Admin can block a date if:
 * 1. It is at least 24 hours in advance from current time.
 * 2. There are NO active (non-cancelled) appointments on that date.
 * If active appointments exist, admin must cancel them first.
 */
export function blockDate(
  dateStr: string,
  reasonEn: string = 'Clinic closed by administration',
  reasonUr: string = 'کلینک انتظامیہ کی جانب سے تاریخ بلاک کی گئی ہے',
  adminUser?: UserAccount
): BlockDateResult {
  const now = new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  const targetDateObj = new Date(year, month - 1, day, 23, 59, 59);

  // Check 24 hour advance rule
  const hoursUntilTarget = (targetDateObj.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilTarget < 24) {
    return {
      success: false,
      messageEn: 'Dates can only be blocked at least 24 hours in advance.',
      messageUr: 'تاریخ کو بلاک کرنے کے لیے کم از کم 24 گھنٹے پہلے کارروائی ضروری ہے۔',
    };
  }

  // Check if active (non-cancelled) appointments exist on this date
  const rawBookings = localStorage.getItem(BOOKINGS_KEY);
  let bookings: BookingRecord[] = [];
  if (rawBookings) {
    try {
      bookings = JSON.parse(rawBookings);
    } catch (e) {
      console.error(e);
    }
  }

  const activeBookingsOnDate = bookings.filter(
    (b) => b.selectedDate === dateStr && b.status !== 'cancelled'
  );

  if (activeBookingsOnDate.length > 0) {
    return {
      success: false,
      activeCount: activeBookingsOnDate.length,
      messageEn: `Cannot block date: There are ${activeBookingsOnDate.length} active appointment(s) on ${dateStr}. You must cancel all active appointments for this date first before blocking.`,
      messageUr: `تاریخ بلاک نہیں کی جا سکتی: ${dateStr} پر ${activeBookingsOnDate.length} فعال اپوائنٹمنٹ موجود ہیں۔ بلاک کرنے سے پہلے ان اپوائنٹمنٹس کو منسوخ کریں۔`,
    };
  }

  // Save blocked date
  const existing = getBlockedDates();
  if (!existing.some((item) => item.dateStr === dateStr)) {
    const newRecord: BlockedDateRecord = {
      dateStr,
      reasonEn,
      reasonUr,
      blockedBy: adminUser?.email || 'Admin',
      blockedAt: new Date().toISOString(),
    };
    existing.push(newRecord);
    localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(existing));
  }

  return {
    success: true,
    messageEn: `Date ${dateStr} has been successfully blocked for future bookings.`,
    messageUr: `تاریخ ${dateStr} کامیابی کے ساتھ بکنگ کے لیے بلاک کر دی گئی ہے۔`,
  };
}

/**
 * Unblock a previously disallowed date
 */
export function unblockDate(dateStr: string): void {
  const existing = getBlockedDates();
  const filtered = existing.filter((item) => item.dateStr !== dateStr);
  localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(filtered));
}

/**
 * Admin Action: Cancel an appointment by ID
 */
export function cancelAppointmentByAdmin(bookingId: string): { success: boolean; messageEn: string; messageUr: string } {
  try {
    const rawBookings = localStorage.getItem(BOOKINGS_KEY);
    if (!rawBookings) return { success: false, messageEn: 'Booking record not found', messageUr: 'اپوائنٹمنٹ کی تفصیلات نہیں ملیں' };

    let bookings: BookingRecord[] = JSON.parse(rawBookings);
    const index = bookings.findIndex((b) => b.id === bookingId);

    if (index === -1) {
      return { success: false, messageEn: 'Booking record not found', messageUr: 'اپوائنٹمنٹ کی تفصیلات نہیں ملیں' };
    }

    // Remove the cancelled appointment record completely
    const updatedBookings = bookings.filter((b) => b.id !== bookingId);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));

    return {
      success: true,
      messageEn: 'Appointment has been successfully cancelled and removed.',
      messageUr: 'اپوائنٹمنٹ کامیابی سے منسوخ اور ختم کر دی گئی ہے۔',
    };
  } catch (err) {
    console.error('Error cancelling appointment:', err);
    return {
      success: false,
      messageEn: 'Failed to cancel appointment due to system error.',
      messageUr: 'سسٹم کی خرابی کی وجہ سے اپوائنٹمنٹ منسوخ نہ ہو سکی۔',
    };
  }
}
