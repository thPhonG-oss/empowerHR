package com.hr_management.hr_management.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    USER_EXISTED("1001", "user existed", HttpStatus.BAD_REQUEST),
    NOT_ENOUGHT_CHARACTER_PASSWORD("1002", "Your password is less than {min} characters. Your password must be longer than {min} characters.", HttpStatus.BAD_REQUEST),
    NOT_ENOUGHT_CHARACTER_USERNAME("1007", "Your username is less than {min} characters. Your username must be longer than {min} characters.", HttpStatus.BAD_REQUEST),
    USER_NOT_EXITS("1003", "user not exist", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED("1004", "UNAUTHENTICATED", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED("1005", "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_KEY("1006", "Uncategorized error", HttpStatus.BAD_REQUEST),
    NOT_ENOUGHT_YEAR_OLD("1008", "you are under {min} year old", HttpStatus.BAD_REQUEST),
    ACCOUNT_EXISTED("1009", "Account existed", HttpStatus.BAD_REQUEST),
    ACCOUNT_NOT_EXITS("1003", "user not exist", HttpStatus.BAD_REQUEST),
    JOB_POSITION_NOT_FOUND("1010", "Job position not found", HttpStatus.BAD_REQUEST),
    EMPLOYEE_NOT_FOUND("1011", "Employee not found", HttpStatus.NOT_FOUND),
    DEPARTMENT_NOT_FOUND("1012", "Department not found", HttpStatus.NOT_FOUND),
    USERNAME_ALREADY_EXISTS("1013", "username already exists", HttpStatus.BAD_REQUEST),
    ROLE_NOT_FOUND("1014", "Role not found", HttpStatus.BAD_REQUEST),
    EMPLOYEE_ALREADY_HAS_ACCOUNT("1015", "Employee already has account", HttpStatus.BAD_REQUEST),
    EMPLOYEE_ALREADY_EXISTS("1016", "Employee already exists", HttpStatus.BAD_REQUEST),
    BANK_ACCOUNT_ALREADY_EXISTS("1017", "Bank account already exists", HttpStatus.BAD_REQUEST),
    BANK_ACCOUNT_NOT_FOUND("1018", "Bank account not found", HttpStatus.BAD_REQUEST),
    //    ACCOUNT_NOT_EXITS("1011","user not exist", HttpStatus.BAD_REQUEST),
    NOT_CHANGE_PASSWORD("1012", "Do not change other people's passwords", HttpStatus.BAD_REQUEST),
    NOT_VIEW_OTHER_DEPARTMENT("1013", "Cannot view other department staff list", HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_USED_BY_ANOTHER_PERSON("1014", "Email already used by another person", HttpStatus.BAD_REQUEST),
    INCORRECT_REQUEST_TYPE("1015", "incorrect request type", HttpStatus.BAD_REQUEST),
    LEAVE_REQUEST_EXPIRED("1016", "this type of leave has run out", HttpStatus.BAD_REQUEST),
    TIME_ERROR("1017", " time cannot be later than current time", HttpStatus.BAD_REQUEST),
    TIM_NULL_ERROR("1018", " time cannot NULL", HttpStatus.BAD_REQUEST),
    EMPTY_ATTENDANCE("1019", " Unable to create request for current date", HttpStatus.BAD_REQUEST),
//    ACCOUNT_NOT_EXITS("1011","user not exist", HttpStatus.BAD_REQUEST),
    JOB_POSITION_IS_EMPTY("1015","Job position is empty",HttpStatus.BAD_REQUEST),
    DEPARTMENT_IS_EMPTY("1016","Department is empty",HttpStatus.BAD_REQUEST),
    REQUEST_NOT_FOUND("1017","Request not found",HttpStatus.BAD_REQUEST),
    CHECKIN_ERROR("1018","checked in today",HttpStatus.BAD_REQUEST),
    NOT_CHECKIN("1019","haven't checked in yet",HttpStatus.BAD_REQUEST),
    CHECKOUT_ERROR("1020","checked out today ",HttpStatus.BAD_REQUEST),
    LEAVE_BALANCE_NOT_FOUND("1026","LEAVE_BALANCE_NOT_FOUND",HttpStatus.BAD_REQUEST)
    STRAVA_TOKEN_EXCHANGE_FAILED("1021","Strava token exchange failed",HttpStatus.BAD_REQUEST),
    STRAVA_ALREADY_CONNECTED("1022","Strava already connected",HttpStatus.BAD_REQUEST),
    INVALID_STRAVA_STATE("1023","Invalid Strava state parameter",HttpStatus.BAD_REQUEST),
    STRAVA_TOKEN_REFRESH_FAILED("1024","Strava refresh token failed",HttpStatus.BAD_REQUEST),
    STRAVA_ACCOUNT_ALREADY_CONNECTED("1025","Strava account already connected",HttpStatus.BAD_REQUEST)
    ;
    ErrorCode(String code, String message, HttpStatus httpStatusCode) {
        this.code = code;
        this.message = message;
        this.httpStatusCode= httpStatusCode;
    }

    private final String code;
    private final String message;
    private HttpStatusCode httpStatusCode;
}