package com.roa.rotp.admin.dto.audit;

import java.time.Instant;

public record AuditLogSearchRequest(
        String field,      // 선택된 검색 조건 (예: "action", "ipAddress", "userAgent")
        String keyword,       // 전체 검색어 (optional)
        String action,
        String result,
        String ipAddress,
        String userAgent,
        String requestUri,
        String httpMethod,
        Instant startDate,
        Instant endDate
) {
}