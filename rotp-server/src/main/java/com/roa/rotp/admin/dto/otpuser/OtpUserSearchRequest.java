package com.roa.rotp.admin.dto.otpuser;

import java.time.Instant;

public record OtpUserSearchRequest(
        String field,
        String keyword,
        Boolean disabled,
        Instant startDate,
        Instant endDate
) {}