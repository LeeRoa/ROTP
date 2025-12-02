package com.roa.rotp.admin.service;

import com.roa.rotp.admin.dto.auth.TokenResponse;
import com.roa.rotp.admin.entity.AdminUser;

public interface LoginService {

    /**
     * 관리자 계정 등록
     * @param adminUser 관리자 정보 (username, password 등)
     */
    void registerAdmin(AdminUser adminUser);

    void storeRefreshToken(String username, String refreshToken, String userAgent, String ipAddress, String uuid);

    TokenResponse validateAndRotateRefreshToken(String refreshToken);

    void revokeAllForAdmin(Long adminId);
}