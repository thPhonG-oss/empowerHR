package com.hr_management.hr_management.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public class ApiResponse<T> {
     // update: add swagger documentation
     @Schema(description = "Mã trạng thái nghiệp vụ", example = "1000")
     @Builder.Default
     String code="1000";
     @Schema(description = "Thông báo chi tiết", example = "Xử lý thành công")
     String message=null;
     T result;
}

