package com.hr_management.hr_management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountResponseDTO {
    Integer accountId;
    String username;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    Set<RoleResponse> roles = new HashSet<>();
    Boolean accountStatus;
}
