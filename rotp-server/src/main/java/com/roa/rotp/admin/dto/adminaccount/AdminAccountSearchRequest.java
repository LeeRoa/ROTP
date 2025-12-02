package com.roa.rotp.admin.dto.adminaccount;

import com.roa.rotp.admin.model.Role;

import java.time.Instant;

public record AdminAccountSearchRequest(
        String field,
        String keyword,
        Role role,
        Boolean enabled,
        Instant startDate,
        Instant endDate
) {
}