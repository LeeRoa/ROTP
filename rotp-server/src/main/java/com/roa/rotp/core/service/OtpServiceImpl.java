package com.roa.rotp.core.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.roa.rotp.common.exception.AppException;
import com.roa.rotp.common.model.ErrorCode;
import com.roa.rotp.core.config.OtpProperties;
import com.roa.rotp.core.domain.OtpAlgorithm;
import com.roa.rotp.core.domain.OtpVerifyMessage;
import com.roa.rotp.core.dto.OtpSetupRequest;
import com.roa.rotp.core.dto.OtpSetupResponse;
import com.roa.rotp.core.dto.OtpVerifyRequest;
import com.roa.rotp.core.dto.OtpVerifyResponse;
import com.roa.rotp.core.entity.UserOtpSecret;
import com.roa.rotp.core.mapper.UserOtpSecretMapper;
import com.roa.rotp.core.repository.UserOtpSecretRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.binary.Base32;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.SecureRandom;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final UserOtpSecretRepository repo;
    private final UserOtpSecretMapper mapper;
    private final OtpProperties props;

    @Override
    @Transactional
    public OtpSetupResponse setupSecret(String userId) {
        // 서버에서 시크릿 생성
        String secretBase32 = generateSecret();

        // 엔티티 생성 및 저장
        OtpSetupRequest req = new OtpSetupRequest(userId, secretBase32, OtpAlgorithm.SHA1, 6, 30);
        UserOtpSecret entity = mapper.toEntity(req);
        repo.save(entity);

        // otpauth URI + QR코드 생성
        String uri = buildOtpAuthUri(userId, secretBase32);

        String qrBase64;
        try {
            qrBase64 = generateQrCodeBase64(uri);
        } catch (WriterException | IOException e) {
            throw new AppException(ErrorCode.INTERNAL_ERROR, "QR 코드 생성 실패: " + e.getMessage());
        }

        // 응답 DTO 반환
        return new OtpSetupResponse(userId, secretBase32, uri, qrBase64);
    }

    @Override
    public OtpVerifyResponse verifyOtp(OtpVerifyRequest request) {
        UserOtpSecret entity = repo.findById(request.userId()).orElseThrow();

        byte[] secretBytes = new org.apache.commons.codec.binary.Base32()
                .decode(entity.getEncSecretBase64());

        boolean ok;
        try {
            ok = TotpEngine.verify(
                    secretBytes,
                    request.code(),
                    entity.getAlgorithm(),
                    entity.getDigits(),
                    entity.getPeriod(),
                    3, // 허용 윈도우
                    entity.getLastAcceptedCounter()
            );
        } catch (Exception e) {
            throw new AppException(ErrorCode.INTERNAL_ERROR, "OTP 검증 실패: " + e.getMessage());
        }

        if (ok) {
            long now = System.currentTimeMillis() / 1000L;
            long counter = TotpEngine.timeCounter(now, entity.getPeriod(), 0);
            entity.setLastAcceptedCounter(counter);
            repo.save(entity);
        }

        return new OtpVerifyResponse(ok, ok ?
                OtpVerifyMessage.SUCCESS.getMessage() : OtpVerifyMessage.FAILURE.getMessage());
    }

    // 시크릿 생성
    private String generateSecret() {
        byte[] bytes = new byte[20];
        new SecureRandom().nextBytes(bytes);
        Base32 base32 = new Base32();
        return base32.encodeToString(bytes).replace("=", "");
    }

    // otpauth URI 생성
    private String buildOtpAuthUri(String account, String secret) {
        return String.format("otpauth://totp/%s:%s?secret=%s&issuer=%s&algorithm=%s&digits=%d&period=%d",
                props.getIssuer(),
                account,
                secret,
                props.getIssuer(),
                props.getAlgorithm(),
                props.getDigits(),
                props.getPeriod());
    }

    // QR코드 Base64 PNG 생성
    private String generateQrCodeBase64(String content) throws WriterException, IOException {
        int size = props.getQr().getSize();
        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix matrix = writer.encode(content, BarcodeFormat.QR_CODE, size, size);
        BufferedImage image = new BufferedImage(size, size, BufferedImage.TYPE_INT_RGB);

        for (int x = 0; x < size; x++) {
            for (int y = 0; y < size; y++) {
                image.setRGB(x, y, matrix.get(x, y) ? 0x000000 : 0xFFFFFF);
            }
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "PNG", baos);
        return Base64.getEncoder().encodeToString(baos.toByteArray());
    }
}