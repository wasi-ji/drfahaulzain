import { UserAccount, UserRole } from '../types/auth';
import { supabase } from './supabaseClient';

/**
  This file now uses Supabase's real Authentication system:
  - Passwords are NEVER handled or stored by our own code. Supabase's
    "auth.users" table stores them securely (hashed) and we never see them.
  - Our own "profiles" table (in Supabase) stores the extra info the app
    needs: name, phone, role, and login timestamps.
  - Role changes only happen through the secure 'set_user_role' database
    function, which checks the CALLER is already an admin before allowing it
    — so a client account can never promote itself.
*/

function mapProfileRow(row: any): UserAccount {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    role: row.role,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
  };
}

/**
 * Retrieve all registered users (admin dashboard "Registered Users" table)
 */
export async function getAllUsers(): Promise<UserAccount[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching users:', error);
    return [];
  }
  return data.map(mapProfileRow);
}

/**
 * Register a new user.
 * Requirement: Whenever a new user signs up, their role is ALWAYS 'client'.
 * (Enforced server-side by the on_auth_user_created trigger, not just here.)
 */
export async function registerUser(
  name: string,
  email: string,
  pass: string,
  phone?: string
): Promise<{ success: boolean; user?: UserAccount; messageEn: string; messageUr: string }> {
  if (!supabase) {
    return {
      success: false,
      messageEn: 'System is not connected to the database. Please contact support.',
      messageUr: 'سسٹم ڈیٹا بیس سے منسلک نہیں ہے۔ براہ کرم سپورٹ سے رابطہ کریں۔',
    };
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !pass.trim() || !name.trim()) {
    return {
      success: false,
      messageEn: 'All required fields must be filled out.',
      messageUr: 'تمام ضروری خانے پر کرنا لازمی ہیں۔',
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password: pass,
    options: {
      data: { name: name.trim(), phone: phone?.trim() || null },
    },
  });

  if (error || !data.user) {
    const isDuplicate = error?.message?.toLowerCase().includes('already registered');
    return {
      success: false,
      messageEn: isDuplicate
        ? 'An account with this email address already exists. Please sign in.'
        : error?.message || 'Failed to create account.',
      messageUr: isDuplicate
        ? 'اس ای میل کے ساتھ اکاؤنٹ پہلے سے موجود ہے۔ براہ کرم سائن ان کریں۔'
        : 'اکاؤنٹ نہیں بن سکا۔',
    };
  }

  // The database trigger creates the profile row automatically; fetch it.
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();

  return {
    success: true,
    user: profile ? mapProfileRow(profile) : undefined,
    messageEn: 'Account created successfully! Welcome as Client.',
    messageUr: 'اکاؤنٹ کامیابی سے بن گیا ہے! بطور کلائنٹ خوش آمدید۔',
  };
}

/**
 * Log in an existing user
 */
export async function loginUser(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: UserAccount; messageEn: string; messageUr: string }> {
  if (!supabase) {
    return {
      success: false,
      messageEn: 'System is not connected to the database. Please contact support.',
      messageUr: 'سسٹم ڈیٹا بیس سے منسلک نہیں ہے۔ براہ کرم سپورٹ سے رابطہ کریں۔',
    };
  }

  const cleanEmail = email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: pass,
  });

  if (error || !data.user) {
    return {
      success: false,
      messageEn: 'Invalid email address or password. Please try again.',
      messageUr: 'ای میل یا پاس ورڈ غلط ہے۔ دوبارہ کوشش کریں۔',
    };
  }

  // Update last login timestamp via the secure function (updates only OWN row)
  await supabase.rpc('bump_last_login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();

  if (!profile) {
    return {
      success: false,
      messageEn: 'Account found but profile data is missing. Please contact support.',
      messageUr: 'اکاؤنٹ ملا لیکن پروفائل ڈیٹا موجود نہیں۔ سپورٹ سے رابطہ کریں۔',
    };
  }

  const user = mapProfileRow(profile);

  return {
    success: true,
    user,
    messageEn: `Signed in successfully. Welcome back, ${user.name}!`,
    messageUr: `کامیابی سے سائن ان ہو گئے۔ خوش آمدید ${user.name}!`,
  };
}

/**
 * Get active user session (checks Supabase's real session, e.g. after page reload)
 */
export async function getCurrentUserSession(): Promise<UserAccount | null> {
  if (!supabase) return null;

  const { data: sessionData } = await supabase.auth.getSession();
  const authUser = sessionData.session?.user;
  if (!authUser) return null;

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();
  return profile ? mapProfileRow(profile) : null;
}

/**
 * Logout
 */
export async function logoutUser(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

/**
 * Only Admin has the right to change a user's role to Admin or Client.
 * This calls the secure 'set_user_role' database function, which re-checks
 * (server-side) that the currently signed-in user is actually an admin —
 * so this can't be bypassed even by tampering with the app's own code.
 */
export async function updateUserRole(
  executorUser: UserAccount | null,
  targetUserId: string,
  newRole: UserRole
): Promise<{ success: boolean; messageEn: string; messageUr: string }> {
  if (!supabase) {
    return {
      success: false,
      messageEn: 'System is not connected to the database.',
      messageUr: 'سسٹم ڈیٹا بیس سے منسلک نہیں ہے۔',
    };
  }

  if (!executorUser || executorUser.role !== 'admin') {
    return {
      success: false,
      messageEn: 'Permission denied: Only Admin users can modify user roles.',
      messageUr: 'اجازت نہیں ہے: صرف ایڈمن صارف دیگر صارفین کا رول تبدیل کر سکتا ہے۔',
    };
  }

  const { error } = await supabase.rpc('set_user_role', {
    target_id: targetUserId,
    new_role: newRole,
  });

  if (error) {
    return {
      success: false,
      messageEn: error.message || 'Failed to update user role.',
      messageUr: 'صارف کا رول تبدیل نہیں ہو سکا۔',
    };
  }

  return {
    success: true,
    messageEn: `User role has been updated to ${newRole.toUpperCase()}.`,
    messageUr: `صارف کا رول کامیابی سے ${newRole === 'admin' ? 'ایڈمن' : 'کلائنٹ'} کر دیا گیا ہے۔`,
  };
}
