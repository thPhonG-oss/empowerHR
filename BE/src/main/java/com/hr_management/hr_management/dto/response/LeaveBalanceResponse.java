package com.hr_management.hr_management.dto.response;

import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.entity.LeaveType;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class LeaveBalanceResponse {
    Integer leaveBalanceId;
    Integer year;
    Integer usedLeave;
    Integer remainingLeave;

}
