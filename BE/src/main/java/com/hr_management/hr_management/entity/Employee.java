package com.hr_management.hr_management.entity;


import com.hr_management.hr_management.enums.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Employee")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Integer employeeId;

    @Column(name = "employee_code", length = 10)
    private String employeeCode;

    @Column(name = "employee_name", nullable = false, length = 100)
    private String employeeName;

    @Column(name = "identity_card", length = 20)
    private String identityCard;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "email", unique = true, length = 100)
    private String email;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "starting_date")
    private LocalDate startingDate;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "tax_code", length = 50)
    private String taxCode;

    @Column(name = "point_balance", precision = 10, scale = 2)
    private Long pointBalance;

//    @OneToOne(fetch = FetchType.LAZY)
    // Update: bỏ fetchtype => @OneToOne mặc định fetchtype là EAGER
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "account_id", unique = true)
    private Account account;

//    @ManyToOne(fetch = FetchType.LAZY)
    // Update: bỏ fetchtype => @OneToOne mặc định fetchtype là EAGER
    @ManyToOne
    @JoinColumn(name = "position_id")
    private Position position;

//    @ManyToOne(fetch = FetchType.LAZY)
// Update: bỏ fetchtype => @OneToOne mặc định fetchtype là EAGER
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

//    @ManyToOne(fetch = FetchType.LAZY)
    // Update: thành OneToOne
    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "bank_id")
    private Bank bank;

    //Update thêm Request
    @OneToMany(
            mappedBy = "employee",
            cascade = {CascadeType.PERSIST,CascadeType.MERGE},
            orphanRemoval = true
    )
    private List<Request> requests = new ArrayList<>();

    // Update thêm Attendence, đặt orphanRemove=true => khi xóa employee, các attendence liên quan cũng sẽ được xóa
    @OneToMany(
            mappedBy = "employee",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            orphanRemoval = true
    )
    private List<Attendance> attendances = new ArrayList<>();

    // Thêm LeaveBalance
    @OneToMany(
            mappedBy = "employee",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            orphanRemoval = true
    )
    private List<LeaveBalance> leaveBalances = new ArrayList<>();
}
