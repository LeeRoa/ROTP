package com.roa.rotp.core.controller;

import com.roa.rotp.core.dto.OtpSetupRequest;
import com.roa.rotp.core.dto.OtpSetupResponse;
import com.roa.rotp.core.dto.OtpVerifyRequest;
import com.roa.rotp.core.dto.OtpVerifyResponse;
import com.roa.rotp.core.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/otp")
@RequiredArgsConstructor
public class OtpController {

    private final OtpService otpService;

    /**
     * 사용자별 OTP 시크릿 생성 및 QRCode 반환
     * @param request OTP 설정 요청 (userId)
     * @return OTP 설정 응답 (QR 코드 URL 등)
     */
    @PostMapping("/setup")
    public OtpSetupResponse setup(@RequestBody OtpSetupRequest request) {
        return otpService.setupOtp(request.userId());
    }

    /**
     * OTP 코드 검증
     * @param request OTP 검증 요청 (userId, code)
     * @return OTP 검증 결과
     */
    @PostMapping("/verify")
    public OtpVerifyResponse verify(@RequestBody OtpVerifyRequest request) {
        return otpService.verifyOtp(request.userId(), request.code());
    }
}