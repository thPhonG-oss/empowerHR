package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.request.ConfimAccountRequest;
import com.hr_management.hr_management.dto.response.ChangePasswordResponse;
import com.hr_management.hr_management.dto.response.ConfirmAccountResponse;
import com.hr_management.hr_management.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper
public interface AccountMapper {
    @Mapping(source = "password",target = "newPassword")
    @Mapping(source = "username",target = "useName")
    ChangePasswordResponse toChangePasswordResponse(Account account);
}
