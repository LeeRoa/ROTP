export interface OtpUser {
  id: string;
  username: string;
  email: string;
  status: "ACTIVE" | "LOCKED" | "DISABLED";
  bypass: boolean;     // OTP 우회 여부
  createdAt: string;
  updatedAt: string;
}

export interface PagedResult<T> {
  content: T[];
  totalCount: number;
}