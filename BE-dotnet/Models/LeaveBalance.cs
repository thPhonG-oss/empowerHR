using System;

namespace EmpowerHR.Models
{
    public class LeaveBalance
    {
        public int LeaveBalanceId { get; set; }
        public int Year { get; set; }
        public int UsedLeave { get; set; }
        public int RemainingLeave { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int EmployeeId { get; set; }
        public int LeaveTypeId { get; set; }

        // Navigation Properties
        public Employee Employee { get; set; }
        public LeaveType LeaveType { get; set; }
    }
}
