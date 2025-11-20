package com.hr_management.hr_management.exception;

import com.hr_management.hr_management.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@Controller
public class GlobalExceptionHandler {
    @ExceptionHandler(value = {AppException.class})
    public ResponseEntity<ApiResponse> handleAppException(AppException e) {

        ApiResponse<Object> apiResponse = ApiResponse.builder()
                .status(e.getErrorCode().getCode())
                .message(e.getErrorCode().getMessage())
                .build();

        return ResponseEntity.status(e.getErrorCode().getHttpStatusCode()).body(apiResponse);
    }
}
