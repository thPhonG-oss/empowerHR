package com.hr_management.hr_management.mapper;


import com.hr_management.hr_management.dto.response.TransactionResponse;
import com.hr_management.hr_management.entity.Transaction;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    TransactionResponse toTransactionResponse (Transaction transaction);
}
