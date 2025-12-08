package com.roa.rotp.admin.dto.audit;

import com.roa.rotp.common.dto.SearchRequest;

import java.time.Instant;

public record AuditLogSearchRequest(
        SearchRequest search,
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