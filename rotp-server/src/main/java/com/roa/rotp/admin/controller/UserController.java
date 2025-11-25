package com.roa.rotp.admin.controller;

import com.roa.rotp.admin.dto.OtpBypassRequest;
import com.roa.rotp.admin.dto.OtpBypassResponse;
import com.roa.rotp.admin.dto.OtpUserSearchRequest;
import com.roa.rotp.admin.service.AdminService;
import com.roa.rotp.core.dto.OtpSetupResponse;
import com.roa.rotp.core.entity.OtpUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/user")
public class UserController {
    private final AdminService adminService;

    /**
     * OTP 사용자 검색
     * @param request 검색 요청 정보
     * @param pageable 페이지 정보
     * @return 검색 결과 페이지
     */
    @PostMapping("/search")
    public Page<OtpUser> searchOtpUsers(
            @RequestBody OtpUserSearchRequest request,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        return adminService.searchOtpUsers(request, pageable);
    }

    /**
     * bypass 부여
     * @param request 요청 정보 (userId, until, adminId)
     * @return 부여 결과
     */
    @PostMapping("/bypass")
    public OtpBypassResponse grantBypass(@RequestBody OtpBypassRequest request) {
        return adminService.grantBypass(request.userId(), request.until(), request.adminId());
    }

    /**
     * bypass 회수
     * @param request 요청 정보 (userId, adminId)
     * @return 회수 결과
     */
    @DeleteMapping("/bypass")
    public OtpBypassResponse revokeBypass(@RequestBody OtpBypassRequest request) {
        return adminService.revokeBypass(request.userId(), request.adminId());
    }

    /**
     * OTP 리셋
     * @param request 요청 정보 (userId, adminId)
     * @return OTP 리셋 결과 (새로운 QR 코드 등)
     */
    @PostMapping("/reset")
    public OtpSetupResponse resetOtp(@RequestBody OtpBypassRequest request) {
        return adminService.resetOtp(request.userId(), request.adminId());
    }
}