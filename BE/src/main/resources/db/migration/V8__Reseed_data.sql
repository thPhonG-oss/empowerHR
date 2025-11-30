-- ============================================
-- V8__Truncate_and_Reseed_Data.sql
-- Mục đích: Reset DB và seed dữ liệu số lượng lớn (~50-80 records/bảng)
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. CLEANUP DATA
TRUNCATE TABLE Role_Permission;
TRUNCATE TABLE Account_Role;
TRUNCATE TABLE LeaveRequest;
TRUNCATE TABLE TimesheetUpdateRequest;
TRUNCATE TABLE Request;
TRUNCATE TABLE LeaveBalance;
TRUNCATE TABLE Attendance;
TRUNCATE TABLE InvalidatedToken;
TRUNCATE TABLE StravaConnections;
TRUNCATE TABLE ParticipateIn;
TRUNCATE TABLE CashOut;
TRUNCATE TABLE ActivityReward;
TRUNCATE TABLE PerformanceReward;
TRUNCATE TABLE Transaction;
TRUNCATE TABLE PointAccount;
TRUNCATE TABLE MonthlyReward;
TRUNCATE TABLE DepartmentBudget;
TRUNCATE TABLE PointPolicy;
TRUNCATE TABLE ConversionRule;
TRUNCATE TABLE RunningActivity;
TRUNCATE TABLE Employee;
TRUNCATE TABLE Department;
TRUNCATE TABLE JobPosition;
TRUNCATE TABLE Bank;
TRUNCATE TABLE Account;
TRUNCATE TABLE Permission;
TRUNCATE TABLE Role;
TRUNCATE TABLE LeaveType;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 2. DICTIONARY DATA (Dữ liệu danh mục)
-- ============================================

-- Bank (20 banks)
INSERT INTO Bank (bank_name, branch, bank_account_number) VALUES
('Vietcombank', 'CN Hồ Chí Minh', '0071000123456'),
('Vietcombank', 'CN Hà Nội', '0011000123456'),
('Techcombank', 'CN Tân Bình', '19030001234501'),
('Techcombank', 'CN Quận 1', '19030001234502'),
('MBBank', 'CN Ba Đình', '0987654321001'),
('MBBank', 'CN Thủ Đức', '0987654321002'),
('ACB', 'CN Sài Gòn', '123456789001'),
('ACB', 'CN Đà Nẵng', '123456789002'),
('BIDV', 'CN Cầu Giấy', '2111000123456'),
('BIDV', 'CN Hoàn Kiếm', '2121000123456'),
('VPBank', 'CN Gia Định', '135792468001'),
('TPBank', 'CN Bến Thành', '024681357901'),
('Sacombank', 'CN Chợ Lớn', '060012345678'),
('VIB', 'CN Phú Nhuận', '601012345678'),
('HDBank', 'CN Đồng Nai', '068012345678'),
('Eximbank', 'CN Bình Dương', '101012345678'),
('OCB', 'CN Cần Thơ', '004012345678'),
('MSB', 'CN Hải Phòng', '030012345678'),
('SHB', 'CN Vinh', '100012345678'),
('Vietinbank', 'CN Huế', '101010101010');

-- JobPosition (15 positions)
INSERT INTO JobPosition (position_name) VALUES
('CEO'), ('CTO'), ('CFO'),
('HR Manager'), ('Department Manager'),
('Technical Lead'), ('Team Leader'),
('Senior Backend Developer'), ('Senior Frontend Developer'),
('Backend Developer'), ('Frontend Developer'),
('Business Analyst'), ('QC/Tester'),
('Accountant'), ('Intern');

-- LeaveType
INSERT INTO LeaveType (leave_type_name, total_day) VALUES
('Nghỉ phép năm', 12),
('Nghỉ ốm', 30),
('Nghỉ việc riêng có lương', 3),
('Nghỉ không lương', 365),
('Nghỉ thai sản', 180),
('Nghỉ kết hôn', 3),
('Nghỉ tang', 3);

