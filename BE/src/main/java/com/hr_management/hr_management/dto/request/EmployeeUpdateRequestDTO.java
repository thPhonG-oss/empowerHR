package com.hr_management.hr_management.dto.request;

import com.hr_management.hr_management.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeUpdateRequestDTO {
    @NotBlank(message = "Tên nhân viên không được để trống")
    private String employeeName;
    @NotBlank(message = "Số căn cước không được để trống")
    private String identityCard;
    @NotBlank
    private String address;
    private LocalDate dateOfBirth;
    private Gender gender;
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Số điện thoại không được trống")
    private String phoneNumber;

    private Boolean isActive;

    @NotBlank(message = "Mã số thuế không được để trống")
    private String taxCode;

    @NotNull(message = "Mã vị trí không được null")
    private Integer positionId;

    @NotNull(message = "Mã phòng ban không được null")
    private Integer departmentId;

    @NotBlank(message = "Tên ngân hàng không được để trống")
    private String bankName;

    private String bankBranch;

    @NotBlank(message = "Tên chi nhánh không được để trống")
    private String bankAccountNumber;

    private Set<String> roles = new HashSet<>();
}
