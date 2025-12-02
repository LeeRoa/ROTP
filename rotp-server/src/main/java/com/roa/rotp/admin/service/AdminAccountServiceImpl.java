package com.roa.rotp.admin.service;

import com.roa.rotp.admin.dto.adminaccount.AdminAccountCreateRequest;
import com.roa.rotp.admin.dto.adminaccount.AdminAccountResponse;
import com.roa.rotp.admin.dto.adminaccount.AdminAccountSearchRequest;
import com.roa.rotp.admin.dto.adminaccount.AdminAccountUpdateRequest;
import com.roa.rotp.admin.entity.AdminAccount;
import com.roa.rotp.admin.mapper.AdminAccountMapper;
import com.roa.rotp.admin.repository.AdminAccountRepository;
import com.roa.rotp.common.exception.AppException;
import com.roa.rotp.common.model.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminAccountServiceImpl implements AdminAccountService {

    private final AdminAccountMapper mapper;
    private final AdminAccountRepository repo;

    @Override
    @Transactional
    public void updateAdminAccount(AdminAccountUpdateRequest request) {
        AdminAccount adminAccount = repo.findById(request.id())
                .orElseThrow(() -> AppException.fmt(ErrorCode.USER_NOT_FOUND, "Admin account not found: %d", request.id()));

        mapper.updateToEntity(request, adminAccount);

        repo.save(adminAccount);
    }

    @Override
    public AdminAccountResponse getAdminAccount(Long id) {
        return mapper.fromEntity(
                repo.findById(id).orElseThrow(() -> AppException.fmt(ErrorCode.USER_NOT_FOUND, "Admin account not found: %d", id))
        );
    }

    @Override
    public void deleteAdminAccount(Long id) {
        repo.deleteById(id);
    }

    @Override
    public void createAdminAccount(AdminAccountCreateRequest request) {
        repo.save(mapper.toEntity(request));
    }

    @Override
    public Page<AdminAccountResponse> searchAdminAccounts(AdminAccountSearchRequest request, Pageable pageable) {
        return repo.search(request, pageable)
                .map(mapper::fromEntity);
    }
}
