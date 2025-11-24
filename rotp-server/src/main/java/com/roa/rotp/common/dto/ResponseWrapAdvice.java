package com.roa.rotp.common.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.core.MethodParameter;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.Locale;

@RestControllerAdvice
@RequiredArgsConstructor
public class ResponseWrapAdvice implements ResponseBodyAdvice<Object> {

    private final ObjectMapper mapper;
    private final MessageSource messageSource;
    private final LocaleResolver localeResolver;

    @Retention(RetentionPolicy.RUNTIME)
    @Target({ElementType.METHOD, ElementType.TYPE})
    public @interface NoWrap {}

    @Override
    public boolean supports(@NonNull MethodParameter returnType,
                            @NonNull Class<? extends HttpMessageConverter<?>> converterType) {

        // @NoWrap 이 클래스나 메서드에 붙어 있으면 감싸지 않음
        if (returnType.getContainingClass().isAnnotationPresent(NoWrap.class)) return false;
        return !returnType.hasMethodAnnotation(NoWrap.class);
    }

    @Override
    @Nullable
    public Object beforeBodyWrite(@Nullable Object body,
                                  @NonNull MethodParameter returnType,
                                  @NonNull MediaType contentType,
                                  @NonNull Class<? extends HttpMessageConverter<?>> converterType,
                                  @NonNull ServerHttpRequest request,
                                  @NonNull ServerHttpResponse response) {

        String path = request.getURI().getPath();

        // 문서/정적 또는 /api/가 아닌 경로는 래핑 제외
        if (path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/webjars")
                || !path.startsWith("/api/")) {
            return body;
        }

        // 이미 ApiResponse 인 경우는 그대로 통과
        if (body instanceof ApiResponse<?> ar) return ar;

        // 파일/리소스 응답은 래핑하지 않음
        if (body instanceof Resource) return body;

        // 바이너리 응답도 래핑하지 않음
        if (MediaType.APPLICATION_OCTET_STREAM.equals(contentType)
                || MediaType.APPLICATION_PDF.equals(contentType)) {
            return body;
        }

        // Locale 결정
        Locale locale = (request instanceof ServletServerHttpRequest sr)
                ? localeResolver.resolveLocale(sr.getServletRequest())
                : Locale.KOREAN;

        String okMsg = messageSource.getMessage("ok", null, "OK", locale);

        // String 응답일 경우: 직접 JSON 문자열로 감싸야 함
        if (body instanceof String s) {
            response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
            try {
                return mapper.writeValueAsString(ApiResponse.ok(s));
            } catch (Exception e) {
                // 최후의 보루: ObjectMapper 실패 시 수동으로 JSON 만들어 반환
                String escaped = s.replace("\"", "\\\"");
                return "{\"code\":\"0\",\"msg\":\"" + okMsg + "\",\"data\":\"" + escaped + "\"}";
            }
        }

        // 그 외 일반적인 객체는 ApiResponse.ok(...) 래핑
        return ApiResponse.ok(body);
    }
}