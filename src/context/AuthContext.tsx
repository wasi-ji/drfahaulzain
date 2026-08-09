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
} from '../services/adminService';

interface AuthContextType {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  allUsers: UserAccount[];
  blockedDates: BlockedDateRecord[];
  login: (email: string, pass: string) => { success: boolean; messageEn: string; messageUr: string };
  signup: (
    name: string,
    email: string,
    pass: string,
    phone?: string
  ) => { success: boolean; messageEn: string; messageUr: string };
  logout: () => void;
  changeUserRole: (
    targetUserId: string,
    newRole: UserRole
  ) => { success: boolean; messageEn: string; messageUr: string };
  toggleBlockDate: (
    dateStr: string,
    reasonEn?: string,
    reasonUr?: string
  ) => { success: boolean; messageEn: string; messageUr: string; activeCount?: number };
  cancelAppointment: (bookingId: string) => { success: boolean; messageEn: string; messageUr: string };
  refreshData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentUserSession());
  const [allUsers, setAllUsers] = useState<UserAccount[]>(() => getAllUsers());
  const [blockedDates, setBlockedDates] = useState<BlockedDateRecord[]>(() => getBlockedDates());

  const refreshData = () => {
    setAllUsers(getAllUsers());
    setBlockedDates(getBlockedDates());
    setCurrentUser(getCurrentUserSession());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const login = (email: string, pass: string) => {
    const res = loginUser(email, pass);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      refreshData();
    }
    return { success: res.success, messageEn: res.messageEn, messageUr: res.messageUr };
  };

  const signup = (name: string, email: string, pass: string, phone?: string) => {
    const res = registerUser(name, email, pass, phone);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      refreshData();
    }
    return { success: res.success, messageEn: res.messageEn, messageUr: res.messageUr };
  };

  const logout = () => {
    logoutUser();
    setCurrentUser(null);
    refreshData();
  };

  const changeUserRole = (targetUserId: string, newRole: UserRole) => {
    const res = updateUserRole(currentUser, targetUserId, newRole);
    if (res.success) {
      refreshData();
    }
    return res;
  };

  const toggleBlockDate = (dateStr: string, reasonEn?: string, reasonUr?: string) => {
    const isCurrentlyBlocked = blockedDates.some((b) => b.dateStr === dateStr);
    if (isCurrentlyBlocked) {
      unblockDate(dateStr);
      refreshData();
      return {
        success: true,
        messageEn: `Date ${dateStr} has been unblocked.`,
        messageUr: `تاریخ ${dateStr} کا بلاک ختم کر دیا گیا ہے۔`,
      };
    } else {
      const res = blockDate(dateStr, reasonEn, reasonUr, currentUser || undefined);
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

  const cancelAppointment = (bookingId: string) => {
    const res = cancelAppointmentByAdmin(bookingId);
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
