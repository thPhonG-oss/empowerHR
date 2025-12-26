using EmpowerHR.Models;
using EmpowerHR.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EmpowerHR.Services
{
    public interface IEmployeeService
    {
        Task<PaginatedResult<Employee>> GetAllEmployeesAsync(int pageNumber, int pageSize);
        Task<Employee> GetEmployeeByIdAsync(int id);
        Task DeleteEmployeeAsync(int id);
    }
}