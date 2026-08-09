import { BlockedDateRecord, UserAccount } from '../types/auth';
import { BookingRecord } from '../types/booking';
import { getAllBookingsAsync, updateBookingStatusRemote } from './bookingEngine';

const BLOCKED_DATES_KEY = 'dr_fahad_blocked_dates';
const BOOKINGS_KEY = 'dr_fahad_appointment_bookings';

/**
  Supabase connection helpers (mirrors bookingEngine.ts) for the blocked_dates table,
  so a date blocked/unblocked by admin on one device is visible on every device.
*/
function getSupabaseConfig(): { url: string; key: string } | null {
  const url = (import.meta as any).env?.VITE_SUPABASE_URL;
  const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

async function supabaseRequest(path: string, options: RequestInit = {}): Promise<Response | null> {
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

function mapRowToBlockedDate(row: any): BlockedDateRecord {
  return {
    dateStr: row.date_str,
    reasonEn: row.reason_en,
    reasonUr: row.reason_ur,
    blockedBy: row.blocked_by,
    blockedAt: row.blocked_at,
  };
}

/**
  Fetch blocked dates from Supabase and refresh the local cache with them,
  so every synchronous local read (isDateBlocked, getBlockedDateRecord) stays
  reasonably fresh across devices without needing to become async everywhere.
*/
export async function syncBlockedDatesFromSupabase(): Promise<BlockedDateRecord[]> {
  const res = await supabaseRequest('blocked_dates?select=*&order=date_str.asc');
  if (!res || !res.ok) {
    return getBlockedDates();
  }
  try {
    const rows = await res.json();
    const records: BlockedDateRecord[] = rows.map(mapRowToBlockedDate);
    localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(records));
    return records;
  } catch {
    return getBlockedDates();
  }
}

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
export async function blockDate(
  dateStr: string,
  reasonEn: string = 'Clinic closed by administration',
  reasonUr: string = 'کلینک انتظامیہ کی جانب سے تاریخ بلاک کی گئی ہے',
  adminUser?: UserAccount
): Promise<BlockDateResult> {
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

  // Check if active (non-cancelled) appointments exist on this date — checked against
  // the CENTRAL database (Supabase), so bookings made on any device are counted, not just this one.
  const bookings: BookingRecord[] = await getAllBookingsAsync();

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

  // Save blocked date locally (instant UI feedback)
  const existing = getBlockedDates();
  const newRecord: BlockedDateRecord = {
    dateStr,
    reasonEn,
    reasonUr,
    blockedBy: adminUser?.email || 'Admin',
    blockedAt: new Date().toISOString(),
  };
  if (!existing.some((item) => item.dateStr === dateStr)) {
    existing.push(newRecord);
    localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(existing));
  }

  // Sync to Supabase so every device sees this blocked date
  await supabaseRequest('blocked_dates', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({
      date_str: dateStr,
      reason_en: reasonEn,
      reason_ur: reasonUr,
      blocked_by: newRecord.blockedBy,
      blocked_at: newRecord.blockedAt,
    }),
  });

  return {
    success: true,
    messageEn: `Date ${dateStr} has been successfully blocked for future bookings.`,
    messageUr: `تاریخ ${dateStr} کامیابی کے ساتھ بکنگ کے لیے بلاک کر دی گئی ہے۔`,
  };
}

/**
 * Unblock a previously disallowed date (local + Supabase)
 */
export async function unblockDate(dateStr: string): Promise<void> {
  const existing = getBlockedDates();
  const filtered = existing.filter((item) => item.dateStr !== dateStr);
  localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(filtered));

  await supabaseRequest(`blocked_dates?date_str=eq.${encodeURIComponent(dateStr)}`, {
    method: 'DELETE',
    headers: { Prefer: 'return=minimal' },
  });
}

/**
 * Admin Action: Cancel an appointment by ID.
 * Marks the booking as 'cancelled' (instead of deleting it) both locally and on
 * Supabase, so the slot frees up everywhere and a record is kept for reports.
 */
export async function cancelAppointmentByAdmin(
  bookingId: string
): Promise<{ success: boolean; messageEn: string; messageUr: string }> {
  try {
    // Find the booking across BOTH local storage and Supabase, since the admin
    // dashboard list can include bookings made on other devices.
    const allBookings: BookingRecord[] = await getAllBookingsAsync();
    const target = allBookings.find((b) => b.id === bookingId);

    if (!target) {
      return { success: false, messageEn: 'Booking record not found', messageUr: 'اپوائنٹمنٹ کی تفصیلات نہیں ملیں' };
    }

    // Update local cache if this booking exists there
    const rawBookings = localStorage.getItem(BOOKINGS_KEY);
    if (rawBookings) {
      const localBookings: BookingRecord[] = JSON.parse(rawBookings);
      const updatedLocal = localBookings.map((b) =>
        b.referenceCode === target.referenceCode ? { ...b, status: 'cancelled' as const } : b
      );
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedLocal));
    }

    // Update the central Supabase record so it's cancelled on every device
    await updateBookingStatusRemote(target.referenceCode, 'cancelled');

    return {
      success: true,
      messageEn: 'Appointment has been successfully cancelled.',
      messageUr: 'اپوائنٹمنٹ کامیابی سے منسوخ کر دی گئی ہے۔',
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
