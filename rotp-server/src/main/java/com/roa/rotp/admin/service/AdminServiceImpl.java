package com.roa.rotp.admin.service;

import com.roa.rotp.admin.dto.OtpUserSearchRequest;
import com.roa.rotp.core.entity.OtpUser;
import com.roa.rotp.core.repository.OtpUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
