import type { SearchParams } from "./search";

export type AdminAccountRole = "SUPER" | "ADMIN";

export interface AdminAccountSearchRequest {
  page: number;
  size: number;
  role?: AdminAccountRole;
  enabled?: boolean;
  search?: SearchParams;
}

// Response DTO
export interface AdminAccountResponse {
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