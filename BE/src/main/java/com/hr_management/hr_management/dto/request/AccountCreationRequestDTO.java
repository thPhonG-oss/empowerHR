package com.hr_management.hr_management.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountCreationRequestDTO {
    Integer employeeId;
    Set<String> roles  = new HashSet<>();
}
