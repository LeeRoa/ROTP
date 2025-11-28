package com.roa.rotp.admin.service;

import com.roa.rotp.admin.dto.OtpBypassResponse;
import com.roa.rotp.admin.dto.OtpUserSearchRequest;
import com.roa.rotp.admin.dto.UpdateOtpUserInfoRequest;
import com.roa.rotp.core.entity.OtpUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;

public interface OtpUserService {
    Page<OtpUser> searchOtpUsers(OtpUserSearchRequest request, Pageable pageable);

    OtpUser getOtpUser(String userId);

    void updateUser(UpdateOtpUserInfoRequest request);

    void deleteUser(String userId);

    OtpBypassResponse grantBypass(String userId, Instant until, String adminId);

    OtpBypassResponse revokeBypass(String userId, String adminId);

    boolean isBypassActive(OtpUser otpUser);

}
