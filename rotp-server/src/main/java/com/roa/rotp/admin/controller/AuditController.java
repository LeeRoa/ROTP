package com.roa.rotp.admin.controller;

import com.roa.rotp.admin.dto.AuditLogSearchRequest;
import com.roa.rotp.admin.service.AuditService;
import com.roa.rotp.common.entity.AuditLog;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/audit")
public class AuditController {

    private final AuditService auditService;

    @PostMapping("/search")
    public Page<AuditLog> searchAudits(
            @RequestBody AuditLogSearchRequest request,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        return auditService.searchAudits(request, pageable);
    }

    /**
     * 특정 감사 정보 조회
     * @param id 감사 ID
     * @return 감사 정보
     */
    @GetMapping("/{id}")
    public AuditLog getAudit(@PathVariable Long id) {
        return auditService.getAudit(id);
    }

    @DeleteMapping("/{id}")
    public void deleteAudit(@PathVariable Long id) {
        auditService.deleteAudit(id);
    }
}
