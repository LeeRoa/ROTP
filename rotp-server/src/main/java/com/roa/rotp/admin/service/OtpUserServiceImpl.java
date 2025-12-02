package com.roa.rotp.admin.service;

import com.roa.rotp.admin.dto.otpuser.OtpBypassResponse;
import com.roa.rotp.admin.dto.otpuser.OtpUserSearchRequest;
import com.roa.rotp.admin.dto.otpuser.UpdateOtpUserInfoRequest;
import com.roa.rotp.common.exception.AppException;
import com.roa.rotp.common.model.ErrorCode;
import com.roa.rotp.core.entity.OtpUser;
import com.roa.rotp.core.mapper.OtpUserMapper;
import com.roa.rotp.core.repository.OtpUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class OtpUserServiceImpl implements OtpUserService {

    private final OtpUserMapper mapper;
    private final OtpUserRepository repo;

    @Override
    @Transactional(readOnly = true)
    public Page<OtpUser> searchOtpUsers(OtpUserSearchRequest request, Pageable pageable) {
        return repo.search(request, pageable);
    }

    @Override
    public OtpUser getOtpUser(String userId) {
        return repo.findById(userId)
                .orElseThrow(() -> AppException.fmt(ErrorCode.INVALID_ARGUMENT, "사용자 없음: %s", userId));
    }

    @Override
    public void updateUser(UpdateOtpUserInfoRequest request) {
        OtpUser otpUser = repo.findById(request.userId())
                .orElseThrow(() -> AppException.fmt(ErrorCode.INVALID_ARGUMENT, "사용자 없음: %s", request.userId()));

        mapper.updateToEntity(request, otpUser);

        repo.save(otpUser);
    }

    @Override
    public void deleteUser(String userId) {
        repo.deleteById(userId);
    }

    @Override
    @Transactional
    public OtpBypassResponse grantBypass(String userId, Instant until, String adminId) {
        OtpUser otpUser = repo.findById(userId)
                .orElseThrow(() -> AppException.fmt(ErrorCode.INVALID_ARGUMENT, "사용자 없음: %s", userId));

        validateUntil(until);

        otpUser.setOtpBypassUntil(until);
        otpUser.setLastModifiedBy(adminId);
        repo.save(otpUser);

        return new OtpBypassResponse(
                "Bypass granted until " + until,
                userId,
                Instant.now()
        );
    }

    @Override
    @Transactional
    public OtpBypassResponse revokeBypass(String userId, String adminId) {
        OtpUser otpUser = repo.findById(userId)
                .orElseThrow(() -> AppException.fmt(ErrorCode.INVALID_ARGUMENT, "사용자 없음: %s", userId));

        otpUser.setOtpBypassUntil(null);
        otpUser.setLastModifiedBy(adminId);
        repo.save(otpUser);

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

    /**
     * bypass 종료 시각 유효성 검사
     * @param until bypass 종료 시각
     */
    private void validateUntil(Instant until) {
        if (until == null) {
            throw AppException.fmt(ErrorCode.INVALID_ARGUMENT, "bypass 종료 시각은 필수입니다.");
        }
        if (until.isBefore(Instant.now())) {
            throw AppException.fmt(ErrorCode.INVALID_ARGUMENT, "bypass 종료 시각은 현재 시각 이후여야 합니다.");
        }
    }
}
