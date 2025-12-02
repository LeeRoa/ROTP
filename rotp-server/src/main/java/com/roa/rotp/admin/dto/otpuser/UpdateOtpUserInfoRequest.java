package com.roa.rotp.admin.dto.otpuser;

public record UpdateOtpUserInfoRequest(
        String userId,          // 대상 사용자 ID
        String email,           // 이메일 수정
        String displayName,     // 표시 이름 수정
        Boolean disabled        // 활성화 여부 (true/false)
) {}