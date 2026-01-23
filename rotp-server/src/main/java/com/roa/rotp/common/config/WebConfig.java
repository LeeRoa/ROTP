package com.roa.rotp.common.config;

import com.roa.rotp.common.interceptor.AuditInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final AuditInterceptor auditInterceptor;

    public WebConfig(AuditInterceptor auditInterceptor) {
        this.auditInterceptor = auditInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(auditInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(
                        "/admin/audit/**",      // 감사로그 조회는 제외 (무한루프 방지)
                        "/auth/refresh",        // 토큰 갱신은 제외
                        "/auth/register",       // 등록은 별도 처리 가능
                        "/h2-console/**"
                );
        // /auth/login, /auth/logout 은 감사로그에 기록됨
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*") // 허용할 프론트 도메인
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}