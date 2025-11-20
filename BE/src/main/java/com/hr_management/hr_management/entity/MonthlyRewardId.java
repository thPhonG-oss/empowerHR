package com.hr_management.hr_management.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyRewardId implements Serializable {
    private Integer position;
    private Integer pointPolicy;
}
