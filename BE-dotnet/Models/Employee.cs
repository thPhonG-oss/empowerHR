using System;
using System.Collections.Generic;

namespace EmpowerHR.Models
{
    public class Employee
    {
        public int EmployeeId { get; set; }
        public string? EmployeeCode { get; set; }
        public string? EmployeeName { get; set; }
        public string? IdentityCard { get; set; }
        public string? Address { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? StartingDate { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? TaxCode { get; set; }

        // Foreign Keys
        public int? AccountId { get; set; }
        public int? PositionId { get; set; }
        public int? DepartmentId { get; set; }
        public int? BankId { get; set; }
        public int? PointAccountId { get; set; }

        // Navigation Properties
        public Account? Account { get; set; }
        public Position? Position { get; set; }
        public Department? Department { get; set; }
        public Bank? Bank { get; set; }
        public PointAccount? PointAccount { get; set; }
        public Department? ManagedDepartment { get; set; }

        public ICollection<Request>? Requests { get; set; } = new List<Request>();
        public ICollection<Attendance>? Attendances { get; set; } = new List<Attendance>();
        public ICollection<LeaveBalance>? LeaveBalances { get; set; } = new List<LeaveBalance>();
    }
}