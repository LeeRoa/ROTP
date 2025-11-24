package com.roa.rotp.core.dto;

public record OtpSetupResponse(
        String userId,
        String secretBase32,
        String otpauthUri,
        String qrPngBase64
) {}
