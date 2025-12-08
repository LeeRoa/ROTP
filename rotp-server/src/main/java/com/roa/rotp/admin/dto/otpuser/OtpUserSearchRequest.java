package com.roa.rotp.admin.dto.otpuser;

import com.roa.rotp.common.dto.SearchRequest;

import java.time.Instant;

public record OtpUserSearchRequest(
        SearchRequest search,
        Boolean disabled,
        Instant startDate,
        Instant endDate
) {}