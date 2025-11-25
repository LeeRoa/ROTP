package com.roa.rotp.core.entity;

import com.roa.rotp.common.entity.BaseEntity;
import com.roa.rotp.core.domain.OtpAlgorithm;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Getter
@Setter
@Table(name = "otp_user")
public class OtpUser extends BaseEntity {

    @Id
    private String userId;   // 사용자 ID

    @Column(nullable = false)
    private String encSecretBase64; // 암호화된 시크릿 키

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OtpAlgorithm algorithm = OtpAlgorithm.SHA1; // 기본 알고리즘

    @Column(nullable = false)
    private int digits = 6;  // OTP 자리수

    @Column(nullable = false)
    private int period = 30; // 주기(초)

    private Instant createdAt = Instant.now();

    private Long lastAcceptedCounter; // 마지막으로 수락된 카운터 값

    private boolean disabled = false;

    private String disabledBy;        // 비활성화한 관리자 ID
    private Instant disabledAt;       // 비활성화된 시각

    private Instant otpBypassUntil;   // 임시 패스 허용 시각

    private Instant lastUsedAt;       // OTP 마지막 사용 시각
    private String lastModifiedBy;    // OTP 설정 변경한 관리자 ID


    /* 추가 필드 */
    @Column(unique = true)
    private String email;    // 사용자 이메일 (로그인/연락용)

    @Column(unique = true)
    private String phoneNumber; // 사용자 휴대폰 번호 (SMS 인증용)
}