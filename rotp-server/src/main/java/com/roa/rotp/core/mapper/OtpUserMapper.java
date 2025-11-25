package com.roa.rotp.core.mapper;

import com.roa.rotp.admin.dto.UpdateOtpUserInfoRequest;
import com.roa.rotp.core.dto.OtpSetupRequest;
import com.roa.rotp.core.dto.OtpSetupResponse;
import com.roa.rotp.core.entity.OtpUser;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface OtpUserMapper {

    @Mapping(target = "encSecretBase64", source = "secretBase32")
    @Mapping(target = "disabled", constant = "false")
    OtpUser toEntity(OtpSetupRequest req);

    @Mapping(target = "secretBase32", source = "encSecretBase64")
    @Mapping(target = "otpauthUri", ignore = true)
    @Mapping(target = "qrPngBase64", ignore = true)
    OtpSetupResponse fromEntity(OtpUser entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateToEntity(UpdateOtpUserInfoRequest dto, @MappingTarget OtpUser entity);
}
