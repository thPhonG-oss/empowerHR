namespace EmpowerHR.Dtos.Employee
{
    public class DepartmentResponse
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public long PointBalance { get; set; } // không nullable
    }

}
