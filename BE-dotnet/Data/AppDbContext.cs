using Microsoft.EntityFrameworkCore;
using EmpowerHR.Models;

namespace EmpowerHR.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Position> Positions { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Bank> Banks { get; set; }
        public DbSet<Request> Requests { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<LeaveBalance> LeaveBalances { get; set; }
        public DbSet<PointAccount> PointAccounts { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<LeaveType> LeaveTypes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ========== Employee Configuration ==========
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.ToTable("Employee");
                entity.HasKey(e => e.EmployeeId);

                entity.Property(e => e.EmployeeId).HasColumnName("employee_id");
                entity.Property(e => e.EmployeeCode).HasColumnName("employee_code").HasMaxLength(10);
                entity.Property(e => e.EmployeeName).HasColumnName("employee_name").HasMaxLength(100).IsRequired();
                entity.Property(e => e.IdentityCard).HasColumnName("identity_card").HasMaxLength(20);
                entity.Property(e => e.Address).HasColumnName("address");
                entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
                entity.Property(e => e.Gender).HasColumnName("gender");
                entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(100);
                entity.Property(e => e.PhoneNumber).HasColumnName("phone_number").HasMaxLength(20);
                entity.Property(e => e.StartingDate).HasColumnName("starting_date");
                entity.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
                entity.Property(e => e.TaxCode).HasColumnName("tax_code").HasMaxLength(50);

                // Foreign Keys
                entity.Property(e => e.AccountId).HasColumnName("account_id");
                entity.Property(e => e.PositionId).HasColumnName("position_id");
                entity.Property(e => e.DepartmentId).HasColumnName("department_id");
                entity.Property(e => e.BankId).HasColumnName("bank_id");
                entity.Property(e => e.PointAccountId).HasColumnName("point_account_id");

                // Relationships
                entity.HasOne(e => e.Account)
                    .WithOne()
                    .HasForeignKey<Employee>(e => e.AccountId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.Position)
                    .WithMany()
                    .HasForeignKey(e => e.PositionId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.Department)
                    .WithMany()
                    .HasForeignKey(e => e.DepartmentId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.Bank)
                    .WithOne()
                    .HasForeignKey<Employee>(e => e.BankId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);



                    entity.HasOne(e => e.PointAccount)
                        .WithOne(p => p.Employee)
                        .HasForeignKey<Employee>(e => e.PointAccountId)  // ← QUAN TRỌNG: chỉ định Employee là owning side
                        .IsRequired(false)
                        .OnDelete(DeleteBehavior.SetNull);

                entity.HasMany(e => e.Requests)
                    .WithOne(r => r.Employee)
                    .HasForeignKey(r => r.EmployeeId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.Attendances)
                    .WithOne(a => a.Employee)
                    .HasForeignKey(a => a.EmployeeId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.LeaveBalances)
                    .WithOne(lb => lb.Employee)
                    .HasForeignKey(lb => lb.EmployeeId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.ManagedDepartment)
                    .WithOne(d => d.Manager)
                    .HasForeignKey<Department>(d => d.ManagerId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ========== Account Configuration ==========
            modelBuilder.Entity<Account>(entity =>
            {
                entity.ToTable("Account");
                entity.HasKey(a => a.AccountId);

                entity.Property(a => a.AccountId).HasColumnName("account_id");
                entity.Property(a => a.Username).HasColumnName("username").HasMaxLength(50).IsRequired();
                entity.Property(a => a.Password).HasColumnName("password").HasMaxLength(255).IsRequired();
                entity.Property(a => a.CreatedAt).HasColumnName("created_at");
                entity.Property(a => a.UpdatedAt).HasColumnName("updated_at");
                entity.Property(a => a.AccountStatus).HasColumnName("account_status");

                // ManyToMany: Account <-> Role
                entity.HasMany(a => a.Roles)
                    .WithMany()
                    .UsingEntity<Dictionary<string, object>>(
                        "AccountRole",
                        j => j.HasOne<Role>().WithMany().HasForeignKey("role_id"),
                        j => j.HasOne<Account>().WithMany().HasForeignKey("account_id"),
                        j => j.ToTable("Account_Role"));
            });

            // ========== Position Configuration ==========
            modelBuilder.Entity<Position>(entity =>
            {
                entity.ToTable("JobPosition");
                entity.HasKey(p => p.PositionId);

                entity.Property(p => p.PositionId).HasColumnName("position_id");
                entity.Property(p => p.PositionName).HasColumnName("position_name").HasMaxLength(100).IsRequired();
            });

            // ========== Department Configuration ==========
            modelBuilder.Entity<Department>(entity =>
            {
                entity.ToTable("Department");
                entity.HasKey(d => d.DepartmentId);

                entity.Property(d => d.DepartmentId).HasColumnName("department_id");
                entity.Property(d => d.DepartmentName).HasColumnName("department_name").HasMaxLength(100).IsRequired();
                entity.Property(d => d.EstablishedDate).HasColumnName("established_date");
                entity.Property(d => d.PointBalance).HasColumnName("point_balance");
                entity.Property(d => d.ManagerId).HasColumnName("manager_id");
            });

            // ========== Bank Configuration ==========
            modelBuilder.Entity<Bank>(entity =>
            {
                entity.ToTable("Bank");
                entity.HasKey(b => b.BankId);

                entity.Property(b => b.BankId).HasColumnName("bank_id");
                entity.Property(b => b.BankName).HasColumnName("bank_name").HasMaxLength(100).IsRequired();
                entity.Property(b => b.Branch).HasColumnName("branch").HasMaxLength(100);
                entity.Property(b => b.BankAccountNumber).HasColumnName("bank_account_number").HasMaxLength(50);
                entity.Property(b => b.CreatedAt).HasColumnName("created_at");
                entity.Property(b => b.UpdatedAt).HasColumnName("updated_at");
            });

            // ========== Request Configuration ==========
            modelBuilder.Entity<Request>(entity =>
            {
                entity.ToTable("Request");
                entity.HasKey(r => r.RequestId);

                entity.Property(r => r.RequestId).HasColumnName("request_id");
                entity.Property(r => r.Status).HasColumnName("status");
                entity.Property(r => r.SubmitAt).HasColumnName("submit_at");
                entity.Property(r => r.Reason).HasColumnName("reason");
                entity.Property(r => r.HandleAt).HasColumnName("handle_at");
                entity.Property(r => r.ResponseReason).HasColumnName("response_reason");
                entity.Property(r => r.EmployeeId).HasColumnName("employee_id");
            });

            // ========== Attendance Configuration ==========
            modelBuilder.Entity<Attendance>(entity =>
            {
                entity.ToTable("Attendance");
                entity.HasKey(a => a.AttendanceId);

                entity.Property(a => a.AttendanceId).HasColumnName("attendance_id");
                entity.Property(a => a.AttendanceDate).HasColumnName("attendance_date");
                entity.Property(a => a.CheckinTime).HasColumnName("checkin_time");
                entity.Property(a => a.CheckoutTime).HasColumnName("checkout_time");
                entity.Property(a => a.WorkingHours).HasColumnName("working_hours");
                entity.Property(a => a.IpCheckin).HasColumnName("IP_checkin").HasMaxLength(45);
                entity.Property(a => a.IpCheckout).HasColumnName("IP_checkout").HasMaxLength(45);
                entity.Property(a => a.CheckinLocationStatus).HasColumnName("checkin_location_status");
                entity.Property(a => a.CheckoutLocationStatus).HasColumnName("checkout_location_status");
                entity.Property(a => a.CreatedAt).HasColumnName("created_at");
                entity.Property(a => a.UpdatedAt).HasColumnName("updated_at");
                entity.Property(a => a.EmployeeId).HasColumnName("employee_id");
            });

            // ========== LeaveBalance Configuration ==========
            modelBuilder.Entity<LeaveBalance>(entity =>
            {
                entity.ToTable("LeaveBalance");
                entity.HasKey(lb => lb.LeaveBalanceId);

                entity.Property(lb => lb.LeaveBalanceId).HasColumnName("leave_balance_id");
                entity.Property(lb => lb.Year).HasColumnName("year");
                entity.Property(lb => lb.UsedLeave).HasColumnName("used_leave").HasDefaultValue(0);
                entity.Property(lb => lb.RemainingLeave).HasColumnName("remaining_leave");
                entity.Property(lb => lb.CreatedAt).HasColumnName("created_at");
                entity.Property(lb => lb.UpdatedAt).HasColumnName("updated_at");
                entity.Property(lb => lb.EmployeeId).HasColumnName("employee_id");
                entity.Property(lb => lb.LeaveTypeId).HasColumnName("leave_type_id");

                entity.HasOne(lb => lb.LeaveType)
                    .WithMany()
                    .HasForeignKey(lb => lb.LeaveTypeId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ========== PointAccount Configuration ==========
            modelBuilder.Entity<PointAccount>(entity =>
            {
                entity.ToTable("PointAccount");
                entity.HasKey(pa => pa.PointAccountId);
                entity.Property(pa => pa.PointAccountId).HasColumnName("point_account_id");
                entity.Property(pa => pa.CurrentPoints).HasColumnName("current_points");
                entity.Property(pa => pa.TotalPointsEarned).HasColumnName("total_earns");
                entity.Property(pa => pa.TotalPointsSpent).HasColumnName("total_transferred");
                entity.Property(pa => pa.CreatedAt).HasColumnName("created_at");
                entity.Property(pa => pa.UpdatedAt).HasColumnName("update_at");
            
            });

            // ========== Role Configuration ==========
            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("Role");
                entity.HasKey(r => r.RoleId);

                entity.Property(r => r.RoleId).HasColumnName("role_id");
                entity.Property(r => r.Name).HasColumnName("name").HasMaxLength(100).IsRequired();

                // ManyToMany: Role <-> Permission
                entity.HasMany(r => r.Permissions)
                    .WithMany()
                    .UsingEntity<Dictionary<string, object>>(
                        "RolePermission",
                        j => j.HasOne<Permission>().WithMany().HasForeignKey("permission_id"),
                        j => j.HasOne<Role>().WithMany().HasForeignKey("role_id"),
                        j => j.ToTable("Role_Permission"));
            });

            // ========== Permission Configuration ==========
            modelBuilder.Entity<Permission>(entity =>
            {
                entity.ToTable("Permission");
                entity.HasKey(p => p.PermissionId);

                entity.Property(p => p.PermissionId).HasColumnName("permission_id");
                entity.Property(p => p.PermissionName).HasColumnName("permission_name");
            });

            // ========== LeaveType Configuration ==========
            modelBuilder.Entity<LeaveType>(entity =>
            {
                entity.ToTable("LeaveType");
                entity.HasKey(lt => lt.LeaveTypeId);

                entity.Property(lt => lt.LeaveTypeId).HasColumnName("leave_type_id");
                entity.Property(lt => lt.LeaveTypeName).HasColumnName("leave_type_name");
            });

            // ==== Point Account ==
        }
    }
}