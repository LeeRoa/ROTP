package com.roa.rotp.admin.service;

import com.roa.rotp.admin.entity.Admin;

public interface LoginService {

    /**
     * 관리자 계정 등록
     * @param admin 관리자 정보 (username, password 등)
     */
    void registerAdmin(Admin admin);
}