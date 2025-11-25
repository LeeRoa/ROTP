package com.roa.rotp.admin.service;

import com.roa.rotp.admin.entity.Admin;
import com.roa.rotp.admin.repository.AdminRepository;
import com.roa.rotp.common.exception.AppException;
import com.roa.rotp.common.model.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {

    private final AdminRepository repo;

    @Override
    public void registerAdmin(Admin admin) {
        if (repo.existsByUsername(admin.getUsername())) {
            throw new AppException(ErrorCode.DUPLICATE_USERNAME, "Admin with username " + admin.getUsername() + " already exists.");
        }

        repo.save(admin);
    }
}
