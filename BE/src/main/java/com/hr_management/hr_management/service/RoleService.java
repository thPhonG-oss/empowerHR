package com.hr_management.hr_management.service;

import com.devteria.identity_service.dto.request.RoleRequest;
import com.devteria.identity_service.dto.response.RoleResponse;

import java.util.List;

public interface RoleService {
    RoleResponse create(RoleRequest request);
    void delete(String role);
    List<RoleResponse>getAll();

}
