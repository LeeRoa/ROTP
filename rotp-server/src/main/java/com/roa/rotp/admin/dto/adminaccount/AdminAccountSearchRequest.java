package com.roa.rotp.admin.dto.adminaccount;

import com.roa.rotp.admin.model.Role;

public record AdminAccountSearchRequest(
        String field,
        String keyword,
        Role role,
        Boolean enabled
) {
}