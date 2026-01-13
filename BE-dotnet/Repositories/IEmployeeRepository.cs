using EmpowerHR.Common;
using EmpowerHR.Models;
using System.Collections.Generic;
using System.Threading.Tasks;  // cho PagedResult<T>
using EmpowerHR.Dtos.Employee;  // cho EmployeeResponseDto // cho PositionResponse, DepartmentResponse, BankResponse

namespace EmpowerHR.Repositories
{
    public interface IEmployeeRepository
    {

        Task<PaginatedResult<Employee>> GetAllAsync(int pageNumber, int pageSize);
        Task<Employee> GetByIdAsync(int id);
        Task DeleteAsync(int id);

        Task<PagedResult<EmployeeResponseDto>> GetEmployeesByDepartmentAsync(int departmentId, int page, int pageSize);
    
        Task SoftDeleteAsync(int id);


    }
}