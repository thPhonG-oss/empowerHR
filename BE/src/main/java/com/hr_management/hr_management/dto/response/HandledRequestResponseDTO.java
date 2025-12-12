package com.hr_management.hr_management.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HandledRequestResponseDTO {
    @Schema(description = "Danh sách các yêu cầu chi tiết")
    List<RequestResponseDTO> requestResponseDTOS = new ArrayList<>();

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
