package com.roa.rotp.core.service;

import com.roa.rotp.core.domain.OtpAlgorithm;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.time.Instant;

public class TotpEngine {
    public static long timeCounter(long unixSeconds, int period, long t0) {
        return (unixSeconds - t0) / period;
    }

    public static int generate(byte[] secret, long counter, OtpAlgorithm algorithm, int digits) throws Exception {
        byte[] msg = new byte[8];
        long c = counter;
        for (int i = 7; i >= 0; i--) {
            msg[i] = (byte) (c & 0xFF);
            c >>= 8;
        }

        Mac mac = Mac.getInstance(algorithm.getHmacName());
        mac.init(new SecretKeySpec(secret, algorithm.getHmacName()));
        byte[] h = mac.doFinal(msg);

        int offset = h[h.length - 1] & 0x0F;
        int bin = ((h[offset] & 0x7F) << 24) |
                ((h[offset + 1] & 0xFF) << 16) |
                ((h[offset + 2] & 0xFF) << 8) |
                (h[offset + 3] & 0xFF);

        return bin % (int) Math.pow(10, digits);
    }

    public static boolean verify(byte[] secret, String code, OtpAlgorithm algorithm, int digits, int period, int window, Long lastAcceptedCounter) throws Exception {
        long now = Instant.now().getEpochSecond();
        long T = timeCounter(now, period, 0);
        int target = Integer.parseInt(code);

        for (int w = -window; w <= window; w++) {
            long c = T + w;
            if (lastAcceptedCounter != null && c == lastAcceptedCounter) continue;
            int candidate = generate(secret, c, algorithm, digits);
            if (candidate == target) return true;
        }
        return false;
    }
}
