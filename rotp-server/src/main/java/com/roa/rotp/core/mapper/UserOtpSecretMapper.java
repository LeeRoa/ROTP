package com.roa.rotp.core.mapper;

import com.roa.rotp.core.dto.OtpSetupRequest;
import com.roa.rotp.core.dto.OtpSetupResponse;
import com.roa.rotp.core.entity.UserOtpSecret;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserOtpSecretMapper {

    @Mapping(target = "encSecretBase64", source = "secretBase32")
    @Mapping(target = "disabled", constant = "false")
    UserOtpSecret toEntity(OtpSetupRequest req);

    @Mapping(target = "secretBase32", source = "encSecretBase64")
    @Mapping(target = "otpauthUri", ignore = true)
    @Mapping(target = "qrPngBase64", ignore = true)
    OtpSetupResponse fromEntity(UserOtpSecret entity);
}
