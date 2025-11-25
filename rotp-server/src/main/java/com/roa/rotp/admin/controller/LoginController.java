package com.roa.rotp.admin.controller;

import com.roa.rotp.admin.dto.AdminRegisterRequest;
import com.roa.rotp.admin.entity.Admin;
import com.roa.rotp.admin.model.Role;
import com.roa.rotp.admin.service.LoginService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class LoginController {

    private final PasswordEncoder passwordEncoder;
    private final LoginService loginService;

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
}
