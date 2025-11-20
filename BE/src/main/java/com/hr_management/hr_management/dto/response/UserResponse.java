package com.hr_management.hr_management.dto.response;

import com.devteria.identity_service.entity.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.mapstruct.Mapper;

import java.time.LocalDate;
import java.util.Set;
@Data
@Builder
@Mapper
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Long id;
    LocalDate dob;
    String firstName;
    String lastName;
    String username;
    Set<Role> roles;
}
