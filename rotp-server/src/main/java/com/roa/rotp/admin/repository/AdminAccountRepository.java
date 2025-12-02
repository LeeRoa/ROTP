package com.roa.rotp.admin.repository;

import com.roa.rotp.admin.entity.AdminAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminAccountRepository extends JpaRepository<AdminAccount, Long>, CustomAdminAccountRepository {
    Optional<AdminAccount> findByUsername(String username);

    boolean existsByUsername(String username);
}