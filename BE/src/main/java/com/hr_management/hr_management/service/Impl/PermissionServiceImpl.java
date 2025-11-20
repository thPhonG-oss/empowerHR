package com.hr_management.hr_management.service.Impl;


import com.hr_management.hr_management.dto.request.PermissionRequest;
import com.hr_management.hr_management.dto.response.PermissionResponse;
import com.hr_management.hr_management.entity.Permission;
import com.hr_management.hr_management.mapper.PermissionMapper;
import com.hr_management.hr_management.repository.PermissionRepository;
import com.hr_management.hr_management.service.PermissionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class PermissionServiceImpl  implements PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;
    @Override
    public List<PermissionResponse> getAll() {
        return permissionRepository.findAll().stream().map(permissionMapper::toPermissionResponse).toList();
    }

    @Override
    public PermissionResponse create(PermissionRequest request) {
        Permission permission=permissionMapper.toPermission(request);

        return permissionMapper.toPermissionResponse(permissionRepository.save(permission));
    }

    @Override
    public void deletePermission(String permission) {
        permissionRepository.deleteById(permission);

    }
}
