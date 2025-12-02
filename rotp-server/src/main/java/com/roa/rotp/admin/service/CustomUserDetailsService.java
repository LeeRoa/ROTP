package com.roa.rotp.admin.service;

import com.roa.rotp.admin.entity.AdminAccount;
import com.roa.rotp.admin.repository.AdminAccountRepository;
import com.roa.rotp.common.exception.AppException;
import com.roa.rotp.common.model.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminAccountRepository adminAccountRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AdminAccount adminAccount = adminAccountRepository.findByUsername(username)
                .orElseThrow(() -> AppException.fmt(ErrorCode.AUTH_BAD_CREDENTIALS,"관리자 계정을 찾을 수 없습니다. ID: " + username));

        return org.springframework.security.core.userdetails.User
                .withUsername(adminAccount.getUsername())
                .password(adminAccount.getPassword()) // BCrypt 암호화된 비밀번호
                .roles(adminAccount.getRole().name()) // 관리자 권한만 부여
                .build();
    }
}