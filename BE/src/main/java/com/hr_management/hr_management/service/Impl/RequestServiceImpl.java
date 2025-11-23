package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.request.RequestResponseDTO;
import com.hr_management.hr_management.entity.Request;
import com.hr_management.hr_management.mapper.RequestMapper;
import com.hr_management.hr_management.repository.RequestRepository;
import com.hr_management.hr_management.service.RequestService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
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
    public RequestResponseDTO getRequestById(Integer id) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request Not Founb"));

        return requestMapper.toResponseDTO(request);
    }
}
