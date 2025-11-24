package com.roa.rotp.core.repository;

import com.roa.rotp.admin.dto.OtpUserSearchRequest;
import com.roa.rotp.core.entity.OtpUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomUserOtpSecretRepository {
    Page<OtpUser> search(OtpUserSearchRequest request, Pageable pageable);
}