package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.request.CashOutRequestDTO;
import com.hr_management.hr_management.dto.request.PerformancePointGivenRequestDTO;
import com.hr_management.hr_management.dto.request.PointPolicyUpdateRequestDTO;
import com.hr_management.hr_management.dto.response.CashOutTransactionResponseDTO;
import com.hr_management.hr_management.dto.response.PointPolicyResponseDTO;
import com.hr_management.hr_management.entity.*;
import com.hr_management.hr_management.enums.TransactionType;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.PointPolicyMapper;
import com.hr_management.hr_management.repository.*;
import com.hr_management.hr_management.service.RewardService;
import com.hr_management.hr_management.utils.JwtUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
    PointPolicyMapper pointPolicyMapper;
    DepartmentBudgetRepository departmentBudgetRepository;



    // get current Point Policy, which is being applied(active)
    @Override
    public PointPolicyResponseDTO getCurrentPointPolicy() {
        PointPolicy activePolicy = pointPolicyRepository.findActivePolicy();
        if (activePolicy == null) {
            throw new IllegalStateException("No active point policy found.");
        }
        return pointPolicyMapper.toPointPolicyResponseDTO(activePolicy);
    }

    // Automate refresh budget points for departments can be added here if needed
    @Override
    public void automateRefreshDepartmentBudgets() {
        PointPolicy activePolicy = pointPolicyRepository.findActivePolicy();
        // Implementation for refreshing department budgets
        List<Department> departments = departmentRepository.findAll();
        for (Department department : departments) {
            Integer budgetPoints = departmentBudgetRepository.findBudgetPointsByDepartmentIdAndPointPolicyId(department.getDepartmentId(), activePolicy.getPointPolicyId());
            department.setPointBalance(budgetPoints.longValue());
            departmentRepository.save(department);
        }
    }


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
            pointAccountRepository.save(account);
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
        pointAccount.setTotalEarns(pointAccount.getTotalEarns() + request.getPoints());

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

    @Transactional
    @Override
    public CashOutTransactionResponseDTO cashOutPoints(CashOutRequestDTO request) {
        // Implementation for cashing out points
        PointPolicy pointPolicy = pointPolicyRepository.findActivePolicy();
        if(pointPolicy == null){
            throw new IllegalStateException("No active point policy found");
        }

        // check existence of employee and point account
        Integer employeeId = jwtUtils.getEmployeeIdFromAuthentication();
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new IllegalStateException("Employee not found"));
        PointAccount pointAccount = pointAccountRepository.findByEmployee_EmployeeId(employeeId);
        if(pointAccount == null || !employee.getIsActive()){
            throw new IllegalStateException("Point account not found");
        }

        // check valid of cash out request
        if(pointAccount.getCurrentPoints() < request.getPointsToCashOut()){
            throw new IllegalStateException("Not enough points to cash out");
        }

        if(request.getPointsToCashOut() < pointPolicy.getMinPoints() || request.getPointsToCashOut() > pointPolicy.getMaxPoints()){
            throw new IllegalStateException("Points to cash out must be between " + pointPolicy.getMinPoints() + " and " + pointPolicy.getMaxPoints());
        }

        // proceed to cash out
        pointAccount.setCurrentPoints(pointAccount.getCurrentPoints() - request.getPointsToCashOut());
        Long cashAmount = Math.round(request.getPointsToCashOut() * pointPolicy.getConversionRate());

        pointAccount.setTotalTransferred(pointAccount.getTotalTransferred() + request.getPointsToCashOut());

        pointAccountRepository.save(pointAccount);

        CashOut cashOut = CashOut.builder()
                .points(request.getPointsToCashOut().longValue())
                .cashAmount(cashAmount)
                .pointAccount(pointAccount)
                .createAt(LocalDateTime.now())
                .build();
        transactionRepository.save(cashOut);

        CashOutTransactionResponseDTO responseDTO = CashOutTransactionResponseDTO.builder()
                .transactionId(cashOut.getTransactionId())
                .points(cashOut.getPoints())
                .cashAmount(cashAmount)
                .transactionType(TransactionType.CashOut)
                .transactionDate(cashOut.getCreateAt())
                .employeeId(employeeId)
                .pointAccountId(employee.getPointAccount().getPointAccountId())
                .build();

        return responseDTO;
    }

    @Override
    public List<PointPolicyResponseDTO> getAllPointPolicies() {
        List<PointPolicy> policies = pointPolicyRepository.findAll();
        List<PointPolicyResponseDTO> responseDTOs = policies.stream()
                .map(pointPolicyMapper::toPointPolicyResponseDTO)
                .toList();
        return responseDTOs;
    }

    @Override
    public PointPolicyResponseDTO updatePointPolicy(Integer id, PointPolicyUpdateRequestDTO requestDTO){
        PointPolicy policy = pointPolicyRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.POINT_POLICY_NOT_FOUND));

        policy.setExpiry(requestDTO.getExpiry());
        policy.setMinPoints(requestDTO.getMinPoints());
        policy.setMaxPoints(requestDTO.getMaxPoints());
        policy.setConversionRate(requestDTO.getConversionRate());
        policy.setEndDate(requestDTO.getEndDate());
        policy.setIsActive(requestDTO.getIsActive()? true : false);
        policy.setUpdatedAt(LocalDateTime.now());

        PointPolicy updatedPolicy = pointPolicyRepository.save(policy);
        return pointPolicyMapper.toPointPolicyResponseDTO(updatedPolicy);
    }

}
