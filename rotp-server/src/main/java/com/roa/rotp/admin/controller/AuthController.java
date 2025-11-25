package com.roa.rotp.admin.controller;

import com.roa.rotp.admin.dto.*;
import com.roa.rotp.admin.entity.Admin;
import com.roa.rotp.admin.model.Role;
import com.roa.rotp.admin.service.JwtService;
import com.roa.rotp.admin.service.LoginService;
import com.roa.rotp.common.exception.AppException;
import com.roa.rotp.common.model.ErrorCode;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final PasswordEncoder passwordEncoder;
    private final UserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final LoginService loginService;
    private final JwtService jwtService;

    /**
     * 관리자 계정 추가
     * @param request 관리자 요청 정보
     * @return 생성된 관리자 계정 정보
     */
    @PostMapping("/register")
    public String addAdmin(@Valid @RequestBody AdminRegisterRequest request) {
        Admin admin = Admin.builder()
                .username(request.username())
                .nickname(request.nickname())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.ADMIN)
                .enabled(true)
                .build();

        loginService.registerAdmin(admin);

        return "Admin account created: " + admin.getUsername();
    }

    @PostMapping("/login")
    public TokenResponse login(@RequestBody LoginRequest request) {

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(request.username(), request.password());

        // 실패 시 BadCredentialsException 등 → GlobalExceptionHandler 처리
        authenticationManager.authenticate(authToken);

        String username = request.username();
        String accessToken = jwtService.generateAccessToken(username);
        String refreshToken = jwtService.generateRefreshToken(username);

        return new TokenResponse(accessToken, refreshToken);
    }

    @PostMapping("/refresh")
    public AccessTokenResponse refresh(@RequestBody RefreshRequest request) {

        String refreshToken = request.refreshToken();

        String username;
        try {
            // refresh 토큰에서 username 추출
            username = jwtService.extractUsername(refreshToken);
        } catch (Exception e) {
            // jwt 파싱 실패, 서명 오류 등
            throw new AppException(ErrorCode.JWT_INVALID_TOKEN);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        // typ=refresh 이고, 만료 안 됐고, username 일치하는지 등 체크
        if (!jwtService.isRefreshTokenValid(refreshToken, userDetails)) {
            throw new AppException(ErrorCode.JWT_INVALID_TOKEN);
        }

        // 새 access 토큰 발급 (refresh 는 그대로 재사용 or 정책에 따라 재발급)
        String newAccessToken = jwtService.generateAccessToken(username);

        return new AccessTokenResponse(newAccessToken);
    }
}
