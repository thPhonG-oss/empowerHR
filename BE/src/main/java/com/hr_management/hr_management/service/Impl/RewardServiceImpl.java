package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.request.PerformancePointGivenRequestDTO;
import com.hr_management.hr_management.entity.*;
import com.hr_management.hr_management.repository.*;
import com.hr_management.hr_management.service.RewardService;
import com.hr_management.hr_management.utils.JwtUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class RewardServiceImpl implements RewardService {
    EmployeeRepository employeeRepository;
    PointAccountRepository pointAccountRepository;
    PointPolicyRepository pointPolicyRepository;
    MonthlyRewardRepository monthlyRewardRepository;
    JwtUtils jwtUtils;
    DepartmentRepository departmentRepository;
    TransactionRepository transactionRepository;


    // This method can be scheduled to run at specific intervals using @Scheduled annotation
    @Override
    public void automateMonthlyRewards() {
        // Implementation for automating monthly rewards
        PointPolicy policy = pointPolicyRepository.findActivePolicy();
        if (policy == null) {
            throw new IllegalStateException("No active point policy found.");
        }
        List<PointAccount> accounts = pointAccountRepository.findAll();
        for (PointAccount account : accounts) {
            Employee employee = account.getEmployee();
            if(employee != null && employee.getIsActive()){
                MonthlyReward monthlyReward = monthlyRewardRepository.findByPositionIdAndPointPolicy_PointPolicyId(employee.getPosition().getPositionId(), policy.getPointPolicyId());
                if (monthlyReward != null) {
                    account.setCurrentPoints(account.getCurrentPoints() + monthlyReward.getMonthlyPoints());
                }
            }
            pointAccountRepository.save(account);
        }
    }

    // auto refresh expired points of employees
    @Override
    public void refreshExpiredPoints() {
        // Get all point accounts
        List<PointAccount> accounts = pointAccountRepository.findAll();
        for (PointAccount account : accounts) {
            account.setCurrentPoints(0L);
        }
    }

    // Manger give points to employee
    @Transactional
    @Override
    public boolean givePointsToEmployee(PerformancePointGivenRequestDTO request) {
        Integer managerId = jwtUtils.getEmployeeIdFromAuthentication();
        Employee manager = employeeRepository.findById(managerId).orElseThrow(() -> new IllegalStateException("Manager not found"));

        Department department = departmentRepository.findByManager_EmployeeId(managerId);
        if(department == null){
            throw new IllegalStateException("Manager does not manage any department");
        }

        Employee employee = employeeRepository.findById(request.getEmployeeId()).orElseThrow(() -> new IllegalStateException("Employee not found"));

        if(!employee.getDepartment().getDepartmentId().equals(department.getDepartmentId())){
            throw new IllegalStateException("Manager can only give points to employees in their own department");
        }

        PointAccount pointAccount = pointAccountRepository.findByEmployee_EmployeeId(employee.getEmployeeId());
        if(pointAccount == null){
            throw new IllegalStateException("Point account for employee not found");
        }

        if(department.getPointBalance() < request.getPoints() || request.getPoints() <= 0 || department.getPointBalance() <= 0){
            throw new IllegalStateException("Department does not have enough points to give");
        }
        else{
            department.setPointBalance(department.getPointBalance() - request.getPoints());
        }

        pointAccount.setCurrentPoints(pointAccount.getCurrentPoints() + request.getPoints());

        pointAccountRepository.save(pointAccount);
        departmentRepository.save(department);

        PerformanceReward reward = PerformanceReward.builder()
                .points((long) request.getPoints())
                .message(request.getMessage())
                .department(department)
                .build();

        reward.setPointAccount(pointAccount);

        transactionRepository.save(reward);
        return true;
    }

}
