package com.roa.rotp.common.repository;

import com.roa.rotp.admin.dto.AuditLogSearchRequest;
import com.roa.rotp.common.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomAuditLogRepository {
    Page<AuditLog> search(AuditLogSearchRequest request, Pageable pageable);
}