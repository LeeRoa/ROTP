package com.roa.rotp.core.repository;

import com.roa.rotp.core.entity.OtpUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OtpUserRepository extends JpaRepository<OtpUser, String>, CustomUserOtpSecretRepository {
}