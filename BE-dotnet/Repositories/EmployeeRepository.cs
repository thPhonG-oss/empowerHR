using EmpowerHR.Data;
using EmpowerHR.Common;
using EmpowerHR.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EmpowerHR.Dtos.Employee;     // PositionResponse, DepartmentResponse, BankResponse
using EmpowerHR.Models.Enums;

namespace EmpowerHR.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly AppDbContext _context;

        public EmployeeRepository(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy tất cả nhân viên có phân trang
        /// </summary>
        public async Task<PaginatedResult<Employee>> GetAllAsync(int pageNumber, int pageSize)
        {
            try
            {
                var totalCount = await _context.Employees.CountAsync();

                var employees = await _context.Employees
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Include(e => e.Department)
                    .Include(e => e.Bank)
                    .Include(e => e.Account)
                    .Include(e => e.Position)
                    .AsNoTracking()
                    .ToListAsync();

                return new PaginatedResult<Employee>(employees, totalCount, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi lấy tất cả nhân viên có phân trang: {ex.Message}");
            }
        }

        /// <summary>
        /// Lấy nhân viên theo ID
        /// </summary>
        public async Task<Employee> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Employees
                    .Include(e => e.Department)
                    .Include(e => e.Bank)
                    .Include(e => e.Account)
                    .Include(e => e.Position)
                    .FirstOrDefaultAsync(e => e.EmployeeId == id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi lấy nhân viên với ID {id}: {ex.Message}");
            }
        }



        /// <summary>
        /// Xóa nhân viên theo ID
        /// </summary>
        public async Task DeleteAsync(int id)
        {
            try
            {
                var employee = await GetByIdAsync(id);
                if (employee == null)
                    throw new KeyNotFoundException($"Không tìm thấy nhân viên với ID {id}");

                _context.Employees.Remove(employee);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi xóa nhân viên: {ex.Message}");
            }
        }


        public async Task<PagedResult<EmployeeResponseDto>> GetEmployeesByDepartmentAsync(int departmentId, int page, int pageSize)
        {
            var query = _context.Employees
                .AsNoTracking()
                .Where(e => e.DepartmentId == departmentId && e.IsActive);

            var totalItems = await query.CountAsync();

            // Lấy dữ liệu ra memory trước
            var employeesData = await query
                .OrderBy(e => e.EmployeeName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(e => e.Position)
                .Include(e => e.Department)
                .Include(e => e.Bank)
                .ToListAsync();

            // Map sang DTO trong memory
            var employees = employeesData.Select(e => new EmployeeResponseDto
            {
                EmployeeId = e.EmployeeId,
                EmployeeCode = e.EmployeeCode,
                EmployeeName = e.EmployeeName,
                IdentityCard = e.IdentityCard,
                Address = e.Address,
                DateOfBirth = e.DateOfBirth,
                Gender = string.IsNullOrEmpty(e.Gender) ? null : Enum.Parse<Gender>(e.Gender),
                Email = e.Email,
                PhoneNumber = e.PhoneNumber,
                StartingDate = e.StartingDate,
                IsActive = e.IsActive,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt,
                TaxCode = e.TaxCode,
                PointBalance = e.PointAccount != null ? e.PointAccount.CurrentPoints : 0,

                Position = e.Position == null ? null : new PositionResponse
                {
                    PositionId = e.Position.PositionId,
                    PositionName = e.Position.PositionName
                },

                Department = e.Department == null ? null : new DepartmentResponse
                {
                    DepartmentId = e.Department.DepartmentId,
                    DepartmentName = e.Department.DepartmentName,
                    PointBalance = e.Department?.PointBalance ?? 0
                },

                Bank = e.Bank == null ? null : new BankResponse
                {
                    BankId = e.Bank.BankId,
                    BankName = e.Bank.BankName,
                    Branch = e.Bank.Branch,
                    BankAccountNumber = e.Bank.BankAccountNumber
                }
            }).ToList();

            return new PagedResult<EmployeeResponseDto>
            {
                Items = employees,
                TotalItems = totalItems,
                Page = page,
                PageSize = pageSize
            };
        }
        public async Task SoftDeleteAsync(int id)
        {
            var employee = await GetByIdAsync(id);
            if (employee == null)
                throw new KeyNotFoundException($"Không tìm thấy nhân viên với ID {id}");

            if (!employee.IsActive)
                throw new InvalidOperationException($"Nhân viên {employee.EmployeeName} đã bị xóa trước đó");

            employee.IsActive = false; // đánh dấu xóa mềm
            await _context.SaveChangesAsync();
        }


    }
}