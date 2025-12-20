package com.hr_management.hr_management.configuration;


import com.hr_management.hr_management.dto.request.EmployeeProfileCreationRequestDTO;
import com.hr_management.hr_management.entity.Account;
import com.hr_management.hr_management.entity.Department;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.entity.Role;
import com.hr_management.hr_management.enums.Gender;
import com.hr_management.hr_management.enums.Roles;
import com.hr_management.hr_management.repository.*;
import com.hr_management.hr_management.service.EmployeeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@RequiredArgsConstructor
public class ApplicationInitConfig {
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;
    PermissionRepository permissionRepository;
    EmployeeService employeeService;
    DepartmentRepository departmentRepository;
    EmployeeRepository employeeRepository;
    @Bean
    ApplicationRunner applicationRunner(AccountRepository accountRepository){
        return args -> {
            if(accountRepository.findByUsername("admin").isEmpty()){
                var roles=new HashSet<Role>();
                Optional<Role> role=roleRepository.findByName(Roles.ADMIN.toString());
                if((role.isEmpty())){
                    Role adminRole = roleRepository.save(Role.builder()
                            .name(Roles.ADMIN.toString())
                            .build());
                    roles.add(adminRole);
                }else{
                    roles.add(role.get());
                }
                Account account= Account.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .roles(roles)
                        .build();
                accountRepository.save(account);
            }

            EmployeeProfileCreationRequestDTO manager1 = EmployeeProfileCreationRequestDTO.builder()
                    .employeeName("Manager One")
                    .identityCard("111001592385")
                    .address("So 1 Nam Ky Khoi Nghia, District 1, Ho Chi Minh City")
                    .dateOfBirth(LocalDate.parse("1980-01-15"))
                    .gender(Gender.Female)
                    .email("manager1@empowerhr.com")
                    .phoneNumber("555-1234")
                    .taxCode("1234")
                    .positionId(2)
                    .departmentId(1)
                    .bankName("Techcombank")
                    .bankBranch("Chi Nhanh Ha Noi")
                    .bankAccountNumber("1234567890")
                    .roles(Set.of("Manager"))
                    .build();

            EmployeeProfileCreationRequestDTO manager2 = EmployeeProfileCreationRequestDTO.builder()
                    .employeeName("Manager Two")
                    .identityCard("211001592385")
                    .address("Landmark 81, Ho Chi Minh City")
                    .dateOfBirth(LocalDate.parse("1980-01-15"))
                    .gender(Gender.Male)
                    .email("manager2@empowerhr.com")
                    .phoneNumber("2555349581234")
                    .taxCode("123445541234")
                    .positionId(2)
                    .departmentId(2)
                    .bankName("Techcombank")
                    .bankBranch("Chi Nhanh Ha Noi")
                    .bankAccountNumber("2234567890")
                    .roles(Set.of("Manager"))
                    .build();

            EmployeeProfileCreationRequestDTO manager3 = EmployeeProfileCreationRequestDTO.builder()
                    .employeeName("Manager Three")
                    .identityCard("311001592385")
                    .address("Nha Tho Duc Ba, Ho Chi Minh City")
                    .dateOfBirth(LocalDate.parse("1980-01-15"))
                    .gender(Gender.Male)
                    .email("manager3@empowerhr.com")
                    .phoneNumber("25554381234")
                    .taxCode("323445541234")
                    .positionId(2)
                    .departmentId(3)
                    .bankName("Techcombank")
                    .bankBranch("Chi Nhanh Thu Duc")
                    .bankAccountNumber("3234567890")
                    .roles(Set.of("Manager"))
                    .build();

            EmployeeProfileCreationRequestDTO manager4 = EmployeeProfileCreationRequestDTO.builder()
                    .employeeName("Manager Four")
                    .identityCard("411001592385")
                    .address("112 Nguyen Dinh Chieu, Ho Chi Minh City")
                    .dateOfBirth(LocalDate.parse("1980-01-15"))
                    .gender(Gender.Male)
                    .email("manager4@empowerhr.com")
                    .phoneNumber("248794352845790")
                    .taxCode("423445541234")
                    .positionId(2)
                    .departmentId(4)
                    .bankName("Techcombank")
                    .bankBranch("Chi Nhanh Binh Thanh")
                    .bankAccountNumber("4234567890")
                    .roles(Set.of("Manager"))
                    .build();

            if(!employeeRepository.existsByEmail(manager1.getEmail())){
                Employee savedManager1 =  employeeService.createDefaultMangerProfile(manager1);
                Department department1 = departmentRepository.findById(1).orElse(null);
                if(department1 != null) {
                    //update manager of department 1
                    department1.setManager(savedManager1);
                    departmentRepository.save(department1);
                }
            }

            if(!employeeRepository.existsByEmail(manager2.getEmail())){
                Employee savedManager2 = employeeService.createDefaultMangerProfile(manager2);
                Department department2 = departmentRepository.findById(2).orElse(null);

                if(department2 != null) {
                    //update manager of department 2
                    department2.setManager(savedManager2);
                    departmentRepository.save(department2);
                }
            }
            if(!employeeRepository.existsByEmail(manager3.getEmail())){
                Employee savedManager3 = employeeService.createDefaultMangerProfile(manager3);
                Department department3 = departmentRepository.findById(3).orElse(null);
                if(department3 != null) {
                    //update manager of department 3
                    department3.setManager(savedManager3);
                    departmentRepository.save(department3);
                }
            }

            if(!employeeRepository.existsByEmail(manager4.getEmail())){
                Employee savedManager4 = employeeService.createDefaultMangerProfile(manager4);
                Department department4 = departmentRepository.findById(4).orElse(null);
                if(department4 != null) {
                    //update manager of department 4
                    department4.setManager(savedManager4);
                    departmentRepository.save(department4);
                }
            }

        };
    }
}
