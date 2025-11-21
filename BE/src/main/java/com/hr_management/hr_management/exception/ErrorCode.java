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
    NOT_ENOUGHT_CHARACTER_PASSWORD("1002","Your password is less than {min} characters. Your password must be longer than {min} characters.", HttpStatus.BAD_REQUEST),
    NOT_ENOUGHT_CHARACTER_USERNAME("1007","Your username is less than {min} characters. Your username must be longer than {min} characters.", HttpStatus.BAD_REQUEST),
    USER_NOT_EXITS("1003","user not exist", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED ("1004","UNAUTHENTICATED", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED("1005", "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_KEY("1006", "Uncategorized error", HttpStatus.BAD_REQUEST),
    NOT_ENOUGHT_YEAR_OLD ("1008","you are under {min} year old",HttpStatus.BAD_REQUEST),
    ACCOUNT_EXISTED("1009", "Account existed", HttpStatus.BAD_REQUEST),
    ACCOUNT_NOT_EXITS("1003","user not exist", HttpStatus.BAD_REQUEST),
    JOB_POSITION_NOT_FOUND("1010","Job position not found", HttpStatus.BAD_REQUEST),
    EMPLOYEE_NOT_FOUND("1011","Employee not found", HttpStatus.NOT_FOUND),
    DEPARTMENT_NOT_FOUND("1012","Department not found", HttpStatus.NOT_FOUND),
    USERNAME_ALREADY_EXISTS("1013","username already exists", HttpStatus.BAD_REQUEST),
    ROLE_NOT_FOUND("1014","Role not found", HttpStatus.BAD_REQUEST),
    EMPLOYEE_ALREADY_HAS_ACCOUNT("1015","Employee already has account", HttpStatus.BAD_REQUEST),
    EMPLOYEE_ALREADY_EXISTS("1016","Employee already exists", HttpStatus.BAD_REQUEST),
    BANK_ACCOUNT_ALREADY_EXISTS("1017","Bank account already exists", HttpStatus.BAD_REQUEST),
    BANK_ACCOUNT_NOT_FOUND("1018","Bank account not found", HttpStatus.BAD_REQUEST),
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