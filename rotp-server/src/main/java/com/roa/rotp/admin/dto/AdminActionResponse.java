package com.roa.rotp.admin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.Instant;

public record AdminActionResponse(
        String status,     // "SUCCESS" or "FAIL"
        String message,    // 설명 메시지
        String userId,     // 대상 사용자 ID
        Instant timestamp  // 응답 시각
) {
    // 성공 응답 팩토리 메서드
    public static AdminActionResponse success(String message, String userId) {
        return new AdminActionResponse("SUCCESS", message, userId, Instant.now());
    }

    // 실패 응답 팩토리 메서드
    public static AdminActionResponse fail(String message, String userId) {
        return new AdminActionResponse("FAIL", message, userId, Instant.now());
    }
}