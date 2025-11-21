package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.request.RoleRequest;
import com.hr_management.hr_management.dto.response.RoleResponse;
import com.hr_management.hr_management.mapper.RoleMapper;
import com.hr_management.hr_management.repository.PermissionRepository;
import com.hr_management.hr_management.repository.RoleRepository;
import com.hr_management.hr_management.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class RoleServiceImpl implements RoleService {
    RoleRepository roleRepository;
    RoleMapper roleMapper;
    PermissionRepository permissionRepository;

    @Override
    public List<RoleResponse> getAll() {
        return roleRepository.findAll().stream().map(roleMapper::toRoleResponse).toList();
    }

    @Override
    public RoleResponse create(RoleRequest request) {
        var role = roleMapper.toRole(request);

        var permissions = permissionRepository.findAllById(request.getPermissions());
        role.setPermissions(new HashSet<>(permissions));

        role = roleRepository.save(role);
        return roleMapper.toRoleResponse(role);
    }

    @Override
    public void delete(String role) {
        roleRepository.deleteById(Integer.valueOf(role));
    }
}
