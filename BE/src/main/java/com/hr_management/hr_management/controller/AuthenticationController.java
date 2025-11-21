package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.*;
import com.hr_management.hr_management.dto.response.AuthenticationResponse;
import com.hr_management.hr_management.dto.response.ChangePasswordResponse;
import com.hr_management.hr_management.dto.response.ConfirmAccountResponse;
import com.hr_management.hr_management.dto.response.IntrospectResponse;
import com.hr_management.hr_management.service.AccountService;
import com.hr_management.hr_management.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RequestMapping("auth")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;
    AccountService accountService;
    @PostMapping("/log-in")
    ApiResponse<AuthenticationResponse> authenticated (@RequestBody @Valid AuthenticateRequest authenticateRequest, HttpServletResponse response){
        AuthenticationResponse result=authenticationService.authenticate(authenticateRequest,response);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }
    @PostMapping("/log-out")
    ApiResponse<String>logout(HttpServletRequest request,HttpServletResponse response){
        return ApiResponse.<String>builder()
                .result("You have sucessfully logged out")
                .build();
    }
    @PostMapping("/refresh-token")
    ApiResponse<AuthenticationResponse> refreshToken(HttpServletRequest request,HttpServletResponse response) throws ParseException, JOSEException {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.refreshToken(request,response))
                .build();
    }
    @PostMapping("/change-password")
    ApiResponse<ChangePasswordResponse> changePassword (@RequestBody ChangePasswordRequest changePasswordRequest){
        return ApiResponse.<ChangePasswordResponse>builder()
                .result(accountService.changePassword(changePasswordRequest))
                .build();
    }
    @PostMapping("/confirm-account")
    ApiResponse<ConfirmAccountResponse> confirmAccount(@RequestBody ConfimAccountRequest confimAccountRequest){
        return ApiResponse.<ConfirmAccountResponse>builder()
                .result(accountService.confirmAccount(confimAccountRequest))
                .build();
    }
}