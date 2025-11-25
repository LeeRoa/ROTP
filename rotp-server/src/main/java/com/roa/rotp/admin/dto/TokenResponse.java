package com.roa.rotp.admin.dto;

public record TokenResponse(
        String accessToken,
        String refreshToken
) {}
