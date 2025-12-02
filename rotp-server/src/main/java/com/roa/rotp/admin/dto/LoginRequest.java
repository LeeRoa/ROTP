package com.roa.rotp.admin.dto;

public record LoginRequest(
        String username,
        String password,
        String uuid
) {}
