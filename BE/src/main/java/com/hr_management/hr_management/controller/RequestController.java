package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.dto.request.RequestHandleDTO;
import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import com.hr_management.hr_management.dto.response.HandledRequestResponseDTO;
import com.hr_management.hr_management.enums.RequestStatus;
import com.hr_management.hr_management.service.EmployeeService;
import com.hr_management.hr_management.service.RequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//update : add swagger documentation
@Tag(name = "Request Management", description = "APIs for managing employee requests")
@RestController
@RequestMapping("/api/v1/requests")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RequestController {
    RequestService requestService;
    EmployeeService employeeService;

    @GetMapping("/{requestId}")
    public ResponseEntity<Object> getRequestById(@PathVariable("requestId") Integer requestId){
        return ResponseEntity.ok(requestService.getRequestById(requestId));
    }
    @GetMapping("/handled")
    public ResponseEntity<Object> getHandledRequests(
            @RequestParam(name = "pageNumber", required = false, defaultValue = "1") Integer pageNumber,
            @RequestParam(name = "pageSize", required = false, defaultValue = "10") Integer pageSize
    ) {
        return ResponseEntity.ok()
                .body(
                        ApiResponse.builder()
                                .code("1000")
                                .message("Success")
                                .result(requestService.getAllHandledRequests(pageNumber, pageSize))
                                .build()
                );
    }
    @PatchMapping("/{requestId}")
    public ResponseEntity<Object> handleRequest(@RequestBody @Valid RequestHandleDTO requestHandleDTO, @PathVariable(name = "requestId") Integer requestId){
        return ResponseEntity.ok()
                .body(
                        ApiResponse.builder()
                                .code("1000")
                                .message("Success")
                                .result(requestService.handleRequest(requestHandleDTO, requestId))
                                .build()
                );
    }

    // [ Employee ]
    // 1. get my request
    @GetMapping("/my-request")
    public ResponseEntity<Object> getMyRequests(
            JwtAuthenticationToken jwtToken,
            @RequestParam(name = "pageNumber", required = false, defaultValue = "1") Integer pageNumber,
            @RequestParam(name = "pageSize", required = false, defaultValue = "10") Integer pageSize,
            @RequestParam(name = "statuses", required = false) List<RequestStatus> status
    ) {
        String username = jwtToken.getName();
        EmployeeResponseDTO profile = employeeService.getEmployeeByUserName(username);

        HandledRequestResponseDTO myRequests = requestService.getMyRequests(
                profile.getEmployeeId(),
                pageNumber,
                pageSize,
                status  // ← Pass statuses
        );

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .code("1000")
                        .message("Success")
                        .result(myRequests)
                        .build()
        );
    }

    // update: add get all unresolved requests of the specific department
    @Operation(
            summary = "API lấy danh sách request đang chờ xử lý của phòng ban",
            description = "Lấy danh sách tất cả các request chưa được xử lý (Pending) thuộc phòng ban của người dùng đăng nhập hiện tại (phải là manager của phòng ban đó). Hỗ trợ phân trang thông qua các tham số pageNumber và pageSize."
    )
    @ApiResponses(
            value = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Lấy dữ liệu thành công"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Department Not Found",content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class) // <--- TRỎ VỀ CLASS ApiResponse GỐC
                    )),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access Denied",content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class) // <--- TRỎ VỀ CLASS ApiResponse GỐC
                    )),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Employee Not Found",content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class) // <--- TRỎ VỀ CLASS ApiResponse GỐC
                    )),
            }
    )
    @GetMapping("/unresolved")
    public ResponseEntity<ApiResponse<HandledRequestResponseDTO>> getAllPendingRequests(
            @RequestParam(name = "pageNumber", required = false, defaultValue = "1") Integer pageNumber,
            @RequestParam(name = "pageSize", required = false, defaultValue = "10") Integer pageSize
    ) {
        return new ResponseEntity<>(
                ApiResponse.<HandledRequestResponseDTO>builder()
                        .code("1000")
                        .message("Lấy dữ liệu thành công")
                        .result(requestService.getAllPendingRequests(pageNumber, pageSize))
                        .build(),
                HttpStatus.OK
        );
        }





}
