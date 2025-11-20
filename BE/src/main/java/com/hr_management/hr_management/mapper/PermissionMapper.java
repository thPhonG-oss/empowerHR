package com.hr_management.hr_management.mapper;


import com.hr_management.hr_management.dto.request.PermissionRequest;
import com.hr_management.hr_management.dto.response.PermissionResponse;
import com.hr_management.hr_management.entity.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission (PermissionRequest request);
    PermissionResponse toPermissionResponse(Permission permission);

}
