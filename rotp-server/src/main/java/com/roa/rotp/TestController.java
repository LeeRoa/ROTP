package com.roa.rotp;

import com.roa.rotp.admin.dto.adminaccount.AdminAccountResponse;
import com.roa.rotp.admin.dto.adminaccount.AdminAccountSearchRequest;
import com.roa.rotp.admin.dto.audit.AuditLogSearchRequest;
import com.roa.rotp.admin.service.AdminAccountService;
import com.roa.rotp.admin.service.AuditService;
import com.roa.rotp.common.entity.AuditLog;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
public class TestController {
    private final AdminAccountService adminAccountService;

    @PostMapping("/search")
    public Page<AdminAccountResponse> searchAdminAccounts(@RequestBody AdminAccountSearchRequest request, Pageable pageable) {
        return adminAccountService.searchAdminAccounts(request, pageable);
    }
}
