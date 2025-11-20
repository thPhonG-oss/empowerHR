package com.hr_management.hr_management.service;



import com.hr_management.hr_management.dto.request.PermissionRequest;
import com.hr_management.hr_management.dto.response.PermissionResponse;

import java.util.List;

public interface PermissionService {
    PermissionResponse create(PermissionRequest request);
    List<PermissionResponse>getAll();
    void deletePermission(String permission);
}
