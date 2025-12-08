export type AdminAccountRole = "SUPER" | "ADMIN";

export interface AdminAccount {
  id: number;
  username: string;
  nickname: string;
  email: string | null;
  callNumber?: string | null;
  role: AdminAccountRole;
  enabled: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  lastLoginAt?: string | null;
}