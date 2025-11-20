package com.hr_management.hr_management.dto.request;

import com.devteria.identity_service.validator.DobConstrain;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.mapstruct.Mapper;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Mapper
@Builder
public class UserCreateRequest {
    @DobConstrain(min=18,message ="NOT_ENOUGHT_YEAR_OLD")
    LocalDate dob;
    String firstName;
    String lastName;
    @Size(min = 8, message = "NOT_ENOUGHT_CHARACTER_PASSWORD")
    String password;
    @Size(min=6,message="NOT_ENOUGHT_CHARACTER_USERNAME")
    String username;
}
