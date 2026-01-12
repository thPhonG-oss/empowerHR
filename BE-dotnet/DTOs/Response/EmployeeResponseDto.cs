using System;
using EmpowerHR.Models.Enums; // nếu Gender là enum

namespace EmpowerHR.Dtos.Employee
{
    public class EmployeeResponseDto
    {
        public int EmployeeId { get; set; }
        public string? EmployeeCode { get; set; }   // cho phép null
        public string? EmployeeName { get; set; }
        public string? IdentityCard { get; set; }
        public string? Address { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public Gender? Gender { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? StartingDate { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? TaxCode { get; set; }
        public long PointBalance { get; set; }

        public PositionResponse? Position { get; set; }
        public DepartmentResponse? Department { get; set; }
        public BankResponse? Bank { get; set; }
    }

}
