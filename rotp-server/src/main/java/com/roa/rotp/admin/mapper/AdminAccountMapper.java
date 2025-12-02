package com.roa.rotp.admin.mapper;

import com.roa.rotp.admin.dto.adminaccount.AdminAccountCreateRequest;
import com.roa.rotp.admin.dto.adminaccount.AdminAccountResponse;
import com.roa.rotp.admin.dto.adminaccount.AdminAccountUpdateRequest;
import com.roa.rotp.admin.entity.AdminAccount;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AdminAccountMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    AdminAccount toEntity(AdminAccountCreateRequest request);

    AdminAccountResponse fromEntity(AdminAccount entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateToEntity(AdminAccountUpdateRequest dto, @MappingTarget AdminAccount entity);
}
