package com.hr_management.hr_management.dto.response;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder // Dùng SuperBuilder để các con kế thừa được
@NoArgsConstructor
@AllArgsConstructor
public class RequestResponseDTO {
    @Schema(description = "ID của yêu cầu", example = "152")
    private Integer requestId;
    @Schema(description = "Trạng thái", example = "PENDING")
    private String status;
    @Schema(description = "Loại yêu cầu", example = "LEAVEREQUEST")
    private String requestType; // "Leave" hoặc "TimesheetUpdate"
    @Schema(description = "Lý do xin nghỉ", example = "Em bị đau bụng xin nghỉ 1 ngày")
    private String reason;
    @Schema(description = "Tên nhân viên", example = "Nguyễn Văn A")
    private String employeeName;
    @Schema(description = "Mã nhân viên", example = "NV001")
    private String employeeCode;

    private String handleAt;
    @Schema(description = "Ngày gửi", example = "2025-12-07T08:30:00")
    private String submitAt;
    private String responseReason;
}
