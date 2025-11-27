package com.hr_management.hr_management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HandledRequestResponseDTO {
    List<RequestResponseDTO> requestResponseDTOS;
    int pageNumber;
    int pageSize;
    int totalPages;
    long totalElements;
    boolean isLastPage;
}
