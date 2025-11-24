package com.roa.rotp.admin.controller;

import com.roa.rotp.admin.dto.OtpBypassRequest;
import com.roa.rotp.admin.dto.OtpBypassResponse;
import com.roa.rotp.admin.dto.OtpUserSearchRequest;
import com.roa.rotp.admin.service.AdminService;
import com.roa.rotp.core.entity.OtpUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;

    // OTP 사용자 검색 (페이징)
    @PostMapping("/search")
    public Page<OtpUser> searchOtpUsers(
            @RequestBody OtpUserSearchRequest request,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        return adminService.searchOtpUsers(request, pageable);
    }

    // bypass 부여
    @PostMapping("/bypass")
    public OtpBypassResponse grantBypass(@RequestBody OtpBypassRequest request) {
        return adminService.grantBypass(request.userId(), request.until(), request.adminId());
    }

    // bypass 해제
    @DeleteMapping("/bypass")
    public OtpBypassResponse revokeBypass(@RequestBody OtpBypassRequest request) {
        return adminService.revokeBypass(request.userId(), request.adminId());
    }
}
