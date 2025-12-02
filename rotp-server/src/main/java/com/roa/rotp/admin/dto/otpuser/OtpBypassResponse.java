package com.roa.rotp.admin.dto.otpuser;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.Instant;

public record OtpBypassResponse(
        String message,    // 설명 메시지
        String userId,     // 대상 사용자 ID

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "KST")
        Instant timestamp  // 응답 시각
) {}