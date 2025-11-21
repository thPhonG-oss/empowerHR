package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.response.AccountResponseDTO;
import com.hr_management.hr_management.dto.response.ChangePasswordResponse;
import com.hr_management.hr_management.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring", uses = {RoleMapper.class})
public interface AccountMapper {
    @Mapping(source = "password",target = "newPassword")
    @Mapping(source = "username",target = "useName")
    ChangePasswordResponse toChangePasswordResponse(Account account);
    AccountResponseDTO toAccountResponseDTO(Account account);
}
