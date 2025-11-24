package com.roa.rotp.core.domain;

import lombok.Getter;

@Getter
public enum OtpVerifyMessage {
    SUCCESS("인증 성공"),
    FAILURE("인증 실패");

    private final String message;

    OtpVerifyMessage(String message) {
        this.message = message;
    }
}