package com.roa.rotp.core.service;

import com.roa.rotp.core.dto.OtpSetupResponse;
import com.roa.rotp.core.dto.OtpVerifyRequest;
import com.roa.rotp.core.dto.OtpVerifyResponse;

public interface OtpService {
    OtpSetupResponse setupSecret(String userId);

    OtpVerifyResponse verifyOtp(OtpVerifyRequest request);
}
