package com.roa.rotp.common.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class MaskingUtil {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    // 마스킹할 필드 목록
    private static final String[] SENSITIVE_FIELDS = {"password", "otp", "ssn"};

    public static String maskSensitiveFields(String jsonPayload) {
        try {
            JsonNode root = objectMapper.readTree(jsonPayload);

            for (String field : SENSITIVE_FIELDS) {
                if (root.has(field)) {
                    ((com.fasterxml.jackson.databind.node.ObjectNode) root)
                            .put(field, "****"); // 마스킹 처리
                }
            }

            return objectMapper.writeValueAsString(root);
        } catch (Exception e) {
            // JSON 파싱 실패 시 그냥 원본 반환
            return jsonPayload;
        }
    }
}
