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
    public void recordApiCall(HttpServletRequest request, String payload, int statusCode) {
        String uri = request.getRequestURI();
        
        // 액션 결정
        String action = AuditConstants.ACTION_API_CALL;
        if (uri.contains("/auth/login")) {
            action = AuditConstants.ACTION_LOGIN;
        } else if (uri.contains("/auth/logout")) {
            action = AuditConstants.ACTION_LOGOUT;
        }
        
        // 결과 결정 (2xx = SUCCESS, 나머지 = FAILURE)
        String result = (statusCode >= 200 && statusCode < 300) 
                ? AuditConstants.RESULT_SUCCESS 
                : AuditConstants.RESULT_FAILURE;
        
        AuditLog log = AuditLog.builder()
                .action(action)
                .result(result)
                .message(statusCode >= 200 && statusCode < 300 ? "요청 성공" : "요청 실패 (" + statusCode + ")")
                .ipAddress(request.getRemoteAddr())
                .userAgent(request.getHeader("User-Agent"))
                .requestUri(uri)
                .httpMethod(request.getMethod())
                .requestPayload(payload)
                .build();

        auditLogRepository.save(log);
    }
}