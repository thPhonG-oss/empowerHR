package com.hr_management.hr_management.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder // Dùng SuperBuilder để các con kế thừa được
@NoArgsConstructor
@AllArgsConstructor
public class RequestResponseDTO {
    private Integer requestId;
    private String status;
    private String requestType; // "Leave" hoặc "TimesheetUpdate"
    private String reason;
    private String employeeName;
    private String submitAt;
}
