package com.hr_management.hr_management.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.mapstruct.Mapper;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Mapper
@Builder
public class AuthenticateRequest {
    String userName;
    String password;
}