-- Permission & Role
INSERT INTO Permission (name) VALUES
('VIEW_EMPLOYEE'), ('CREATE_EMPLOYEE'), ('UPDATE_EMPLOYEE'), ('DELETE_EMPLOYEE'),
('VIEW_ATTENDANCE'), ('CREATE_ATTENDANCE'), ('UPDATE_ATTENDANCE'), ('DELETE_ATTENDANCE'),
('VIEW_REQUEST'), ('APPROVE_REQUEST'), ('REJECT_REQUEST'), ('CREATE_REQUEST'),
('VIEW_RUNNING_ACTIVITY'), ('CREATE_RUNNING_ACTIVITY'), ('UPDATE_RUNNING_ACTIVITY'), ('DELETE_RUNNING_ACTIVITY'),
('VIEW_POINT_ACCOUNT'), ('MANAGE_POINT_POLICY'), ('VIEW_TRANSACTION'), ('CREATE_TRANSACTION'),
('MANAGE_DEPARTMENT'), ('MANAGE_POSITION'), ('VIEW_REPORT'), ('MANAGE_ROLE');

INSERT INTO Role (name) VALUES
('ADMIN'), ('HR_MANAGER'), ('DEPARTMENT_MANAGER'), ('EMPLOYEE'), ('INTERN'), ('MANAGER');

-- Role Permission Mapping
INSERT INTO Role_Permission (role_id, permission_id)
SELECT 1, permission_id FROM Permission; -- Admin full quyền

INSERT INTO Role_Permission (role_id, permission_id)
SELECT 2, permission_id FROM Permission WHERE name LIKE '%EMPLOYEE%' OR name LIKE '%ATTENDANCE%' OR name LIKE '%REQUEST%' OR name LIKE '%REPORT%'; -- HR Manager

-- ============================================
-- 3. CORE STRUCTURE (Department)
-- ============================================
-- Tạo 8 phòng ban (Manager NULL trước)
INSERT INTO Department (department_name, established_date, point_balance) VALUES
('Ban Giám Đốc', '2020-01-01', 500000),
('Phòng Nhân Sự', '2020-01-15', 200000),
('Phòng Kỹ Thuật 1', '2020-02-01', 300000),
('Phòng Kỹ Thuật 2', '2020-02-01', 300000),
('Phòng Kinh Doanh', '2020-03-01', 250000),
('Phòng Marketing', '2020-03-15', 250000),
('Phòng Tài Chính Kế Toán', '2020-04-01', 200000),
('Phòng Hành Chính', '2020-04-15', 150000);

-- ============================================
-- 4. ACCOUNTS (60 Accounts)
-- ============================================
-- Password hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy (password123)
-- Format: ID 1-10 (Lãnh đạo), 11-60 (Nhân viên)

