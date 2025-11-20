package com.hr_management.hr_management.service;

import com.devteria.identity_service.dto.request.UserUpdateRequest;
import com.devteria.identity_service.dto.response.UserResponse;
import com.devteria.identity_service.entity.User;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUser();
    UserResponse getFindOneUser(Long id);
    User setUser(User user);
    void deleteUser(Long id);
    UserResponse getMyInfo();
    UserResponse updateUser(UserUpdateRequest request,Long id);
}
