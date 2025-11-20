package com.hr_management.hr_management.service.Impl;

import com.devteria.identity_service.dto.request.UserUpdateRequest;
import com.devteria.identity_service.dto.response.UserResponse;
import com.devteria.identity_service.entity.Role;
import com.devteria.identity_service.entity.User;
import com.devteria.identity_service.enums.Roles;
import com.devteria.identity_service.exception.AppException;
import com.devteria.identity_service.exception.ErrorCode;
import com.devteria.identity_service.mapper.UserMapper;
import com.devteria.identity_service.repository.RoleRepository;
import com.devteria.identity_service.repository.UserRepository;
import com.devteria.identity_service.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUser() {
        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }
    @Override
    public User setUser(User user) {
        if(userRepository.existsByUsername(user.getUsername()))
            throw new AppException(ErrorCode.USER_EXISTED);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        HashSet<Role> roles=new HashSet<>();
        roleRepository.findById(Roles.USER.toString()).ifPresent(roles::add);
        user.setRoles(roles);
        return userRepository.save(user);
    }

    @Override
    public UserResponse updateUser(UserUpdateRequest request,Long id) {
        User user=userRepository.findById(id).orElseThrow(()->new AppException(ErrorCode.USER_EXISTED));
        userMapper.updateUser(user,request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        var roles=roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getFindOneUser(Long id) {
        return userMapper.toUserResponse(
                userRepository.findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXITS)));
    }

    @Override
    public UserResponse getMyInfo() {
        var context= SecurityContextHolder.getContext();
        String name=context.getAuthentication().getName();
        User user= userRepository.findByUsername(name).orElseThrow(()->new AppException(ErrorCode.USER_NOT_EXITS));
        return userMapper.toUserResponse(user);
    }
}
