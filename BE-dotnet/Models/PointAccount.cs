using System;

namespace EmpowerHR.Models
{
    public class PointAccount
    {
        public int PointAccountId { get; set; }
        // public int EmployeeId { get; set; }
        public long CurrentPoints { get; set; }
        public long TotalPointsEarned { get; set; }
        public long TotalPointsSpent { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Employee? Employee { get; set; }
    }
}