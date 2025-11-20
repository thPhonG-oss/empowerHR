package com.hr_management.hr_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "DepartmentBudget")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(DepartmentBudgetId.class)
public class DepartmentBudget {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "point_policy_id")
    private PointPolicy pointPolicy;

    @Column(name = "budget")
    private Integer budget = 0;
}
