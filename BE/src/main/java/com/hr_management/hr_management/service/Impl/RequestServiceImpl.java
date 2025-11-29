package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.HandledRequestResponseDTO;
import com.hr_management.hr_management.dto.response.RequestResponseDTO;
import com.hr_management.hr_management.entity.*;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.RequestMapper;
import com.hr_management.hr_management.repository.AccountRepository;
import com.hr_management.hr_management.repository.DepartmentRepository;
import com.hr_management.hr_management.repository.EmployeeRepository;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RequestServiceImpl implements RequestService {
    RequestRepository requestRepository;
    RequestMapper requestMapper;

    AccountRepository accountRepository;
    EmployeeRepository employeeRepository;
    DepartmentRepository departmentRepository;

    @Override
    public HandledRequestResponseDTO getAllHandledRequests(Integer pageNumber, Integer pageSize){
        Department department = getDepartmentOfManager();

        Pageable pageable = PageRequest.of(pageNumber - 1, pageSize, Sort.by(Sort.Direction.DESC, "handleAt"));

        Page<Request> requests = requestRepository.findAllHandledRequests( department.getDepartmentId(), pageable);

        log.info("Hanled requests count: " + requests.getTotalElements());

        List<RequestResponseDTO> requestResponseDTOs = requests.getContent().stream().map(requestMapper::toResponseDTO).collect(Collectors.toList());

        return HandledRequestResponseDTO.builder()
                .requestResponseDTOS(requestResponseDTOs)
                .pageNumber(pageNumber)
                .pageSize(pageSize)
                .totalPages(requests.getTotalPages())
                .totalElements(requests.getTotalElements())
                .isLastPage(requests.isLast())
                .build();
    }

    @Override
    public Department getDepartmentOfManager(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = null;
        log.info("Instance of authentication: {}", authentication.getClass().toString());

        if(authentication instanceof JwtAuthenticationToken){
            Jwt jwt = (Jwt) authentication.getPrincipal();

            username = jwt.getSubject();
            log.info("Jwt subject: {}", username);
        }

        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Employee manager = employeeRepository.findAllByAccount_AccountId(account.getAccountId());

        if(manager == null){
            throw new RuntimeException("Employee not found");
        }

        String position = manager.getPosition().getPositionName();
        log.info("Employee position: {}", position);

        if(!position.equals("Manager")){
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Department dept = manager.getDepartment();
        log.info("Department: {}", dept.getDepartmentId());
        if(dept == null){
            throw new RuntimeException("Department not found");
        }

        return dept;
    }
}
