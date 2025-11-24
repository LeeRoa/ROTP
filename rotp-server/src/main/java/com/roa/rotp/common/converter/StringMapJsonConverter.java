package com.roa.rotp.common.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.roa.rotp.common.model.ErrorCode;
import com.roa.rotp.common.exception.AppException;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Map;

@Converter
public class StringMapJsonConverter implements AttributeConverter<Map<String, String>, String> {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final TypeReference<Map<String, String>> TYPE = new TypeReference<>() {};

    @Override
    public String convertToDatabaseColumn(Map<String, String> attribute) {
        if (attribute == null) return null;
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (Exception e) {
            // 에러 코드 고정 메시지 사용 상세 context 포함해서:
             throw AppException.fmt(ErrorCode.JSON_WRITE_FAILED, "extra 필드 직렬화 실패: %s", e.getMessage());
        }
    }

    @Override
    public Map<String, String> convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        try {
            return objectMapper.readValue(dbData, TYPE);
        } catch (Exception e) {
            throw new AppException(ErrorCode.JSON_READ_FAILED);
        }
    }
}