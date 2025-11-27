package com.hr_management.hr_management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class LeaveRequestResponseDTO extends RequestResponseDTO {
    private LocalDate startDate;
    private LocalDate endDate;
    private String leaveTypeName; // Ví dụ: "Nghỉ ốm"
    private String proofDocument;
}