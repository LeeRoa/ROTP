package com.roa.rotp.admin.entity;

import com.roa.rotp.admin.model.Role;
import com.roa.rotp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "admin_accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAccount extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 기본 PK

    @Column(nullable = false, unique = true, length = 50)
    private String username; // 관리자 계정명

    @Column(nullable = false, length = 50)
    private String nickname; // 관리자 닉네임

    @Column(length = 50)
    private String email; // 관리자 이메일

    @Column(length = 50)
    private String callNumber; // 관리자 연락처

    @Column(nullable = false)
    private String password; // 암호화된 비밀번호 (BCrypt)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder.Default
    @Column(nullable = false)
    private boolean enabled = true; // 계정 활성화 여부

    private Instant lastLoginAt; // 마지막 로그인 일시

    @Builder.Default
    @OneToMany(
            mappedBy = "admin",          // ← AdminRefreshToken 필드명과 맞춰야 함
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<AdminRefreshToken> refreshTokens = new ArrayList<>();

    public static final List<String> SEARCHABLE_FIELDS =
            List.of("username", "nickname", "email");
}