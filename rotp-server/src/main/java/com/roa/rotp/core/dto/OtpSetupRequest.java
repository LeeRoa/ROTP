package com.roa.rotp.core.dto;

import com.roa.rotp.core.domain.OtpAlgorithm;

public record OtpSetupRequest(
        String userId,
        String secretBase32,
        OtpAlgorithm algorithm,
        int digits,
        int period
) {}
