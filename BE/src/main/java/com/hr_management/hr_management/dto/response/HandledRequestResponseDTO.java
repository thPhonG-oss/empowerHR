package com.hr_management.hr_management.dto.response;

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
    List<RequestResponseDTO> requestResponseDTOS = new ArrayList<>();
    int pageNumber;
    int pageSize;
    int totalPages;
    long totalElements;
    boolean isLastPage;
}
