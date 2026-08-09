export type UserRole = 'client' | 'admin';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  lastLoginAt: string;
}

export interface BlockedDateRecord {
  dateStr: string; // YYYY-MM-DD
  reasonEn: string;
  reasonUr: string;
  blockedBy: string; // email of admin
  blockedAt: string;
}
