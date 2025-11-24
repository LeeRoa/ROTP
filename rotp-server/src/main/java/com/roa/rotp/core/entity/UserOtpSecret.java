package com.roa.rotp.core.entity;

import com.roa.rotp.core.domain.OtpAlgorithm;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Getter
@Setter
@Table(name = "user_otp_secret")
public class UserOtpSecret {

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
}