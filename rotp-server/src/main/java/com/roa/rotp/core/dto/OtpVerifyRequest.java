package com.roa.rotp.core.dto;

public record OtpVerifyRequest(
    String userId,
    String code
) {}
