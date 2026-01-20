package com.roa.rotp.admin.controller;

import com.roa.rotp.admin.dto.adminaccount.AdminAccountCreateRequest;
import com.roa.rotp.admin.dto.adminaccount.AdminAccountResponse;
import com.roa.rotp.admin.dto.adminaccount.AdminAccountSearchRequest;
import com.roa.rotp.admin.dto.adminaccount.AdminAccountUpdateRequest;
import com.roa.rotp.admin.service.AdminAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/account")
public class AdminAccountController {
    private final AdminAccountService adminAccountService;

    @PutMapping
    public void updateAdminAccount(@RequestBody AdminAccountUpdateRequest request) {
        adminAccountService.updateAdminAccount(request);
    }

    @GetMapping("{id}")
    public AdminAccountResponse getAdminAccount(@PathVariable Long id) {
        return adminAccountService.getAdminAccount(id);
    }

    @DeleteMapping("{id}")
    public void deleteAdminAccount(@PathVariable Long id) {
        adminAccountService.deleteAdminAccount(id);
    }

    @PostMapping
    public void createAdminAccount(@RequestBody AdminAccountCreateRequest request) {
        System.out.println("AdminAccountController.AdminAccountCreateRequest: " + request);
        adminAccountService.createAdminAccount(request);
    }

    @PostMapping("/search")
    public Page<AdminAccountResponse> searchAdminAccounts(@RequestBody AdminAccountSearchRequest request, Pageable pageable) {
        return adminAccountService.searchAdminAccounts(request, pageable);
    }
}
