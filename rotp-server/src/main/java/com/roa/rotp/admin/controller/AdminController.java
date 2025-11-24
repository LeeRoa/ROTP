package com.roa.rotp.admin.controller;

import com.roa.rotp.admin.dto.OtpUserSearchRequest;
import com.roa.rotp.admin.service.AdminService;
import com.roa.rotp.core.entity.OtpUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;

    // OTP 사용자 검색 (페이징)
    @PostMapping("/search")
    public ResponseEntity<Page<OtpUser>> searchOtpUsers(
            @RequestBody OtpUserSearchRequest request,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<OtpUser> result = adminService.searchOtpUsers(request, pageable);
        return ResponseEntity.ok(result);
    }
}
