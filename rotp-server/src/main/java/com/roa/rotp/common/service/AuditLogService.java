package com.roa.rotp.common.service;

import jakarta.servlet.http.HttpServletRequest;

public interface AuditLogService {
    void recordApiCall(HttpServletRequest request, String payload);
}
