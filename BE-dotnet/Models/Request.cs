using System;

namespace EmpowerHR.Models
{
    public class Request
    {
        public int RequestId { get; set; }
        public string Status { get; set; }
        public DateTime SubmitAt { get; set; }
        public string Reason { get; set; }
        public DateTime? HandleAt { get; set; }
        public string ResponseReason { get; set; }
        public int EmployeeId { get; set; }

        // Navigation Properties
        public Employee Employee { get; set; }
    }
}