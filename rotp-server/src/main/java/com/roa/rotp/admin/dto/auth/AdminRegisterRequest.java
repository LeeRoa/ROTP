package com.roa.rotp.admin.dto.auth;

import com.roa.rotp.admin.validator.ValidPassword;
import jakarta.validation.constraints.NotNull;

public record AdminRegisterRequest(
        @NotNull
        String username,
        @ValidPassword
        String password,
        @NotNull
        String nickname,
        String email,
        String callNumber
) {}