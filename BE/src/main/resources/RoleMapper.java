package com.hr_management.hr_management.mapper;


import com.hr_management.hr_management.dto.request.RoleRequest;
import com.hr_management.hr_management.dto.response.RoleResponse;
import com.hr_management.hr_management.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions",ignore = true)
    Role toRole(RoleRequest roleRequest);

    RoleResponse toRoleResponse(Role role);
}
