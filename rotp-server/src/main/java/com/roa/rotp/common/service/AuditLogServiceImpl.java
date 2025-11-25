package com.roa.rotp.common.service;

import com.roa.rotp.common.entity.AuditLog;
import com.roa.rotp.common.model.AuditConstants;
import com.roa.rotp.common.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    public void recordApiCall(HttpServletRequest request, String payload) {
        AuditLog log = AuditLog.builder()
                .action(AuditConstants.ACTION_API_CALL)
                .result(AuditConstants.RESULT_PENDING)
                .message("요청 수신")
                .ipAddress(request.getRemoteAddr())
                .userAgent(request.getHeader("User-Agent"))
                .requestUri(request.getRequestURI())
                .httpMethod(request.getMethod())
                .requestPayload(payload)
                .build();

        auditLogRepository.save(log);
    }
}