package com.roa.rotp.admin.repository;

import com.roa.rotp.admin.entity.AdminRefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdminRefreshTokenRepository extends JpaRepository<AdminRefreshToken, Long> {
    // 현재 유효한(취소되지 않은) 특정 refreshToken 조회
    Optional<AdminRefreshToken> findByRefreshTokenAndRevokedFalse(String refreshToken);

    // 한 관리자 계정의 모든 유효한 토큰
    List<AdminRefreshToken> findAllByAdmin_IdAndRevokedFalse(Long adminId);

    Optional<AdminRefreshToken> findByAdmin_IdAndUuidAndUserAgent(Long adminId, String uuid, String userAgent);
}