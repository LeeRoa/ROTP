package com.roa.rotp.admin.dto.adminaccount;

import com.roa.rotp.admin.model.Role;

import java.time.Instant;

public record AdminAccountResponse(
        Long id,
        String username,
        String nickname,
        String email,
        Role role,
        Boolean enabled,
        Instant createdAt,
        Instant lastLoginAt
) {
}
