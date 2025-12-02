package com.roa.rotp.common.interceptor;

import com.roa.rotp.common.exception.AppException;
import com.roa.rotp.common.model.ErrorCode;
import com.roa.rotp.common.service.AuditLogService;
import com.roa.rotp.common.util.MaskingUtils;
import jakarta.annotation.Nullable;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.io.UnsupportedEncodingException;

@Component
@RequiredArgsConstructor
public class AuditInterceptor implements HandlerInterceptor {

    private final AuditLogService auditLogService;

    @Override
    public void afterCompletion(@Nullable HttpServletRequest request,
                                @Nullable HttpServletResponse response,
                                @Nullable Object handler,
                                Exception ex) {
        if (request instanceof ContentCachingRequestWrapper wrapper) {
            byte[] buf = wrapper.getContentAsByteArray();
            if (buf.length > 0) {
                try {
                    String payload = new String(buf, wrapper.getCharacterEncoding());
                    String maskedPayload = MaskingUtils.maskSensitiveFields(payload);
                    auditLogService.recordApiCall(request, maskedPayload);
                } catch (UnsupportedEncodingException e) {
                    throw new AppException(ErrorCode.INTERNAL_ERROR, "요청 페이로드 인코딩 실패: " + e.getMessage());
                }
            }
        }
    }
}