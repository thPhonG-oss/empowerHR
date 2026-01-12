// Services/EmployeeService.cs
using EmpowerHR.Models;
using EmpowerHR.Repositories;
using EmpowerHR.DTOs.Response;
using EmpowerHR.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using EmpowerHR.Dtos.Employee;
namespace EmpowerHR.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly ILogger<EmployeeService> _logger;

        public EmployeeService(IEmployeeRepository employeeRepository, ILogger<EmployeeService> logger)
        {
            _employeeRepository = employeeRepository;
            _logger = logger;
        }


        /// <summary>
        /// Lấy danh sách tất cả nhân viên có phân trang
        /// </summary>
        public async Task<PaginatedResult<Employee>> GetAllEmployeesAsync(int pageNumber, int pageSize)
        {
            try
            {
                _logger.LogInformation($"Lấy danh sách nhân viên - Page {pageNumber}, Size {pageSize}");
                var result = await _employeeRepository.GetAllAsync(pageNumber, pageSize);
                _logger.LogInformation($"Tìm thấy {result.TotalCount} nhân viên, trả về {result.Data.Count()} bản ghi");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Lỗi khi lấy danh sách nhân viên có phân trang: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Lấy thông tin chi tiết 1 nhân viên theo ID
        /// </summary>
        public async Task<Employee> GetEmployeeByIdAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Lấy nhân viên với ID: {id}");
                var employee = await _employeeRepository.GetByIdAsync(id);
                
                if (employee == null)
                {
                    _logger.LogWarning($"Nhân viên với ID {id} không tồn tại");
                }

                return employee;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Lỗi khi lấy nhân viên ID {id}: {ex.Message}");
                throw;
            }
        }



        /// <summary>
        /// Xóa nhân viên theo ID
        /// </summary>
        public async Task DeleteEmployeeAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Xóa nhân viên với ID: {id}");
                await _employeeRepository.DeleteAsync(id);
                _logger.LogInformation($"Xóa nhân viên ID {id} thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Lỗi khi xóa nhân viên ID {id}: {ex.Message}");
                throw;
            }

        }

        public async Task<PagedResult<EmployeeResponseDto>>
        GetEmployeesByDepartmentAsync(int departmentId, int page, int pageSize)
            {
                if (departmentId <= 0)
                    throw new ArgumentException("DepartmentId không hợp lệ");

                if (page <= 0) page = 1;
                if (pageSize <= 0 || pageSize > 100) pageSize = 10;

                return await _employeeRepository
                    .GetEmployeesByDepartmentAsync(departmentId, page, pageSize);
            }

        public async Task SoftDeleteEmployeeAsync(int id)
        {
            // Bạn có thể thêm logic kiểm tra quyền, logging, validation...
            await _employeeRepository.SoftDeleteAsync(id);
        }


    }
        
}