package com.roa.rotp.admin.dto.adminaccount;

import com.roa.rotp.admin.model.Role;

public record AdminAccountCreateRequest(
        String username,     // 필수
        String nickname,     // 필수
        String password,     // 필수 (암호화는 서비스에서)
        Role role,           // 필수

        String email,        // 선택
        String callNumber,   // 선택
        Boolean enabled      // 선택(필요 시), or 제거
) {
}