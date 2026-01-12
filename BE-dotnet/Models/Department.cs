using System;

namespace EmpowerHR.Models
{
    public class Department
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public DateTime? EstablishedDate { get; set; }
        public long? PointBalance { get; set; }
        public int? ManagerId { get; set; }

        // Navigation Properties
        public Employee Manager { get; set; }
    }
}
