package com.roa.rotp.core.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "otp")
public class OtpProperties {
    private String issuer;
    private int digits;
    private int period;
    private String algorithm;
    private Qr qr = new Qr();

    @Setter
    @Getter
    public static class Qr {
        private int size;
    }
}
