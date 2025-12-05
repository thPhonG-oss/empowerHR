package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.request.LeaveRequestDto;
import com.hr_management.hr_management.dto.request.TimeSheetRequestDto;
import com.hr_management.hr_management.dto.response.LeaveRequestResponse;
import com.hr_management.hr_management.dto.response.TimeSheetResponse;
import com.hr_management.hr_management.entity.*;
import com.hr_management.hr_management.enums.RequestStatus;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.LeaveRequestMapper;
import com.hr_management.hr_management.mapper.TimeSheetUpdateMapper;
import com.hr_management.hr_management.repository.AttendanceRepository;
import com.hr_management.hr_management.repository.EmployeeRepository;
import com.hr_management.hr_management.repository.LeaveTypeRepository;
import com.hr_management.hr_management.dto.response.HandledRequestResponseDTO;
import com.hr_management.hr_management.dto.response.RequestResponseDTO;
import com.hr_management.hr_management.entity.*;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.RequestMapper;
import com.hr_management.hr_management.repository.AccountRepository;
import com.hr_management.hr_management.repository.DepartmentRepository;
import com.hr_management.hr_management.repository.EmployeeRepository;
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
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

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

    EmployeeRepository employeeRepository;
    RequestRepository requestRepository;
    LeaveTypeRepository leaveTypeRepository;
    LeaveRequestMapper leaveRequestMapper;
    TimeSheetUpdateMapper timeSheetUpdateMapper;
    AttendanceRepository attendanceRepository;
    RequestMapper requestMapper;
    AccountRepository accountRepository;
    DepartmentRepository departmentRepository;

    @Override
    public LeaveRequestResponse createLeaveRequest(LeaveRequestDto leaveRequestDto, JwtAuthenticationToken jwtAuthenticationToken) {
        if(!(leaveRequestDto.getRequest_type().equals("LeaveRequest")))
            throw  new AppException(ErrorCode.INCORRECT_REQUEST_TYPE);
        if(!(leaveTypeRepository.findById(leaveRequestDto.getLeaveTypeId()).get().getTotalDay() >0))
            throw  new AppException(ErrorCode.LEAVE_REQUEST_EXPIRED);
        LeaveRequest newLeaveRequest=leaveRequestMapper.toLeaveRequest(leaveRequestDto);
        setupBaseRequest(newLeaveRequest,jwtAuthenticationToken);
        newLeaveRequest.setLeaveType(leaveTypeRepository.findById(leaveRequestDto.getLeaveTypeId()).get());
        return leaveRequestMapper.toLeaveRequestResponse(requestRepository.save(newLeaveRequest));
    }

    @Override
    public TimeSheetResponse createTimeSheetRequest(TimeSheetRequestDto timeSheetRequestDto, JwtAuthenticationToken jwtAuthenticationToken) {
        if(!(timeSheetRequestDto.getRequest_type().equals("TimeSheetUpdateRequest")))
            throw  new AppException(ErrorCode.INCORRECT_REQUEST_TYPE);
        if(timeSheetRequestDto.getAttendanceDate()==null || timeSheetRequestDto.getCheckoutTime()==null || timeSheetRequestDto.getCheckinTime()==null)
            throw new AppException(ErrorCode.TIM_NULL_ERROR);
        Integer employeeId=employeeRepository.findByAccount_Username(jwtAuthenticationToken.getName()).get().getEmployeeId();
        if(timeSheetRequestDto.getAttendanceDate().isAfter(LocalDate.now()))
            throw new AppException(ErrorCode.TIME_ERROR);
        Attendance attendance=attendanceRepository.findByEmployee_EmployeeIdAndAttendanceDate(employeeId,timeSheetRequestDto.getAttendanceDate())
                .orElseThrow(()->new AppException(ErrorCode.EMPTY_ATTENDANCE));
        if(timeSheetRequestDto.getAttendanceDate().isEqual(LocalDate.now()))
        {
            if(timeSheetRequestDto.getCheckinTime().isAfter(LocalTime.now())
                    || timeSheetRequestDto.getCheckoutTime().isAfter(LocalTime.now())){
                throw  new AppException(ErrorCode.TIME_ERROR);}
            if(attendance.getCheckinTime()==null||attendance.getCheckoutTime()==null)
                throw new AppException(ErrorCode.TIM_NULL_ERROR);

        }


        TimesheetUpdateRequest newTimeSheetRequest=timeSheetUpdateMapper.toTimeSheetUpdateRequest(timeSheetRequestDto);
        setupBaseRequest(newTimeSheetRequest,jwtAuthenticationToken);
        return timeSheetUpdateMapper.toTimeSheetResponse(requestRepository.save(newTimeSheetRequest));
    }
  
    private <T extends Request>T setupBaseRequest(T requestEntity,JwtAuthenticationToken jwtAuthenticationToken) {
        Employee employeeRequest=employeeRepository.findByAccount_Username(jwtAuthenticationToken.getName()).get();
        requestEntity.setEmployee(employeeRequest);
        requestEntity.setSubmitAt(LocalDateTime.now());
        return requestEntity;
    }

    @Override
    public RequestResponseDTO getRequestById(Integer requestId){
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_FOUND));

        return requestMapper.toResponseDTO(request);
    }

    @Override
    public HandledRequestResponseDTO getMyRequests(Integer userId, Integer pageNumber, Integer pageSize, List<RequestStatus> status) {
        Pageable pageable = PageRequest.of(pageNumber - 1, pageSize, Sort.by(Sort.Direction.DESC, "handleAt"));

        List<RequestStatus> requestStatuses = (status == null || status.isEmpty())
                ? List.of(RequestStatus.Pending, RequestStatus.Approved, RequestStatus.Rejected)
                : status;


        Page<Request> requests = requestRepository.findAllByEmployee_EmployeeIdAndStatusIn(userId, requestStatuses, pageable);
        List<RequestResponseDTO> requestResponseDTOs = requests.getContent().stream()
                .map(requestMapper::toResponseDTO)
                .collect(Collectors.toList());

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

        boolean isManger = false;

        for(Role role : account.getRoles()){
            if(role.getName().equals("MANAGER")){
                isManger = true;
            }
        }

        if(!isManger){
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Department dept = manager.getDepartment();
        log.info("Department: {}", dept.getDepartmentId());
        if(dept == null){
            throw new RuntimeException("Department not found");
        }

        return dept;
    }
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
