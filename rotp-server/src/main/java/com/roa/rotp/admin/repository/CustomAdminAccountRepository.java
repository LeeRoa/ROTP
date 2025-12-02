package com.roa.rotp.admin.repository;

import com.roa.rotp.admin.dto.adminaccount.AdminAccountSearchRequest;
import com.roa.rotp.admin.entity.AdminAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomAdminAccountRepository {
    Page<AdminAccount> search(AdminAccountSearchRequest request, Pageable pageable);
}
