package com.hr_management.hr_management.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.mapstruct.Mapper;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Mapper
@Builder
public class UserUpdateRequest {
    LocalDate dob;
    String firstName;
    String lastName;
    @Size(min = 8, message = "password must contain 8 keys")
    String password;
    @Size(min=8,message="username must contain 8 keys")
    String username;
    List<String>roles;
}
