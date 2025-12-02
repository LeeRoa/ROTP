package com.roa.rotp.admin.controller;

import com.roa.rotp.admin.service.AdminAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/account")
public class AdminAccountController {
    private final AdminAccountService adminAccountService;

    // TODO Admin 계정 수정

    // TODO Admin 계정 조회

    // TODO Admin 계정 삭제

    // TODO Admin 계정 생성

    // TODO Admin 계정 검색
}
