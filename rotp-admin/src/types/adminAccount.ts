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

export interface AdminAccountCreateRequest {
  username: string;
  nickname: string;
  email: string;
  callNumber?: string | null;
  role: AdminAccountRole | null;
  password: string;
}

export interface AdminAccountCreateModalProps {
  opened: boolean;
  onClose: () => void;
  onCreate: (data: AdminAccountCreateRequest) => void;
}

export interface AdminAccountUpdateRequest {
  id: number;
  username: string;
  nickname: string;
  email: string | null;
  callNumber?: string | null;
  role: AdminAccountRole | null;
  password: string | null;
  enabled: boolean;
}