package com.roa.rotp.core.repository;

import com.roa.rotp.core.entity.UserOtpSecret;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserOtpSecretRepository extends JpaRepository<UserOtpSecret, String> {
}