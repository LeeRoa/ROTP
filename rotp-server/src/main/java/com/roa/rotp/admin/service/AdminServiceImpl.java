package com.roa.rotp.admin.service;

import com.roa.rotp.admin.dto.OtpBypassResponse;
import com.roa.rotp.admin.dto.OtpUserSearchRequest;
import com.roa.rotp.core.entity.OtpUser;
import com.roa.rotp.core.repository.OtpUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final OtpUserRepository repo;

    /**
     * OTP 사용자 검색 (페이징 지원)
     */
    @Override
    @Transactional(readOnly = true)
    public Page<OtpUser> searchOtpUsers(OtpUserSearchRequest request, Pageable pageable) {
        return repo.search(request, pageable);
    }

    @Override
    @Transactional
    public OtpBypassResponse grantBypass(String userId, Instant until, String adminId) {
        OtpUser secret = repo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        secret.setOtpBypassUntil(until);
        secret.setLastModifiedBy(adminId);
        repo.save(secret);

        return new OtpBypassResponse(
                "Bypass granted until " + until,
                userId,
                Instant.now()
        );
    }

    @Override
    @Transactional
    public OtpBypassResponse revokeBypass(String userId, String adminId) {
        OtpUser secret = repo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        secret.setOtpBypassUntil(null);
        secret.setLastModifiedBy(adminId);
        repo.save(secret);

        return new OtpBypassResponse(
                "Bypass revoked",
                userId,
                Instant.now()
        );
    }

    @Override
    public boolean isBypassActive(OtpUser otpUser) {
        return otpUser.getOtpBypassUntil() != null &&
                Instant.now().isBefore(otpUser.getOtpBypassUntil());
    }
}
