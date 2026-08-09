import { UserAccount, UserRole } from '../types/auth';

const USERS_STORAGE_KEY = 'dr_fahad_registered_users';
const CURRENT_SESSION_KEY = 'dr_fahad_active_session';

// Pre-seeded default admin account for instant access
const DEFAULT_SUPER_ADMIN: UserAccount = {
  id: 'usr_admin_001',
  name: 'Dr. Fahad Admin',
  email: 'admin@drfahad.com',
  phone: '+92 370 2207890',
  role: 'admin',
  createdAt: '2026-01-01T00:00:00.000Z',
  lastLoginAt: '2026-08-07T00:00:00.000Z',
};

// Internal map for stored passwords (in memory/localStorage mock auth)
const PASSWORDS_STORAGE_KEY = 'dr_fahad_user_passwords';

function getPasswordsMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PASSWORDS_STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    if (!map['admin@drfahad.com']) {
      map['admin@drfahad.com'] = 'admin123';
    }
    return map;
  } catch {
    return { 'admin@drfahad.com': 'admin123' };
  }
}

function savePasswordsMap(map: Record<string, string>): void {
  localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(map));
}

/**
 * Retrieve all registered users
 */
export function getAllUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      // Seed default admin
      const initial = [DEFAULT_SUPER_ADMIN];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const list: UserAccount[] = JSON.parse(raw);
    // Ensure default admin exists
    if (!list.some((u) => u.email.toLowerCase() === DEFAULT_SUPER_ADMIN.email.toLowerCase())) {
      list.unshift(DEFAULT_SUPER_ADMIN);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
    }
    return list;
  } catch {
    return [DEFAULT_SUPER_ADMIN];
  }
}

function saveUsersList(users: UserAccount[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

/**
 * Register a new user.
 * Requirement 5: Whenever a new user signs up, their role is ALWAYS 'client' ('user').
 */
export function registerUser(
  name: string,
  email: string,
  pass: string,
  phone?: string
): { success: boolean; user?: UserAccount; messageEn: string; messageUr: string } {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !pass.trim() || !name.trim()) {
    return {
      success: false,
      messageEn: 'All required fields must be filled out.',
      messageUr: 'تمام ضروری خانے پر کرنا لازمی ہیں۔',
    };
  }

  const users = getAllUsers();
  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return {
      success: false,
      messageEn: 'An account with this email address already exists. Please sign in.',
      messageUr: 'اس ای میل کے ساتھ اکاؤنٹ پہلے سے موجود ہے۔ براہ کرم سائن ان کریں۔',
    };
  }

  // Create new user explicitly as 'client'
  const newUser: UserAccount = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    email: cleanEmail,
    phone: phone?.trim(),
    role: 'client', // STRICT RULE 5: Always 'client' by default
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  users.unshift(newUser);
  saveUsersList(users);

  const pwdMap = getPasswordsMap();
  pwdMap[cleanEmail] = pass;
  savePasswordsMap(pwdMap);

  // Set active session
  setCurrentUserSession(newUser);

  return {
    success: true,
    user: newUser,
    messageEn: 'Account created successfully! Welcome as Client.',
    messageUr: 'اکاؤنٹ کامیابی سے بن گیا ہے! بطور کلائنٹ خوش آمدید۔',
  };
}

/**
 * Log in an existing user
 */
export function loginUser(
  email: string,
  pass: string
): { success: boolean; user?: UserAccount; messageEn: string; messageUr: string } {
  const cleanEmail = email.trim().toLowerCase();
  const users = getAllUsers();
  const pwdMap = getPasswordsMap();

  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
  const correctPass = pwdMap[cleanEmail];

  if (!user || correctPass !== pass) {
    return {
      success: false,
      messageEn: 'Invalid email address or password. Please try again.',
      messageUr: 'ای میل یا پاس ورڈ غلط ہے۔ دوبارہ کوشش کریں۔',
    };
  }

  // Update last login timestamp
  user.lastLoginAt = new Date().toISOString();
  saveUsersList(users);

  setCurrentUserSession(user);

  return {
    success: true,
    user,
    messageEn: `Signed in successfully. Welcome back, ${user.name}!`,
    messageUr: `کامیابی سے سائن ان ہو گئے۔ خوش آمدید ${user.name}!`,
  };
}

/**
 * Get active user session
 */
export function getCurrentUserSession(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Set active user session
 */
export function setCurrentUserSession(user: UserAccount | null): void {
  if (!user) {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  } else {
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
  }
}

/**
 * Logout
 */
export function logoutUser(): void {
  localStorage.removeItem(CURRENT_SESSION_KEY);
}

/**
 * Requirement 6: Only Admin has the right to change a user's role to Admin or Client
 */
export function updateUserRole(
  executorUser: UserAccount | null,
  targetUserId: string,
  newRole: UserRole
): { success: boolean; messageEn: string; messageUr: string } {
  if (!executorUser || executorUser.role !== 'admin') {
    return {
      success: false,
      messageEn: 'Permission denied: Only Admin users can modify user roles.',
      messageUr: 'اجازت نہیں ہے: صرف ایڈمن صارف دیگر صارفین کا رول تبدیل کر سکتا ہے۔',
    };
  }

  const users = getAllUsers();
  const target = users.find((u) => u.id === targetUserId);

  if (!target) {
    return {
      success: false,
      messageEn: 'Target user not found.',
      messageUr: 'صارف نہیں مل سکا۔',
    };
  }

  target.role = newRole;
  saveUsersList(users);

  // If target user is the current active session, update active session as well
  const currentSession = getCurrentUserSession();
  if (currentSession && currentSession.id === target.id) {
    setCurrentUserSession(target);
  }

  return {
    success: true,
    messageEn: `User role for ${target.name} has been updated to ${newRole.toUpperCase()}.`,
    messageUr: `${target.name} کا رول کامیابی سے ${newRole === 'admin' ? 'ایڈمن' : 'کلائنٹ'} کر دیا گیا ہے۔`,
  };
}
