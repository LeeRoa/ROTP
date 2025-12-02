package com.roa.rotp.admin.service;

import com.roa.rotp.admin.dto.TokenResponse;
import com.roa.rotp.admin.entity.AdminRefreshToken;
import com.roa.rotp.admin.entity.AdminUser;
import com.roa.rotp.admin.repository.AdminRefreshTokenRepository;
import com.roa.rotp.admin.repository.AdminRepository;
import com.roa.rotp.common.exception.AppException;
import com.roa.rotp.common.model.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {

    private final AdminRefreshTokenRepository refreshTokenRepository;
    private final AdminRepository adminRepository;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    public void registerAdmin(AdminUser adminUser) {
        if (adminRepository.existsByUsername(adminUser.getUsername())) {
            throw new AppException(ErrorCode.DUPLICATE_USERNAME, "Admin with username " + adminUser.getUsername() + " already exists.");
        }

        adminRepository.save(adminUser);
    }

    /**
     * 로그인 성공 시 DB에 refresh token 저장
     * - 같은 admin + userAgent(= 같은 기기)면 기존 토큰을 덮어씀 (update)
     * - 다른 기기(userAgent 다름)이면 새 row insert
     */
    @Override
    @Transactional
    public void storeRefreshToken(String username, String refreshToken, String userAgent, String ipAddress, String uuid) {
        AdminUser admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Date exp = jwtService.extractExpiration(refreshToken);

        // 1) 같은 admin + userAgent + ip로 기존 토큰이 있는지 조회
        Optional<AdminRefreshToken> existingOpt =
                refreshTokenRepository.findByAdmin_IdAndUuidAndUserAgent(
                        admin.getId(),
                        uuid,
                        userAgent
                );

        if (existingOpt.isPresent()) {
            // 2-A) 기존 토큰이 있으면 → 그 row를 업데이트
            AdminRefreshToken existing = existingOpt.get();
            existing.setRefreshToken(refreshToken);
            existing.setExpiresAt(exp.toInstant());
            existing.setRevoked(false);
            existing.setCreatedAt(Instant.now());
            // JPA 더티체킹으로 flush 되므로 save() 안 해도 되지만, 명시적으로 해도 OK
            // refreshTokenRepository.save(existing);
        } else {
            // 2-B) 없으면 → 새 row insert
            AdminRefreshToken entity = AdminRefreshToken.builder()
                    .admin(admin)
                    .refreshToken(refreshToken)
                    .expiresAt(exp.toInstant())
                    .revoked(false)
                    .userAgent(userAgent)
                    .ipAddress(ipAddress)
                    .createdAt(Instant.now())
                    .uuid(uuid)
                    .build();

            refreshTokenRepository.save(entity);
        }
    }

    /**
     * refreshToken을 검증하고, 새 access/refresh 토큰을 발급 + 기존 토큰 revoke(회수)
     * - 여기서 말한 validateRefreshToken 기능
     */
    @Override
    @Transactional
    public TokenResponse validateAndRotateRefreshToken(String refreshToken) {

        // 1) DB에 존재하는지 & revoke 안 된 건지 확인
        AdminRefreshToken storedToken = refreshTokenRepository
                .findByRefreshTokenAndRevokedFalse(refreshToken)
                .orElseThrow(() -> new AppException(ErrorCode.JWT_INVALID_TOKEN));

        // 2) JWT 자체 검증 (서명, typ=refresh, 만료 등)
        String username;
        try {
            username = jwtService.extractUsername(refreshToken);
        } catch (Exception e) {
            // JWT 파싱 에러
            throw new AppException(ErrorCode.JWT_INVALID_TOKEN);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        if (!jwtService.isRefreshTokenValid(refreshToken, userDetails)) {
            // JWT 자체가 유효하지 않으면 DB에 있는 것도 폐기
            storedToken.setRevoked(true);
            throw new AppException(ErrorCode.JWT_INVALID_TOKEN);
        }

        // 3) DB 기준 만료 체크
        if (storedToken.getExpiresAt().isBefore(Instant.now())) {
            storedToken.setRevoked(true);
            throw new AppException(ErrorCode.JWT_INVALID_TOKEN);
        }

        // 4) 기존 토큰 revoke 처리 (토큰 Rotation)
        storedToken.setRevoked(true);

        // 5) 새 access / refresh 토큰 생성
        String newAccessToken = jwtService.generateAccessToken(username);
        String newRefreshToken = jwtService.generateRefreshToken(username);

        // 6) 새 refresh 토큰을 DB에 저장 (다른 기기 세션은 그대로 둠)
        AdminUser admin = storedToken.getAdmin();
        Date newExp = jwtService.extractExpiration(newRefreshToken);

        AdminRefreshToken newTokenEntity = AdminRefreshToken.builder()
                .admin(admin)
                .refreshToken(newRefreshToken)
                .expiresAt(newExp.toInstant())
                .revoked(false)
                .userAgent(storedToken.getUserAgent()) // 기기 정보 그대로 복사 또는 새로 세팅
                .createdAt(Instant.now())
                .build();

        refreshTokenRepository.save(newTokenEntity);

        return new TokenResponse(newAccessToken, newRefreshToken);
    }

    /**
     * 특정 관리자 계정의 모든 refresh 토큰 revoke (모든 기기에서 로그아웃)
     */
    @Override
    @Transactional
    public void revokeAllForAdmin(Long adminId) {
        refreshTokenRepository.findAllByAdmin_IdAndRevokedFalse(adminId)
                .forEach(token -> token.setRevoked(true));
    }
}
