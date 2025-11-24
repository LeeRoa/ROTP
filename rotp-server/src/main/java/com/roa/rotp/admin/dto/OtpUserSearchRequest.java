package com.roa.rotp.admin.dto;

import java.time.Instant;

public record OtpUserSearchRequest(
        String userId,
        Boolean disabled,
        Instant createdFrom,
        Instant createdTo
) {}