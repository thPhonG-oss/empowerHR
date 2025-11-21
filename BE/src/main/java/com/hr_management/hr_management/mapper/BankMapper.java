package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.response.BankResponseDTO;
import com.hr_management.hr_management.entity.Bank;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BankMapper {
    BankResponseDTO ToBankResponseDTO(Bank bank);
}
