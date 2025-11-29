package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.request.RequestHandleDTO;
import com.hr_management.hr_management.dto.response.RequestResponseDTO;
import com.hr_management.hr_management.entity.Request;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.RequestMapper;
import com.hr_management.hr_management.repository.RequestRepository;
import com.hr_management.hr_management.service.RequestService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RequestServiceImpl implements RequestService {
    RequestRepository requestRepository;
    RequestMapper requestMapper;

    @Override
    public RequestResponseDTO handleRequest(RequestHandleDTO requestHandleDTO, Integer requestId){
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_FOUND));

        request.setStatus(requestHandleDTO.getRequestStatus());
        request.setResponseReason(requestHandleDTO.getResponseReason());

        Request updatedRequest = requestRepository.save(request);
        return requestMapper.toResponseDTO(updatedRequest);
    }
}
