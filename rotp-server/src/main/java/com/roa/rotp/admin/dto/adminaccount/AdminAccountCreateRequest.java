package com.roa.rotp.admin.dto.adminaccount;

import com.roa.rotp.admin.model.Role;

public record AdminAccountCreateRequest(
        String username,
        String nickname,
        String email,
        String password,
        Role role,
        Boolean enabled
) {
}
