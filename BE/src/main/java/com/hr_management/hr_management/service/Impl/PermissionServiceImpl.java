package com.hr_management.hr_management.service.Impl;

import com.devteria.identity_service.dto.request.PermissionRequest;
import com.devteria.identity_service.dto.response.PermissionResponse;
import com.devteria.identity_service.entity.Permission;
import com.devteria.identity_service.mapper.PermissionMapper;
import com.devteria.identity_service.repository.PermissionRepository;
import com.devteria.identity_service.service.PermissionService;
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
