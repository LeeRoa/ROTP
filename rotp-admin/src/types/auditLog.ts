import type { SearchParams } from "./search";

export interface AuditLogSearchRequest {
    page: number;
    size: number;
    search?: SearchParams;
    action?: string;
    result?: string;
    ipAddress?: string;
    userAgent?: string;
    requestUri?: string;
    httpMethod?: string;
    startDate?: string;
    endDate?: string;
}

export interface AuditLogResponse {
    id: number;
    action: string;
    result: string;
    message: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    requestUri: string | null;
    httpMethod: string | null;
    requestPayload: string | null;
    createdAt: string;
    createdBy: string | null;
}

export const AuditLogSearchableFields = ["userAgent", "ipAddress", "requestUri"];
