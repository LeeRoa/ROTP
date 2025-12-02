package com.roa.rotp.admin.dto.otpuser;

import java.time.Instant;

public record OtpBypassRequest(
        String userId,   // 대상 사용자 ID
        Instant until,   // bypass 허용 종료 시각
        String adminId   // 조치한 관리자 ID
) {}

