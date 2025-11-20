package com.hr_management.hr_management.service;


import com.hr_management.hr_management.dto.request.RoleRequest;
import com.hr_management.hr_management.dto.response.RoleResponse;

import java.util.List;

public interface RoleService {
    RoleResponse create(RoleRequest request);
    void delete(String role);
    List<RoleResponse>getAll();

}
