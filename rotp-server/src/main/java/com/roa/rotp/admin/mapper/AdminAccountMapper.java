package com.roa.rotp.admin.mapper;

import com.roa.rotp.admin.dto.adminaccount.AdminAccountCreateRequest;
import com.roa.rotp.admin.dto.adminaccount.AdminAccountResponse;
import com.roa.rotp.admin.dto.adminaccount.AdminAccountUpdateRequest;
import com.roa.rotp.admin.entity.AdminAccount;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface AdminAccountMapper {

    /**
     * 생성 요청 → 엔티티
     * - id, refreshTokens는 무시 (JPA/Hibernate가 관리)
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "refreshTokens", ignore = true)
    AdminAccount toEntity(AdminAccountCreateRequest request);

    /**
     * 엔티티 → 응답 DTO
     */
    AdminAccountResponse fromEntity(AdminAccount entity);

    /**
     * 수정 요청 → 기존 엔티티에 덮어쓰기 (부분 업데이트)
     * - null 값은 무시 (그 필드는 그대로 유지)
     * - id, username, refreshTokens는 건드리지 않음
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "refreshTokens", ignore = true)
    void updateToEntity(AdminAccountUpdateRequest request, @MappingTarget AdminAccount entity);
}