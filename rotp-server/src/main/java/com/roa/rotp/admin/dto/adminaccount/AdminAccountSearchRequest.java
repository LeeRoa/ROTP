package com.roa.rotp.admin.dto.adminaccount;

import com.roa.rotp.admin.model.Role;
import com.roa.rotp.common.dto.SearchRequest;

import java.time.Instant;

public record AdminAccountSearchRequest(
        SearchRequest search,
        Role role,
        Boolean enabled,
        Instant startDate,
        Instant endDate
) {
}