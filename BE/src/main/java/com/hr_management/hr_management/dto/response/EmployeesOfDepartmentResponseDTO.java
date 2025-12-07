package com.hr_management.hr_management.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeesOfDepartmentResponseDTO {
    @Schema(description = "Danh sách nhân viên của phòng ban")
    List<AllEmployeeResponse> employeeResponseDTOS = new ArrayList<>();

    @Schema(description = "Số trang hiện tại", defaultValue = "1", example = "1")
    int pageNumber;

    @Schema(description = "Kích thước trang", defaultValue = "10", example = "10")
    int pageSize;

    @Schema(description = "Tổng số trang", defaultValue = "1", example = "1")
    int totalPages;

    @Schema(description = "Tổng số phần tử", defaultValue = "0", example = "0")
    long totalElements;

    @Schema(description = "Trang cuối", defaultValue = "false", example = "false")
    boolean isLastPage;
}
