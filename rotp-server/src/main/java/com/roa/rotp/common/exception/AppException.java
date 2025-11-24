package com.roa.rotp.common.exception;

import com.roa.rotp.common.model.ErrorCode;
import lombok.Getter;

@Getter
public class AppException extends RuntimeException {
    private final ErrorCode code;

    public AppException(ErrorCode code) {
        super(code.message());
        this.code = code;
    }

    public AppException(ErrorCode code, String overrideMessage) {
        super(overrideMessage == null ? code.message() : overrideMessage);
        this.code = code;
    }

    /** 예: throw AppException.fmt(ErrorCode.INVALID_ARGUMENT, "필드 %s 가 유효하지 않습니다", "email") */
    public static AppException fmt(ErrorCode code, String fmt, Object... args) {
        return new AppException(code, fmt == null ? null : String.format(fmt, args));
    }
}
