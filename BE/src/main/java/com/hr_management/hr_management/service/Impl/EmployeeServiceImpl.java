package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.EmployeeResponse;
import com.hr_management.hr_management.service.EmployeeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.hr_management.hr_management.mapper.EmployeeMapper;
import com.hr_management.hr_management.repository.EmployeeRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EmployeeServiceImpl implements EmployeeService   {

    EmployeeRepository employeeRepository;
    EmployeeMapper employeeMapper;

    // [ Admin ]
    // 1. Xem danh sách nhân viên
    @Override
    public List<EmployeeResponse> getAll() {

        var employee = employeeRepository.findAll();
        return employee.stream()
                .map(emp -> {
                    var dto = employeeMapper.toEmployeeResponse(emp);

                    dto.setBankAccountNumber(
                            emp.getBank() != null
                                    ? emp.getBank().getBankAccountNumber()
                                    : null
                    );

                    dto.setPositionName(
                            emp.getPosition() != null
                                    ? emp.getPosition().getPositionName()
                                    : null
                    );

                    return dto;
                })
                .toList();
    }

    // [ Manager ]
    // 1. Xem chi tiết hồ sơ nhân viên
    @Override
    public EmployeeResponse getEmployeeById(Integer employeeId) {
        // Lấy ra employee theo id
        var employee = employeeRepository
                .findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên trong phòng ban của bạn"));

        // Convert entity → DTO
        var dto = employeeMapper.toEmployeeResponse(employee);
        dto.setBankAccountNumber(
                employee.getBank() != null
                        ? employee.getBank().getBankAccountNumber()
                        : null
        );
        dto.setPositionName(
                employee.getPosition() != null
                        ? employee.getPosition().getPositionName()
                        : null
        );
        return dto;
    }


    // [ Employee ]
    // 1. Xem hồ sơ cá nhân



    // 2. Cập nhật thông tin cá nhân
}
