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
     */
    @PostMapping("/setup")
    public OtpSetupResponse setup(@RequestBody OtpSetupRequest request) {
        return otpService.setupSecret(request.userId());
    }

    @PostMapping("/verify")
    public OtpVerifyResponse verify(@RequestBody OtpVerifyRequest request) throws Exception {
        return otpService.verifyOtp(request);
    }
}