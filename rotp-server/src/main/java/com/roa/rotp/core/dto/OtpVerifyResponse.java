package com.roa.rotp.core.dto;

public record OtpVerifyResponse (
    boolean success,
    String message
) {}