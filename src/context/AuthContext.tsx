import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, UserRole, BlockedDateRecord } from '../types/auth';
import {
  getCurrentUserSession,
  loginUser,
  logoutUser,
  registerUser,
  updateUserRole,
  getAllUsers,
} from '../services/authService';
import {
  getBlockedDates,
  blockDate,
  unblockDate,
  cancelAppointmentByAdmin,
  syncBlockedDatesFromSupabase,
} from '../services/adminService';

interface AuthContextType {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  allUsers: UserAccount[];
  blockedDates: BlockedDateRecord[];
  isAuthLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; messageEn: string; messageUr: string }>;
  signup: (
    name: string,
    email: string,
    pass: string,
    phone?: string
  ) => Promise<{ success: boolean; messageEn: string; messageUr: string }>;
  logout: () => Promise<void>;
  changeUserRole: (
    targetUserId: string,
    newRole: UserRole
  ) => Promise<{ success: boolean; messageEn: string; messageUr: string }>;
  toggleBlockDate: (
    dateStr: string,
    reasonEn?: string,
    reasonUr?: string
  ) => Promise<{ success: boolean; messageEn: string; messageUr: string; activeCount?: number }>;
  cancelAppointment: (bookingId: string) => Promise<{ success: boolean; messageEn: string; messageUr: string }>;
  refreshData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [allUsers, setAllUsers] = useState<UserAccount[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDateRecord[]>(() => getBlockedDates());
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const refreshData = () => {
    getAllUsers().then(setAllUsers);
    getCurrentUserSession().then(setCurrentUser);
    // Pull the latest blocked dates from the central database (Supabase) so
    // a date blocked on one device is reflected here too.
    syncBlockedDatesFromSupabase().then(setBlockedDates);
  };

  useEffect(() => {
    // On first load (or page refresh), check if there's already a valid
    // Supabase session (e.g. the person logged in earlier and didn't log out).
    getCurrentUserSession()
      .then(setCurrentUser)
      .finally(() => setIsAuthLoading(false));

    getAllUsers().then(setAllUsers);
    syncBlockedDatesFromSupabase().then(setBlockedDates);

    // Keep blocked dates reasonably fresh in the background across devices.
    const interval = setInterval(() => {
      syncBlockedDatesFromSupabase().then(setBlockedDates);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await loginUser(email, pass);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      refreshData();
    }
    return { success: res.success, messageEn: res.messageEn, messageUr: res.messageUr };
  };

  const signup = async (name: string, email: string, pass: string, phone?: string) => {
    const res = await registerUser(name, email, pass, phone);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      refreshData();
    }
    return { success: res.success, messageEn: res.messageEn, messageUr: res.messageUr };
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
    refreshData();
  };

  const changeUserRole = async (targetUserId: string, newRole: UserRole) => {
    const res = await updateUserRole(currentUser, targetUserId, newRole);
    if (res.success) {
      refreshData();
    }
    return res;
  };

  const toggleBlockDate = async (dateStr: string, reasonEn?: string, reasonUr?: string) => {
    const isCurrentlyBlocked = blockedDates.some((b) => b.dateStr === dateStr);
    if (isCurrentlyBlocked) {
      await unblockDate(dateStr);
      refreshData();
      return {
        success: true,
        messageEn: `Date ${dateStr} has been unblocked.`,
        messageUr: `تاریخ ${dateStr} کا بلاک ختم کر دیا گیا ہے۔`,
      };
    } else {
      const res = await blockDate(dateStr, reasonEn, reasonUr, currentUser || undefined);
      if (res.success) {
        refreshData();
      }
      return {
        success: res.success,
        messageEn: res.messageEn,
        messageUr: res.messageUr,
        activeCount: res.activeCount,
      };
    }
  };

  const cancelAppointment = async (bookingId: string) => {
    const res = await cancelAppointmentByAdmin(bookingId);
    if (res.success) {
      refreshData();
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        allUsers,
        blockedDates,
        isAuthLoading,
        login,
        signup,
        logout,
        changeUserRole,
        toggleBlockDate,
        cancelAppointment,
        refreshData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
