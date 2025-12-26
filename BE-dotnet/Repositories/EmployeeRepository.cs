using EmpowerHR.Data;
using EmpowerHR.Common;
using EmpowerHR.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
                    .AsNoTracking()
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


    }
}