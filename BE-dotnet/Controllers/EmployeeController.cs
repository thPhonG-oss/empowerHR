// Controllers/EmployeeController.cs
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using EmpowerHR.Services;
using EmpowerHR.DTOs.Response;
using EmpowerHR.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EmpowerHR.Controllers
{
    [ApiController]
    [Route("api/employees")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly IMapper _mapper;
        private readonly ILogger<EmployeeController> _logger;

        public EmployeeController(IEmployeeService employeeService, IMapper mapper, ILogger<EmployeeController> logger)
        {
            _employeeService = employeeService;
            _mapper = mapper;
            _logger = logger;
        }



        /// <summary>
        /// Lấy danh sách nhân viên có phân trang
        /// GET: /api/employee/paginated?pageNumber=1&pageSize=10
        /// </summary>
        [HttpGet("")]
        public async Task<IActionResult> GetAllEmployeesPaginated([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _employeeService.GetAllEmployeesAsync(pageNumber, pageSize);

                if (result == null || !result.Data.Any())
                {
                    return NotFound();
                }

                var employeeResponses = _mapper.Map<IEnumerable<EmployeeResponse>>(result.Data);
                var paginatedResult = new PaginatedResult<EmployeeResponse>(employeeResponses, result.TotalCount, result.PageNumber, result.PageSize);
                
                return Ok(paginatedResult);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Lỗi GetAllEmployeesPaginated: {ex.Message}");
                return StatusCode(500);
            }
        }

        /// <summary>
        /// Lấy thông tin chi tiết 1 nhân viên
        /// GET: /api/employee/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            try
            {
                var employee = await _employeeService.GetEmployeeByIdAsync(id);

                if (employee == null)
                {
                    return NotFound();
                }

                var employeeResponse = _mapper.Map<EmployeeResponse>(employee);
                return Ok(employeeResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Lỗi GetEmployeeById: {ex.Message}");
                return StatusCode(500);
            }
        }

        /// <summary>
        /// Xóa nhân viên
        /// DELETE: /api/employee/{id}
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            try
            {
                var employee = await _employeeService.GetEmployeeByIdAsync(id);

                if (employee == null)
                {
                    return NotFound();
                }

                await _employeeService.DeleteEmployeeAsync(id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Lỗi DeleteEmployee: {ex.Message}");
                return StatusCode(500);
            }
        }
    }
}