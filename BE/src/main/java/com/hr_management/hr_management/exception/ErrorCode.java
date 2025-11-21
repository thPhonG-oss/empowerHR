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
    ACCOUNT_NOT_EXITS("1003","user not exist", HttpStatus.BAD_REQUEST)
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