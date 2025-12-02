package com.roa.rotp.admin.controller;

import com.roa.rotp.admin.dto.AdminRegisterRequest;
import com.roa.rotp.admin.dto.LoginRequest;
import com.roa.rotp.admin.dto.RefreshRequest;
import com.roa.rotp.admin.dto.TokenResponse;
import com.roa.rotp.admin.entity.AdminUser;
import com.roa.rotp.admin.model.Role;
import com.roa.rotp.admin.service.JwtService;
import com.roa.rotp.admin.service.LoginService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final PasswordEncoder passwordEncoder;
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
        AdminUser adminUser = AdminUser.builder()
                .username(request.username())
                .nickname(request.nickname())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.ADMIN)
                .enabled(true)
                .build();

        loginService.registerAdmin(adminUser);

        return "Admin account created: " + adminUser.getUsername();
    }

    @PostMapping("/login")
    public TokenResponse login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(request.username(), request.password());

        authenticationManager.authenticate(authToken);

        String username = request.username();
        String accessToken = jwtService.generateAccessToken(username);
        String refreshToken = jwtService.generateRefreshToken(username);

        // 기기 정보(user-agent)를 넣어두면 나중에 “어떤 기기에서 로그인했는지” 추적 가능
        String userAgent = httpRequest.getHeader("User-Agent");
        String ipAddress = httpRequest.getHeader("X-Forwarded-For");
        if (ipAddress == null) {
            ipAddress = httpRequest.getRemoteAddr();
        }

        // DB에 refresh 토큰 저장 (다중 기기 지원)
        loginService.storeRefreshToken(username, refreshToken, userAgent, ipAddress, request.uuid());

        return new TokenResponse(accessToken, refreshToken);
    }

    @PostMapping("/refresh")
    public TokenResponse refresh(@RequestBody RefreshRequest request) {
        String refreshToken = request.refreshToken();
        return loginService.validateAndRotateRefreshToken(refreshToken);
    }

    @PostMapping("/logout")
    public void logout(@RequestParam Long adminId) {
        loginService.revokeAllForAdmin(adminId);
    }
}
