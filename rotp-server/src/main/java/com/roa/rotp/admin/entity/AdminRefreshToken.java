package com.roa.rotp.admin.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "admin_refresh_token")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminRefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 고유 식별자 (UUID 등)
    @Column(name = "uuid", nullable = false, unique = true, length = 100)
    private String uuid;

    // 어떤 관리자 계정의 토큰인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)   // FK 컬럼 이름
    private AdminUser admin;

    // 실제 refresh 토큰 문자열 (예: JWT)
    @Column(name = "refresh_token", nullable = false, length = 500)
    private String refreshToken;

    // 만료 시각
    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    // 로그아웃/강제 만료 여부
    @Column(name = "revoked", nullable = false)
    private boolean revoked;

    @Column(name = "ip_address")
    private String ipAddress;

    // 선택: 기기 정보(브라우저/OS 등 추적용)
    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}