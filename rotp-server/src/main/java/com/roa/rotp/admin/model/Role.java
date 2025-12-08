package com.roa.rotp.admin.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Role {
    ADMIN("ROLE_ADMIN"),
    SUPER("ROLE_SUPER");

    private final String value;
}