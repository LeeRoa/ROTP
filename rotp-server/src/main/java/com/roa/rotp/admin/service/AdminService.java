package com.roa.rotp.admin.service;

import com.roa.rotp.admin.dto.OtpUserSearchRequest;
import com.roa.rotp.core.entity.OtpUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {
    Page<OtpUser> searchOtpUsers(OtpUserSearchRequest request, Pageable pageable);
}
