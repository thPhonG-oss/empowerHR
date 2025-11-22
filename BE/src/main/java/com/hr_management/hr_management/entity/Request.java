package com.hr_management.hr_management.entity;

import com.hr_management.hr_management.enums.RequestStatus;
import com.hr_management.hr_management.enums.RequestType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "Request")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Inheritance(strategy = InheritanceType.JOINED)
//@Builder
// update: xóa @Builder, thêm @SuperBuilder => sử dụng builder cho cả class cha và class con
@SuperBuilder
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Integer requestId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RequestStatus status = RequestStatus.Pending;

    @Column(name = "submit_at", updatable = false)
    private LocalDateTime submitAt;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_type", nullable = false)
    private RequestType requestType;

    @Column(name = "handle_at")
    private LocalDateTime handleAt;

    @Column(name = "response_reason", columnDefinition = "TEXT")
    private String responseReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
}
