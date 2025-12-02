package com.roa.rotp.admin.service;

import com.roa.rotp.admin.dto.adminaccount.AdminAccountCreateRequest;
import com.roa.rotp.admin.dto.adminaccount.AdminAccountResponse;
import com.roa.rotp.admin.dto.adminaccount.AdminAccountSearchRequest;
import com.roa.rotp.admin.dto.adminaccount.AdminAccountUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminAccountServiceImpl implements AdminAccountService {

    @Override
    public void updateAdminAccount(AdminAccountUpdateRequest request) {

    }

    @Override
    public AdminAccountResponse getAdminAccount(Long id) {
        return null;
    }

    @Override
    public void deleteAdminAccount(Long id) {

    }

    @Override
    public void createAdminAccount(AdminAccountCreateRequest request) {

    }

    @Override
    public Page<AdminAccountResponse> searchAdminAccounts(AdminAccountSearchRequest request, Pageable pageable) {
        return null;
    }
}
