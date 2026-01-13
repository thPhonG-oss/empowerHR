package com.hr_management.hr_management.dto.response;

import com.hr_management.hr_management.entity.Department;
import com.hr_management.hr_management.entity.PointPolicy;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgeDepartmentResponse {
    Integer departmentBudgetId;
    DepartmentResponse department;
    Integer budget;
    LocalDate startDate;
    LocalDate endDate;
}
