package com.roa.rotp.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(AbstractHttpConfigurer::disable) // 개발 중에는 CSRF 비활성화
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/h2-console/**").permitAll() // H2 콘솔 허용
//                        .requestMatchers("/**").permitAll()        // API 전체 허용
//                        .anyRequest().authenticated()
//                )
//                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable)) // iframe 허용
//                .formLogin(AbstractHttpConfigurer::disable) // 기본 로그인 폼 비활성화
//                .httpBasic(AbstractHttpConfigurer::disable); // Basic Auth도 비활성화
//
//        return http.build();
//    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/admin/**").hasRole("ADMIN")   // 관리자만 접근
                        .requestMatchers("/h2-console/**").permitAll()   // H2 콘솔 허용
                        .requestMatchers("/register").permitAll()        // 회원가입 허용
                        .anyRequest().denyAll()
                )
                .formLogin(AbstractHttpConfigurer::disable)   // 기본 로그인폼 제거
                .logout(AbstractHttpConfigurer::disable); // 기본 로그아웃 제거

        http.csrf(AbstractHttpConfigurer::disable); // CSRF 비활성화 (개발용)
        http.headers(headers -> headers.frameOptions(frame -> frame.disable())); // iframe 허용

        return http.build();
    }
}