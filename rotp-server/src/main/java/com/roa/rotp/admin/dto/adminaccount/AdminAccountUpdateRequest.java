package com.roa.rotp.admin.dto.adminaccount;

import com.roa.rotp.admin.model.Role;

public record AdminAccountUpdateRequest(
        Long id,
        String nickname,
        String email,
        Role role,
        Boolean enabled
) {
}
