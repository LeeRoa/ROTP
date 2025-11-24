package com.roa.rotp.admin.dto;

import java.time.Instant;

public record OtpBypassResponse(
        String message,    // 설명 메시지
        String userId,     // 대상 사용자 ID
        Instant timestamp  // 응답 시각
) {}

