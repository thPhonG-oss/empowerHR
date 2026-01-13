using EmpowerHR.Models;
using EmpowerHR.Common;
using System.Collections.Generic;
using System.Threading.Tasks;
using EmpowerHR.Dtos.Employee;

namespace EmpowerHR.Services
{
    public interface IEmployeeService
    {
        Task<PaginatedResult<Employee>> GetAllEmployeesAsync(int pageNumber, int pageSize);
        Task<Employee> GetEmployeeByIdAsync(int id);
        Task DeleteEmployeeAsync(int id);
        Task<PagedResult<EmployeeResponseDto>>
                    GetEmployeesByDepartmentAsync(int departmentId, int page, int pageSize);
        Task SoftDeleteEmployeeAsync(int id);
    }
}