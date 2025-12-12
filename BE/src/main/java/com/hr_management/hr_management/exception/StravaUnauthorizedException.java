package com.hr_management.hr_management.exception;

public class StravaUnauthorizedException extends RuntimeException {
    public StravaUnauthorizedException(String message) {
        super(message);
    }
}
