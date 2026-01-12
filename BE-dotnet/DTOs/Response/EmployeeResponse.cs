using System;

namespace EmpowerHR.DTOs.Response
{
    public class EmployeeResponse
    {
        public int EmployeeId { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeName { get; set; }
        public string IdentityCard { get; set; }
        public string Address { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime? StartingDate { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string TaxCode { get; set; }
        public long? PointBalance { get; set; }
        public string Position { get; set; }
        public string Department { get; set; }
        public string Bank { get; set; }
        public string BankAccountNumber { get; set; }
    }
}