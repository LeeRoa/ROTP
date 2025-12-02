package com.roa.rotp.admin.dto.auth;

public record TokenResponse(
        String accessToken,
        String refreshToken
) {}
