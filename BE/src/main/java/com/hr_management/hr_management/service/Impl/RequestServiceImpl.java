package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.RequestResponseDTO;
import com.hr_management.hr_management.dto.response.HandledRequestResponseDTO;
import com.hr_management.hr_management.entity.Request;
import com.hr_management.hr_management.enums.RequestStatus;
import com.hr_management.hr_management.mapper.RequestMapper;
import com.hr_management.hr_management.repository.RequestRepository;
import com.hr_management.hr_management.service.RequestService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RequestServiceImpl implements RequestService {


    private RequestRepository requestRepository;
    private RequestMapper requestMapper;


    @Override
    public List<RequestResponseDTO> getAllRequests(){

        // 1. Lấy list Entity (Hibernate tự join và lấy về đúng kiểu con)
        log.info("Before call getAllRequests");
        List<Request> requests = requestRepository.findAll();
        log.info("After call getAllRequests");
        // 2. Convert sang DTO qua Mapper
        return requests.stream()
                .map(requestMapper::toResponseDTO) // Gọi hàm dispatcher
                .collect(Collectors.toList());
    }
    @Override
    public RequestResponseDTO getRequestById(Integer requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request Not Found"));

        return requestMapper.toResponseDTO(request);
    }

    @Override
    public HandledRequestResponseDTO getAllHandledRequest(int pageSize, int pageNumber){
        // 1. Tạo Pageable (Sắp xếp theo ngày xử lý handleAt giảm dần cho hợp lý)
        Pageable pageable = PageRequest.of(pageNumber-1 , pageSize, Sort.by(Sort.Direction.DESC, "handleAt"));

        // 2. Định nghĩa danh sách trạng thái "Đã xử lý"
        List<RequestStatus> processedStatuses = List.of(RequestStatus.Approved, RequestStatus.Rejected);

        // 3. Gọi Repository
        Page<Request> requestPage = requestRepository.findByStatusIn(processedStatuses, pageable);

        // 4. Convert Entity -> DTO (Logic y hệt như hàm lấy tất cả)
        List<RequestResponseDTO> dtoList = requestPage.getContent().stream()
                .map(requestMapper::toResponseDTO)
                .collect(Collectors.toList());
        return HandledRequestResponseDTO.builder()
                .requestResponseDTOS(dtoList)
                .pageSize(requestPage.getSize())
                .pageNumber(requestPage.getNumber())
                .totalPages(requestPage.getTotalPages())
                .totalElements(requestPage.getTotalElements())
                .isLastPage(requestPage.isLast())
                .build();
    }
}
