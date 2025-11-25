package com.roa.rotp.common.repository;

import com.roa.rotp.common.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long>, CustomAuditLogRepository {
}