// src/types/adminAccount.ts
export type AdminAccountType = "S" | "U";

export interface AdminAccount {
  id: number;
  loginId: string;
  name: string;
  email: string;
  phone?: string;
  adminAccountType: AdminAccountType; // S: Super, U: User
  createdAt?: string;
  updatedAt?: string;
}
