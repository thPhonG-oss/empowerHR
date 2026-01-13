using System;

namespace EmpowerHR.Models
{
    public class Attendance
    {
        public int AttendanceId { get; set; }
        public DateTime AttendanceDate { get; set; }
        public TimeSpan? CheckinTime { get; set; }
        public TimeSpan? CheckoutTime { get; set; }
        public long? WorkingHours { get; set; }
        public string IpCheckin { get; set; }
        public string IpCheckout { get; set; }
        public string CheckinLocationStatus { get; set; }
        public string CheckoutLocationStatus { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int EmployeeId { get; set; }

        // Navigation Properties
        public Employee Employee { get; set; }
    }
}