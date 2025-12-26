using EmpowerHR.Common;
using EmpowerHR.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EmpowerHR.Repositories
{
    public interface IEmployeeRepository
    {

        Task<PaginatedResult<Employee>> GetAllAsync(int pageNumber, int pageSize);
        Task<Employee> GetByIdAsync(int id);
        Task DeleteAsync(int id);
    }
}