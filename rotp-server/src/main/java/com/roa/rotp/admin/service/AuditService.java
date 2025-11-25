package com.roa.rotp.admin.service;

import com.roa.rotp.admin.dto.AuditLogSearchRequest;
import com.roa.rotp.common.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuditService {

    Page<AuditLog> searchAudits(AuditLogSearchRequest request, Pageable pageable);
}
