package com.roa.rotp.admin.dto.adminaccount;

import com.roa.rotp.admin.model.Role;

import java.time.Instant;

public record AdminAccountResponse(
        Long id,
        String username,
        String nickname,
        String email,
        String callNumber,
        Role role,
        Boolean enabled,
        Instant createdAt,
        Instant updatedAt,
        Instant lastLoginAt
) {
}