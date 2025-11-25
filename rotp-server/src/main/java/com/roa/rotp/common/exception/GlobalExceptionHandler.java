package com.roa.rotp.common.exception;

import com.roa.rotp.common.dto.ApiResponse;
import com.roa.rotp.common.model.ErrorCode;
import com.roa.rotp.common.model.JsonMediaTypes;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.*;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final MessageSource messageSource;
    private final LocaleResolver localeResolver;
    private static final Object[] NO_ARGS = new Object[0];

    private Locale locale(HttpServletRequest req) {
        return localeResolver.resolveLocale(req);
    }

    private String i18n(String key, String defaultMsg, Locale locale) {
        return messageSource.getMessage(key, NO_ARGS, defaultMsg, locale);
    }

    private String i18n(ErrorCode ec, Locale locale) {
        return i18n(ec.key(), ec.message(), locale);
    }

    /** 기본 에러 응답 (ErrorCode의 status 사용) */
    private ResponseEntity<ApiResponse<Void>> fail(ErrorCode ec, Locale locale) {
        return ResponseEntity.status(ec.status())
                .contentType(JsonMediaTypes.APPLICATION_JSON_UTF8)
                .body(ApiResponse.fail(ec.code(), i18n(ec, locale)));
    }

    /** 상태코드를 오버라이드하는 에러 응답 */
    private ResponseEntity<ApiResponse<Void>> fail(ErrorCode ec, Locale locale, HttpStatus status) {
        return ResponseEntity.status(status)
                .contentType(JsonMediaTypes.APPLICATION_JSON_UTF8)
                .body(ApiResponse.fail(ec.code(), i18n(ec, locale)));
    }

    /** 커스텀 메시지를 사용하는 에러 응답 (status는 ErrorCode에 정의된 값 사용) */
    private ResponseEntity<ApiResponse<Void>> fail(ErrorCode ec, String message, Locale locale) {
        return ResponseEntity.status(ec.status())
                .contentType(JsonMediaTypes.APPLICATION_JSON_UTF8)
                .body(ApiResponse.fail(ec.code(), message));
    }

    private ResponseEntity<ApiResponse<Map<String, Object>>> failWithErrors(Locale locale,
                                                                            List<Map<String, Object>> errors) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("errors", errors);
        return ResponseEntity.status(ErrorCode.INVALID_ARGUMENT.status())
                .contentType(JsonMediaTypes.APPLICATION_JSON_UTF8)
                .body(new ApiResponse<>(ErrorCode.INVALID_ARGUMENT.code(),
                        i18n(ErrorCode.INVALID_ARGUMENT, locale), data));
    }

    private List<Map<String, Object>> fieldErrors(BindingResult br, Locale locale) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (FieldError fe : br.getFieldErrors()) {
            Map<String, Object> one = new LinkedHashMap<>();
            one.put("field", fe.getField());
            one.put("message", messageSource.getMessage(fe, locale));
            one.put("rejected", fe.getRejectedValue());
            list.add(one);
        }
        return list;
    }

    /** ───────────────── 인증 관련 ───────────────── */

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentials(HttpServletRequest req) {
        Locale locale = locale(req);
        // 아이디/비밀번호 불일치 → AUTH_BAD_CREDENTIALS 사용
        return fail(ErrorCode.AUTH_BAD_CREDENTIALS, locale);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthException(HttpServletRequest req) {
        Locale locale = locale(req);
        // 계정 비활성/잠김 등 기타 인증 문제 → AUTH_ACCOUNT_DISABLED 사용 (설계에 맞게)
        return fail(ErrorCode.AUTH_ACCOUNT_DISABLED, locale);
    }

    /** ───────────────── 리소스 관련 ───────────────── */

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNoResourceFound(
            HttpServletRequest req, NoResourceFoundException ex) {
        Locale locale = locale(req);
        // 기존: NOT_FOUND 메시지 + ex.getMessage() 조합 → 커스텀 메세지 버전 fail 사용
        String msg = i18n(ErrorCode.NOT_FOUND, locale) + ex.getMessage();
        return fail(ErrorCode.NOT_FOUND, msg, locale);
    }

    /** ───────────────── 검증 관련 ───────────────── */

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Map<String, Object>>> handleConstraint(ConstraintViolationException ex,
                                                                             HttpServletRequest req) {
        Locale locale = locale(req);
        List<Map<String, Object>> details = ex.getConstraintViolations().stream()
                .map(v -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("field", v.getPropertyPath().toString());
                    m.put("message", v.getMessage());
                    m.put("rejected", v.getInvalidValue());
                    return m;
                })
                .toList();
        return failWithErrors(locale, details);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotReadable(HttpServletRequest req) {
        Locale locale = locale(req);
        String msg = i18n("error.malformed_json", "Malformed JSON", locale);
        // INVALID_ARGUMENT 코드 + 커스텀 메시지
        return fail(ErrorCode.INVALID_ARGUMENT, msg, locale);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodNotSupported(HttpServletRequest req) {
        Locale locale = locale(req);
        String msg = i18n("error.method_not_supported",
                ErrorCode.METHOD_NOT_SUPPORTED.message(), locale);
        return fail(ErrorCode.METHOD_NOT_SUPPORTED, msg, locale);
    }

    @ExceptionHandler({ MethodArgumentNotValidException.class, BindException.class })
    public ResponseEntity<ApiResponse<Map<String, Object>>> handleBind(Exception ex, HttpServletRequest req) {
        Locale locale = locale(req);
        BindingResult br = (ex instanceof MethodArgumentNotValidException manve)
                ? manve.getBindingResult()
                : ((BindException) ex).getBindingResult();
        return failWithErrors(locale, fieldErrors(br, locale));
    }

    /** ───────────────── AppException ───────────────── */

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Void>> handleApp(AppException ex, HttpServletRequest req) {
        Locale locale = locale(req);
        ErrorCode ec = ex.getCode();

        String msg = ex.getMessage();
        if (msg == null || msg.isBlank() || msg.equals(ec.message())) {
            msg = i18n(ec, locale);
        }

        // ErrorCode에 정의된 status 사용 + 커스텀/로컬라이즈된 메시지
        return fail(ec, msg, locale);
    }

    /** ───────────────── 나머지 전부 ───────────────── */

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleAny(Exception ex, HttpServletRequest req) {
        Locale locale = locale(req);
        String traceId = UUID.randomUUID().toString();
        log.error("[{}] Unhandled exception on {} {}", traceId, req.getMethod(), req.getRequestURI(), ex);

        // ResponseStatusException이면 그 상태코드는 그대로 유지
        if (ex instanceof ResponseStatusException rse) {
            return ResponseEntity.status(rse.getStatusCode())
                    .header("X-Trace-Id", traceId)
                    .contentType(JsonMediaTypes.APPLICATION_JSON_UTF8)
                    .body(ApiResponse.fail(ErrorCode.INTERNAL_ERROR.code(),
                            i18n(ErrorCode.INTERNAL_ERROR, locale)));
        }

        return ResponseEntity.status(ErrorCode.INTERNAL_ERROR.status())
                .header("X-Trace-Id", traceId)
                .contentType(JsonMediaTypes.APPLICATION_JSON_UTF8)
                .body(ApiResponse.fail(ErrorCode.INTERNAL_ERROR.code(),
                        i18n(ErrorCode.INTERNAL_ERROR, locale)));
    }
}