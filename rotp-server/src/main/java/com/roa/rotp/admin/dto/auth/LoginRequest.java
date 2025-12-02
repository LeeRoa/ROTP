package com.roa.rotp.admin.dto.auth;

public record LoginRequest(
        String username,
        String password,
        String uuid
) {}
