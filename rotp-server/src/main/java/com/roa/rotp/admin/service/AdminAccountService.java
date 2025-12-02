package com.roa.rotp.admin.service;

import com.roa.rotp.admin.dto.adminaccount.AdminAccountCreateRequest;
import com.roa.rotp.admin.dto.adminaccount.AdminAccountResponse;
import com.roa.rotp.admin.dto.adminaccount.AdminAccountSearchRequest;
import com.roa.rotp.admin.dto.adminaccount.AdminAccountUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminAccountService {
    void updateAdminAccount(AdminAccountUpdateRequest request);
    AdminAccountResponse getAdminAccount(Long id);
    void deleteAdminAccount(Long id);
    void createAdminAccount(AdminAccountCreateRequest request);

    Page<AdminAccountResponse> searchAdminAccounts(AdminAccountSearchRequest request, Pageable pageable);
}
