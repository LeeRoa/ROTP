import type { SearchParams } from "./search";

export interface OtpUserSearchRequest {
    page: number;
    size: number;
    disabled?: boolean;
    startDate?: string;
    endDate?: string;
    search?: SearchParams;
}

export interface OtpUserResponse {
    userId: string;
    email: string | null;
    phoneNumber: string | null;
    algorithm: string;
    digits: number;
    period: number;
    disabled: boolean;
    createdAt: string;
    lastUsedAt: string | null;
    otpBypassUntil: string | null;
    disabledBy: string | null;
    disabledAt: string | null;
}

export interface UpdateOtpUserInfoRequest {
    userId: string;
    email?: string;
    displayName?: string;
    disabled?: boolean;
}

export interface OtpBypassRequest {
    userId: string;
    until: string;
    adminId: string;
}