package com.roa.rotp.admin.service;

import com.roa.rotp.admin.dto.AuditLogSearchRequest;
import com.roa.rotp.common.entity.AuditLog;
import com.roa.rotp.common.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository repo;

    @Override
    public Page<AuditLog> searchAudits(AuditLogSearchRequest request, Pageable pageable) {
        return repo.search(request, pageable);
    }
}