INSERT INTO Account (username, password, account_status) VALUES
-- Board & Managers (1-10)
('ceo.director', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE), -- 1
('hr.manager', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),   -- 2
('tech.manager1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),-- 3
('tech.manager2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),-- 4
('sales.manager', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),-- 5
('mkt.manager', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),  -- 6
('finance.head', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE), -- 7
('admin.head', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),   -- 8
('cto.tech', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),     -- 9
('cfo.finance', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),   -- 10
-- Employees (11-60) - Tạo bằng vòng lặp giả lập bằng cách liệt kê
('emp.dev.01', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE), -- 11
('emp.dev.02', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.dev.03', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.dev.04', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.dev.05', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.dev.06', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.dev.07', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.dev.08', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.dev.09', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.dev.10', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE), -- 20
('emp.dev.11', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.dev.12', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.dev.13', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.dev.14', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.dev.15', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.ba.01', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.ba.02', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.ba.03', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.ba.04', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.tester.01', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE), -- 30
('emp.tester.02', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.tester.03', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.tester.04', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.sales.01', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.sales.02', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.sales.03', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.sales.04', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.sales.05', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.mkt.01', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.mkt.02', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE), -- 40
('emp.mkt.03', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.mkt.04', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.hr.01', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.hr.02', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.acc.01', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.acc.02', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.acc.03', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('intern.01', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('intern.02', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('intern.03', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE), -- 50
('intern.04', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('intern.05', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('intern.06', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('intern.07', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('intern.08', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('intern.09', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('intern.10', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.admin.01', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.admin.02', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('emp.admin.03', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE); -- 60

-- Account Role Mapping
INSERT INTO Account_Role (account_id, role_id) VALUES (1, 1), (9, 1), (10, 1); -- CEO, CTO, CFO -> Admin
INSERT INTO Account_Role (account_id, role_id) VALUES (2, 2); -- HR Manager -> HR_Manager
INSERT INTO Account_Role (account_id, role_id) VALUES (3, 3), (4, 3), (5, 3), (6, 3), (7, 3), (8, 3); -- Dept Managers
INSERT INTO Account_Role (account_id, role_id) SELECT account_id, 4 FROM Account WHERE account_id BETWEEN 11 AND 47 OR account_id BETWEEN 58 AND 60; -- Employee
INSERT INTO Account_Role (account_id, role_id) SELECT account_id, 5 FROM Account WHERE account_id BETWEEN 48 AND 57; -- Intern

-- ============================================
-- 5. EMPLOYEES (60 Employees mapped to Accounts)
-- ============================================
-- Lưu ý: ID Employee sẽ khớp với ID Account để dễ quản lý (1-60)
-- Dept 1: Board (1, 9, 10), Dept 2: HR (2, 43, 44), Dept 3: Tech 1 (3, 11-20), Dept 4: Tech 2 (4, 21-33), Dept 5: Sales (5, 34-38), Dept 6: MKT (6, 39-42), Dept 7: Finance (7, 45-47), Dept 8: Admin (8, 58-60)

INSERT INTO Employee
(employee_id, employee_code, employee_name, email, identity_card, gender, starting_date, position_id, department_id, account_id, bank_id, point_balance)
VALUES
-- Board
(1, 'EMP001', 'Nguyễn Văn CEO', 'ceo@company.com', '001090000001', 'Male', '2020-01-01', 1, 1, 1, 1, 5000),
(9, 'EMP009', 'Trần CTO', 'cto@company.com', '001090000009', 'Male', '2020-01-01', 2, 1, 9, 2, 4500),
(10, 'EMP010', 'Lê CFO', 'cfo@company.com', '001090000010', 'Female', '2020-01-01', 3, 1, 10, 3, 4500),
-- Managers
(2, 'EMP002', 'Phạm HR Manager', 'hr@company.com', '001090000002', 'Female', '2020-02-01', 4, 2, 2, 4, 3000),
(3, 'EMP003', 'Hoàng Tech Lead 1', 'tech1@company.com', '001090000003', 'Male', '2020-02-01', 5, 3, 3, 5, 3500),
(4, 'EMP004', 'Vũ Tech Lead 2', 'tech2@company.com', '001090000004', 'Male', '2020-02-01', 5, 4, 4, 6, 3500),
(5, 'EMP005', 'Đặng Sales Manager', 'sales@company.com', '001090000005', 'Male', '2020-03-01', 5, 5, 5, 7, 3200),
(6, 'EMP006', 'Bùi MKT Manager', 'mkt@company.com', '001090000006', 'Female', '2020-03-01', 5, 6, 6, 8, 3100),
(7, 'EMP007', 'Ngô Finance Head', 'fin@company.com', '001090000007', 'Male', '2020-04-01', 5, 7, 7, 9, 3000),
(8, 'EMP008', 'Dương Admin Head', 'admin@company.com', '001090000008', 'Female', '2020-04-01', 5, 8, 8, 10, 2800),
-- Staff Tech 1 (Senior/Junior Dev)
(11, 'EMP011', 'Dev 01', 'dev01@company.com', '001090000011', 'Male', '2021-01-01', 8, 3, 11, 11, 2000),
(12, 'EMP012', 'Dev 02', 'dev02@company.com', '001090000012', 'Male', '2021-01-01', 8, 3, 12, 12, 2000),
(13, 'EMP013', 'Dev 03', 'dev03@company.com', '001090000013', 'Male', '2021-05-01', 10, 3, 13, 13, 1500),
(14, 'EMP014', 'Dev 04', 'dev04@company.com', '001090000014', 'Female', '2021-05-01', 10, 3, 14, 14, 1500),
(15, 'EMP015', 'Dev 05', 'dev05@company.com', '001090000015', 'Male', '2022-01-01', 10, 3, 15, 15, 1500),
(16, 'EMP016', 'Dev 06', 'dev06@company.com', '001090000016', 'Male', '2022-01-01', 10, 3, 16, 16, 1500),
(17, 'EMP017', 'Dev 07', 'dev07@company.com', '001090000017', 'Female', '2022-06-01', 10, 3, 17, 17, 1500),
(18, 'EMP018', 'Dev 08', 'dev08@company.com', '001090000018', 'Male', '2022-06-01', 10, 3, 18, 18, 1500),
(19, 'EMP019', 'Dev 09', 'dev09@company.com', '001090000019', 'Male', '2023-01-01', 10, 3, 19, 19, 1200),
(20, 'EMP020', 'Dev 10', 'dev10@company.com', '001090000020', 'Female', '2023-01-01', 10, 3, 20, 20, 1200),
-- Staff Tech 2 (BA/Tester/Dev)
(21, 'EMP021', 'Dev 11', 'dev11@company.com', '001090000021', 'Male', '2021-02-01', 9, 4, 21, 1, 2000),
(22, 'EMP022', 'Dev 12', 'dev12@company.com', '001090000022', 'Female', '2021-02-01', 11, 4, 22, 2, 1500),
(23, 'EMP023', 'Dev 13', 'dev13@company.com', '001090000023', 'Male', '2021-02-01', 11, 4, 23, 3, 1500),
(24, 'EMP024', 'Dev 14', 'dev14@company.com', '001090000024', 'Male', '2022-03-01', 11, 4, 24, 4, 1500),
(25, 'EMP025', 'Dev 15', 'dev15@company.com', '001090000025', 'Female', '2022-03-01', 11, 4, 25, 5, 1500),
(26, 'EMP026', 'BA 01', 'ba01@company.com', '001090000026', 'Female', '2021-05-01', 12, 4, 26, 6, 1800),
(27, 'EMP027', 'BA 02', 'ba02@company.com', '001090000027', 'Male', '2021-05-01', 12, 4, 27, 7, 1800),
(28, 'EMP028', 'BA 03', 'ba03@company.com', '001090000028', 'Female', '2022-01-01', 12, 4, 28, 8, 1600),
(29, 'EMP029', 'BA 04', 'ba04@company.com', '001090000029', 'Male', '2022-01-01', 12, 4, 29, 9, 1600),
(30, 'EMP030', 'Tester 01', 'tester01@company.com', '001090000030', 'Female', '2021-06-01', 13, 4, 30, 10, 1500),
(31, 'EMP031', 'Tester 02', 'tester02@company.com', '001090000031', 'Male', '2021-06-01', 13, 4, 31, 11, 1500),
(32, 'EMP032', 'Tester 03', 'tester03@company.com', '001090000032', 'Female', '2022-02-01', 13, 4, 32, 12, 1400),
(33, 'EMP033', 'Tester 04', 'tester04@company.com', '001090000033', 'Male', '2022-02-01', 13, 4, 33, 13, 1400),
-- Staff Sales (34-38)
(34, 'EMP034', 'Sales 01', 'sales01@company.com', '001090000034', 'Male', '2021-03-01', 7, 5, 34, 14, 2200),
(35, 'EMP035', 'Sales 02', 'sales02@company.com', '001090000035', 'Female', '2021-03-01', 7, 5, 35, 15, 2200),
(36, 'EMP036', 'Sales 03', 'sales03@company.com', '001090000036', 'Male', '2022-04-01', 7, 5, 36, 16, 2000),
(37, 'EMP037', 'Sales 04', 'sales04@company.com', '001090000037', 'Female', '2022-04-01', 7, 5, 37, 17, 2000),
(38, 'EMP038', 'Sales 05', 'sales05@company.com', '001090000038', 'Male', '2023-05-01', 7, 5, 38, 18, 1800),
-- Staff MKT (39-42)
(39, 'EMP039', 'Mkt 01', 'mkt01@company.com', '001090000039', 'Female', '2021-04-01', 7, 6, 39, 19, 2100),
(40, 'EMP040', 'Mkt 02', 'mkt02@company.com', '001090000040', 'Male', '2021-04-01', 7, 6, 40, 20, 2100),
(41, 'EMP041', 'Mkt 03', 'mkt03@company.com', '001090000041', 'Female', '2022-05-01', 7, 6, 41, 1, 1900),
(42, 'EMP042', 'Mkt 04', 'mkt04@company.com', '001090000042', 'Male', '2022-05-01', 7, 6, 42, 2, 1900),
-- Staff HR (43-44)
(43, 'EMP043', 'HR Staff 1', 'hr1@company.com', '001090000043', 'Female', '2020-06-01', 7, 2, 43, 3, 1800),
(44, 'EMP044', 'HR Staff 2', 'hr2@company.com', '001090000044', 'Female', '2021-06-01', 7, 2, 44, 4, 1800),
-- Staff Finance (45-47)
(45, 'EMP045', 'Acc Staff 1', 'acc1@company.com', '001090000045', 'Female', '2020-07-01', 14, 7, 45, 5, 2000),
(46, 'EMP046', 'Acc Staff 2', 'acc2@company.com', '001090000046', 'Male', '2021-07-01', 14, 7, 46, 6, 2000),
(47, 'EMP047', 'Acc Staff 3', 'acc3@company.com', '001090000047', 'Female', '2022-07-01', 14, 7, 47, 7, 1800),
-- Interns (48-57)
(48, 'EMP048', 'Intern 1', 'int1@company.com', '001090000048', 'Male', '2024-01-01', 15, 3, 48, 8, 500),
(49, 'EMP049', 'Intern 2', 'int2@company.com', '001090000049', 'Female', '2024-01-01', 15, 3, 49, 9, 500),
(50, 'EMP050', 'Intern 3', 'int3@company.com', '001090000050', 'Male', '2024-02-01', 15, 4, 50, 10, 500),
(51, 'EMP051', 'Intern 4', 'int4@company.com', '001090000051', 'Female', '2024-02-01', 15, 4, 51, 11, 500),
(52, 'EMP052', 'Intern 5', 'int5@company.com', '001090000052', 'Male', '2024-03-01', 15, 5, 52, 12, 500),
(53, 'EMP053', 'Intern 6', 'int6@company.com', '001090000053', 'Female', '2024-03-01', 15, 6, 53, 13, 500),
(54, 'EMP054', 'Intern 7', 'int7@company.com', '001090000054', 'Male', '2024-04-01', 15, 2, 54, 14, 500),
(55, 'EMP055', 'Intern 8', 'int8@company.com', '001090000055', 'Female', '2024-04-01', 15, 7, 55, 15, 500),
(56, 'EMP056', 'Intern 9', 'int9@company.com', '001090000056', 'Male', '2024-05-01', 15, 3, 56, 16, 500),
(57, 'EMP057', 'Intern 10', 'int10@company.com', '001090000057', 'Female', '2024-05-01', 15, 4, 57, 17, 500),
-- Admin Staff (58-60)
(58, 'EMP058', 'Admin 1', 'admin1@company.com', '001090000058', 'Female', '2020-08-01', 7, 8, 58, 18, 1500),
(59, 'EMP059', 'Admin 2', 'admin2@company.com', '001090000059', 'Male', '2021-08-01', 7, 8, 59, 19, 1500),
(60, 'EMP060', 'Admin 3', 'admin3@company.com', '001090000060', 'Female', '2022-08-01', 7, 8, 60, 20, 1500);

-- ============================================
-- 6. UPDATE MANAGER FOR DEPARTMENTS
-- ============================================
UPDATE Department SET manager_id = 1 WHERE department_id = 1; -- CEO quản lý Board
UPDATE Department SET manager_id = 2 WHERE department_id = 2; -- HR
UPDATE Department SET manager_id = 3 WHERE department_id = 3; -- Tech 1
UPDATE Department SET manager_id = 4 WHERE department_id = 4; -- Tech 2
UPDATE Department SET manager_id = 5 WHERE department_id = 5; -- Sales
UPDATE Department SET manager_id = 6 WHERE department_id = 6; -- MKT
UPDATE Department SET manager_id = 7 WHERE department_id = 7; -- Finance
UPDATE Department SET manager_id = 8 WHERE department_id = 8; -- Admin

-- ============================================
-- 7. OPERATIONAL DATA (Attendance, Request, Points)
-- ============================================

-- Point Account (Init for 60 employees)
INSERT INTO PointAccount (current_points, total_earns, employee_id)
SELECT point_balance, point_balance + 500, employee_id FROM Employee;

-- Leave Balance 2024 (Init for 60 employees)
INSERT INTO LeaveBalance (year, used_leave, remaining_leave, employee_id, leave_type_id)
SELECT 2024, 0, 12, employee_id, 1 FROM Employee; -- 12 ngày phép

-- Conversion Rule
INSERT INTO ConversionRule (min_points, max_points, conversion_rate, is_begin_applied) VALUES
(0, 50000, 1.0, TRUE);
INSERT INTO PointPolicy (conversion_rule_id) VALUES (1);

-- Running Activity
INSERT INTO RunningActivity (title, status, registration_start_date, start_date, end_date, target_distance) VALUES
('Winter Run 2024', 'Active', '2024-11-01', '2024-11-15', '2024-12-31', '50km'),
('New Year Challenge', 'Draft', '2024-12-15', '2025-01-01', '2025-01-31', '100km');

-- ATTENDANCE (Tạo khoảng 60 record chấm công mẫu cho ngày 2024-11-20)
-- 50 người đi làm đúng giờ, 5 người muộn, 5 người quên checkout
INSERT INTO Attendance (attendance_date, checkin_time, checkout_time, working_hours, employee_id, checkin_location_status, checkout_location_status)
SELECT '2024-11-20', '08:00:00', '17:30:00', 8.5, employee_id, 'OnSite', 'OnSite'
FROM Employee WHERE employee_id BETWEEN 1 AND 50;

INSERT INTO Attendance (attendance_date, checkin_time, checkout_time, working_hours, employee_id, checkin_location_status, checkout_location_status)
SELECT '2024-11-20', '09:30:00', '17:30:00', 7.0, employee_id, 'OnSite', 'OnSite'
FROM Employee WHERE employee_id BETWEEN 51 AND 55; -- Đi muộn

INSERT INTO Attendance (attendance_date, checkin_time, checkout_time, working_hours, employee_id, checkin_location_status, checkout_location_status)
SELECT '2024-11-20', '08:00:00', NULL, NULL, employee_id, 'OnSite', 'Unknown'
FROM Employee WHERE employee_id BETWEEN 56 AND 60; -- Quên checkout

-- REQUEST (Tạo 20 requests)
-- 10 Leave Request (5 Approved, 3 Pending, 2 Rejected)
INSERT INTO Request (status, submit_at, reason, request_type, employee_id, handle_at, response_reason) VALUES
('Approved', '2024-11-01 09:00:00', 'Nghỉ phép', 'Leave', 11, '2024-11-01 10:00:00', 'OK'),
('Approved', '2024-11-02 09:00:00', 'Nghỉ ốm', 'Leave', 12, '2024-11-02 10:00:00', 'OK'),
('Approved', '2024-11-03 09:00:00', 'Nghỉ phép', 'Leave', 13, '2024-11-03 10:00:00', 'OK'),
('Approved', '2024-11-04 09:00:00', 'Việc nhà', 'Leave', 14, '2024-11-04 10:00:00', 'OK'),
('Approved', '2024-11-05 09:00:00', 'Du lịch', 'Leave', 15, '2024-11-05 10:00:00', 'OK'),
('Pending', '2024-11-25 09:00:00', 'Nghỉ phép', 'Leave', 16, NULL, NULL),
('Pending', '2024-11-25 09:00:00', 'Nghỉ ốm', 'Leave', 17, NULL, NULL),
('Pending', '2024-11-25 09:00:00', 'Việc riêng', 'Leave', 18, NULL, NULL),
('Rejected', '2024-11-10 09:00:00', 'Đi chơi', 'Leave', 19, '2024-11-10 11:00:00', 'Nhân sự thiếu'),
('Rejected', '2024-11-10 09:00:00', 'Ngủ quên', 'Leave', 20, '2024-11-10 11:00:00', 'Không hợp lý');

-- Map Leave Request detail (ID 1-10 khớp với Request ID auto increment nếu bảng rỗng, nhưng để chắc chắn ta dùng logic giả định ID 1-10)
INSERT INTO LeaveRequest (request_id, start_date, end_date, leave_type_id) VALUES
(1, '2024-11-10', '2024-11-11', 1), (2, '2024-11-12', '2024-11-12', 2),
(3, '2024-11-13', '2024-11-15', 1), (4, '2024-11-16', '2024-11-16', 3),
(5, '2024-11-20', '2024-11-25', 1), (6, '2024-12-01', '2024-12-02', 1),
(7, '2024-12-05', '2024-12-05', 2), (8, '2024-12-10', '2024-12-10', 3),
(9, '2024-11-11', '2024-11-11', 1), (10, '2024-11-11', '2024-11-11', 1);

-- 10 Timesheet Request (Fix công)
INSERT INTO Request (status, submit_at, reason, request_type, employee_id) VALUES
('Pending', '2024-11-21 08:00:00', 'Quên checkin', 'TimesheetUpdate', 56),
('Pending', '2024-11-21 08:00:00', 'Quên checkin', 'TimesheetUpdate', 57),
('Approved', '2024-11-21 08:00:00', 'Máy lỗi', 'TimesheetUpdate', 58),
('Approved', '2024-11-21 08:00:00', 'Máy lỗi', 'TimesheetUpdate', 59),
('Pending', '2024-11-21 08:00:00', 'Quên checkout', 'TimesheetUpdate', 60);

INSERT INTO TimesheetUpdateRequest (request_id, attendance_date, checkin_time, checkout_time) VALUES
(11, '2024-11-20', '08:00:00', NULL), (12, '2024-11-20', '08:00:00', NULL),
(13, '2024-11-20', '08:00:00', NULL), (14, '2024-11-20', '08:00:00', NULL),
(15, '2024-11-20', NULL, '17:30:00');