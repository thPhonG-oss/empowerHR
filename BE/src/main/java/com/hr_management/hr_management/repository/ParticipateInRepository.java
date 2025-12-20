package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.entity.RunningActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import com.hr_management.hr_management.entity.ParticipateIn;
import com.hr_management.hr_management.enums.ActivityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipateInRepository extends JpaRepository<ParticipateIn, Integer> {
    ParticipateIn findByEmployee_EmployeeIdAndRunningActivity_Status(Integer employeeId, ActivityStatus activityStatus);

    List<ParticipateIn> findAllByRunningActivity_RunningActivityId(Integer runningActivityId);

    // Kiểm tra nhân viên đã đăng ký hoạt động chưa
    boolean existsByEmployeeAndRunningActivity(Employee employee, RunningActivity activity);

    // Tìm đăng ký của nhân viên cho hoạt động cụ thể
    Optional<ParticipateIn> findByEmployeeAndRunningActivity(Employee employee, RunningActivity activity);

    // Lấy danh sách tham gia của hoạt động (chưa hủy)
    List<ParticipateIn> findByRunningActivityAndIsCancelledFalse(RunningActivity activity);

    // Lấy danh sách hoạt động của nhân viên (chưa hủy)
    List<ParticipateIn> findByEmployeeAndIsCancelledFalse(Employee employee);

    // Đếm số lượng tham gia của hoạt động (chưa hủy)
    Long countByRunningActivityAndIsCancelledFalse(RunningActivity activity);

    List<ParticipateIn> findByEmployee_EmployeeId(Integer employeeId);

    Optional<ParticipateIn> findByEmployee_EmployeeIdAndRunningActivity_RunningActivityId(Integer employeeEmployeeId, Integer runningActivityRunningActivityId);
}
