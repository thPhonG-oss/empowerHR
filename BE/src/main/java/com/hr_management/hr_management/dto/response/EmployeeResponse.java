package com.hr_management.hr_management.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.mapstruct.Mapper;

import java.time.LocalDate;

@Data
@Builder
@Mapper
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeResponse {
    private Integer id;//
    private String fullName;//
    private String employeeCode;//
    private String employeeName;
    private String identityCard;
    private LocalDate dateOfBirth;//
    private String gender;
    private String address;//
    private String email;//
    private String phoneNumber;//
    // so tai khoan
    private String bankAccountNumber;
    private String positionName;
}
