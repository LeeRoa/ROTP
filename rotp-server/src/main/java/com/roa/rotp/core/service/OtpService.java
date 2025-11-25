package com.roa.rotp.core.service;

import com.roa.rotp.core.dto.OtpSetupResponse;
import com.roa.rotp.core.dto.OtpVerifyResponse;

public interface OtpService {
    OtpSetupResponse setupOtp(String userId);

    OtpVerifyResponse verifyOtp(String userId, String code);
}
