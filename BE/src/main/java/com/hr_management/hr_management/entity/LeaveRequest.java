package com.hr_management.hr_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "LeaveRequest")
@Data
@NoArgsConstructor
@AllArgsConstructor
@PrimaryKeyJoinColumn(name = "request_id")
// Thêm @SuperBuilder
@SuperBuilder
@DiscriminatorValue("Leave")
public class LeaveRequest extends Request {

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "proof_document", columnDefinition = "TEXT")
    private String proofDocument;

//    @ManyToOne(fetch = FetchType.LAZY)
    // Update: bỏ fetch type, mặc định của ManyToOne là EAGER
    @ManyToOne
    @JoinColumn(name = "leave_type_id", nullable = false)
    private LeaveType leaveType;
}