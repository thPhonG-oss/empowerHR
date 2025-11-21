-- ============================================
-- V2__Seeding_Data.sql
-- Khởi tạo dữ liệu mẫu cho hệ thống quản lý nhân sự
-- ============================================

-- ============================================
-- Seeding Bank
-- ============================================
INSERT INTO Bank (bank_name, branch, bank_account_number) VALUES
('Vietcombank', 'Chi nhánh Đồng Khởi', '0011000123456'),
('Vietcombank', 'Chi nhánh Thủ Đức', '0011000234567'),
('Techcombank', 'Chi nhánh Tân Bình', '19036852147001'),
('Techcombank', 'Chi nhánh Quận 1', '19036852147002'),
('VietinBank', 'Chi nhánh Hà Nội', '100873456789'),
('VietinBank', 'Chi nhánh TP.HCM', '100873456790'),
('BIDV', 'Chi nhánh Cầu Giấy', '26110000123456'),
('BIDV', 'Chi nhánh Hai Bà Trưng', '26110000234567'),
('ACB', 'Chi nhánh Hải Phòng', '123456789012'),
('ACB', 'Chi nhánh Đà Nẵng', '123456789013'),
('MBBank', 'Chi nhánh Nam Sài Gòn', '0123456789001'),
('MBBank', 'Chi nhánh Bắc Sài Gòn', '0123456789002'),
('Sacombank', 'Chi nhánh Bình Thạnh', '060123456789'),
('Sacombank', 'Chi nhánh Phú Nhuận', '060123456790'),
('VPBank', 'Chi nhánh Hồ Chí Minh', '123456780001'),
('VPBank', 'Chi nhánh Hà Nội', '123456780002'),
('TPBank', 'Chi nhánh Cầu Giấy', '01234567890123'),
('TPBank', 'Chi nhánh Đống Đa', '01234567890124'),
('HDBank', 'Chi nhánh Quận 3', '012345678901234'),
('HDBank', 'Chi nhánh Quận 7', '012345678901235'),
('SHB', 'Chi nhánh Thanh Xuân', '1234567890'),
('SHB', 'Chi nhánh Long Biên', '1234567891'),
('OCB', 'Chi nhánh Hoàn Kiếm', '0123456789'),
('OCB', 'Chi nhánh Ba Đình', '0123456790'),
('LienVietPostBank', 'Chi nhánh Tây Hồ', '9876543210001'),
('LienVietPostBank', 'Chi nhánh Cầu Giấy', '9876543210002'),
('Maritime Bank', 'Chi nhánh Hải Phòng', '0012345678901'),
('Maritime Bank', 'Chi nhánh Quảng Ninh', '0012345678902'),
('VIB', 'Chi nhánh Biên Hòa', '987654321001'),
('VIB', 'Chi nhánh Vũng Tàu', '987654321002');

-- ============================================
-- Seeding Permission
-- ============================================
INSERT INTO Permission (name) VALUES
('VIEW_EMPLOYEE'),
('CREATE_EMPLOYEE'),
('UPDATE_EMPLOYEE'),
('DELETE_EMPLOYEE'),
('VIEW_ATTENDANCE'),
('CREATE_ATTENDANCE'),
('UPDATE_ATTENDANCE'),
('DELETE_ATTENDANCE'),
('VIEW_REQUEST'),
('APPROVE_REQUEST'),
('REJECT_REQUEST'),
('CREATE_REQUEST'),
('VIEW_RUNNING_ACTIVITY'),
('CREATE_RUNNING_ACTIVITY'),
('UPDATE_RUNNING_ACTIVITY'),
('DELETE_RUNNING_ACTIVITY'),
('VIEW_POINT_ACCOUNT'),
('MANAGE_POINT_POLICY'),
('VIEW_TRANSACTION'),
('CREATE_TRANSACTION'),
('MANAGE_DEPARTMENT'),
('MANAGE_POSITION'),
('VIEW_REPORT'),
('MANAGE_ROLE');

-- ============================================
-- Seeding Role
-- ============================================
INSERT INTO Role (name) VALUES
('ADMIN'),
('HR_MANAGER'),
('DEPARTMENT_MANAGER'),
('EMPLOYEE'),
('INTERN');

-- ============================================
-- Seeding Role_Permission
-- ============================================
-- ADMIN có tất cả quyền
INSERT INTO Role_Permission (role_id, permission_id)
SELECT 1, permission_id FROM Permission;

-- HR_MANAGER
INSERT INTO Role_Permission (role_id, permission_id) VALUES
(2, 1), (2, 2), (2, 3), (2, 4),
(2, 5), (2, 6), (2, 7), (2, 8),
(2, 9), (2, 10), (2, 11),
(2, 13), (2, 14), (2, 15), (2, 16),
(2, 17), (2, 18), (2, 19), (2, 20),
(2, 21), (2, 22), (2, 23);

-- DEPARTMENT_MANAGER
INSERT INTO Role_Permission (role_id, permission_id) VALUES
(3, 1), (3, 3),
(3, 5), (3, 7),
(3, 9), (3, 10), (3, 11),
(3, 13), (3, 17), (3, 19), (3, 23);

-- EMPLOYEE
INSERT INTO Role_Permission (role_id, permission_id) VALUES
(4, 1), (4, 5), (4, 9), (4, 12), (4, 13), (4, 17), (4, 19);

-- INTERN
INSERT INTO Role_Permission (role_id, permission_id) VALUES
(5, 1), (5, 5), (5, 9), (5, 12), (5, 13);

-- ============================================
-- Seeding Account
-- ============================================
-- Password được hash bằng BCrypt (mật khẩu: password123)
INSERT INTO Account (username, password, role_id) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1),
('hr_manager1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2),
('hr_manager2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2),
('dept_manager1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3),
('dept_manager2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3),
('dept_manager3', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3),
('dept_manager4', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3),
('nguyen.van.a', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('tran.thi.b', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('le.van.c', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('pham.thi.d', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('hoang.van.e', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('vu.thi.f', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('do.van.g', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('bui.thi.h', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('dang.van.i', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('nguyen.thi.k', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('tran.van.l', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('le.thi.m', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('pham.van.n', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('hoang.thi.o', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('vu.van.p', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('do.thi.q', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('bui.van.r', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('dang.thi.s', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('nguyen.van.t', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('tran.thi.u', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('le.van.v', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('pham.thi.w', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('hoang.van.x', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('vu.thi.y', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('do.van.z', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('intern1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 5),
('intern2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 5),
('intern3', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 5),
('intern4', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 5),
('intern5', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 5),
('intern6', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 5),
('nguyen.van.aa', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('tran.thi.bb', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('le.van.cc', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('pham.thi.dd', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('hoang.van.ee', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('vu.thi.ff', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('do.van.gg', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('bui.thi.hh', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('dang.van.ii', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4),
('nguyen.thi.jj', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4);

-- ============================================
-- Seeding Account_Role
-- ============================================
INSERT INTO Account_Role (account_id, role_id)
SELECT account_id, role_id FROM Account WHERE role_id IS NOT NULL;

-- ============================================
-- Seeding JobPosition
-- ============================================
INSERT INTO JobPosition (position_name) VALUES
('CEO'),
('CTO'),
('CFO'),
('HR Manager'),
('Department Manager'),
('Team Leader'),
('Senior Software Engineer'),
('Software Engineer'),
('Junior Software Engineer'),
('Senior Business Analyst'),
('Business Analyst'),
('Junior Business Analyst'),
('Senior QA Engineer'),
('QA Engineer'),
('Junior QA Engineer'),
('Senior Designer'),
('Designer'),
('Junior Designer'),
('DevOps Engineer'),
('Data Analyst'),
('Product Manager'),
('Project Manager'),
('Marketing Manager'),
('Sales Manager'),
('Accountant'),
('HR Specialist'),
('Receptionist'),
('Intern');

-- ============================================
-- Seeding Department
-- ============================================
INSERT INTO Department (department_name, established_date, point_balance) VALUES
('Ban Giám Đốc', '2020-01-01', 50000.00),
('Phòng Nhân Sự', '2020-02-01', 30000.00),
('Phòng Kỹ Thuật', '2020-02-15', 80000.00),
('Phòng Kinh Doanh', '2020-03-01', 45000.00),
('Phòng Marketing', '2020-03-15', 35000.00),
('Phòng Kế Toán', '2020-04-01', 25000.00),
('Phòng Hành Chính', '2020-04-15', 20000.00);

-- ============================================
-- Seeding Employee (50 nhân viên)
-- ============================================
INSERT INTO Employee (employee_code, employee_name, identity_card, address, date_of_birth, gender, email, phone_number, starting_date, is_active, tax_code, point_balance, account_id, position_id, department_id, bank_id) VALUES
('EMP001', 'Nguyễn Văn An', '001234567890', '123 Nguyễn Huệ, Q1, TP.HCM', '1985-03-15', 'Male', 'admin@company.com', '0901234567', '2020-01-15', TRUE, 'TAX001', 5000.00, 1, 1, 1, 1),
('EMP002', 'Trần Thị Bình', '001234567891', '456 Lê Lợi, Q1, TP.HCM', '1987-05-20', 'Female', 'hr.manager1@company.com', '0901234568', '2020-02-01', TRUE, 'TAX002', 3500.00, 2, 4, 2, 2),
('EMP003', 'Lê Văn Cường', '001234567892', '789 Hai Bà Trưng, Q3, TP.HCM', '1988-07-10', 'Male', 'hr.manager2@company.com', '0901234569', '2020-02-15', TRUE, 'TAX003', 3200.00, 3, 4, 2, 3),
('EMP004', 'Phạm Thị Dung', '001234567893', '321 Võ Văn Tần, Q3, TP.HCM', '1986-09-25', 'Female', 'dept.manager1@company.com', '0901234570', '2020-03-01', TRUE, 'TAX004', 4500.00, 4, 5, 3, 4),
('EMP005', 'Hoàng Văn Em', '001234567894', '654 Điện Biên Phủ, Bình Thạnh, TP.HCM', '1989-11-12', 'Male', 'dept.manager2@company.com', '0901234571', '2020-03-15', TRUE, 'TAX005', 4200.00, 5, 5, 4, 5),
('EMP006', 'Vũ Thị Phượng', '001234567895', '987 Cách Mạng Tháng 8, Q10, TP.HCM', '1990-01-08', 'Female', 'dept.manager3@company.com', '0901234572', '2020-04-01', TRUE, 'TAX006', 4000.00, 6, 5, 5, 6),
('EMP007', 'Đỗ Văn Giang', '001234567896', '147 Nguyễn Thái Học, Q1, TP.HCM', '1991-03-22', 'Male', 'dept.manager4@company.com', '0901234573', '2020-04-15', TRUE, 'TAX007', 3800.00, 7, 5, 6, 7),
('EMP008', 'Bùi Thị Hoa', '001234567897', '258 Lý Thường Kiệt, Q10, TP.HCM', '1992-05-14', 'Female', 'nguyen.van.a@company.com', '0901234574', '2020-05-01', TRUE, 'TAX008', 2800.00, 8, 7, 3, 8),
('EMP009', 'Đặng Văn Ích', '001234567898', '369 Trần Hưng Đạo, Q5, TP.HCM', '1993-07-19', 'Male', 'tran.thi.b@company.com', '0901234575', '2020-05-15', TRUE, 'TAX009', 2500.00, 9, 8, 3, 9),
('EMP010', 'Nguyễn Thị Kim', '001234567899', '741 Hoàng Văn Thụ, Tân Bình, TP.HCM', '1994-09-30', 'Female', 'le.van.c@company.com', '0901234576', '2020-06-01', TRUE, 'TAX010', 2300.00, 10, 8, 3, 10),
('EMP011', 'Trần Văn Long', '001234567900', '852 Cộng Hòa, Tân Bình, TP.HCM', '1991-02-11', 'Male', 'pham.thi.d@company.com', '0901234577', '2020-06-15', TRUE, 'TAX011', 2000.00, 11, 9, 3, 11),
('EMP012', 'Lê Thị Mai', '001234567901', '963 Trường Chinh, Q12, TP.HCM', '1992-04-28', 'Female', 'hoang.van.e@company.com', '0901234578', '2020-07-01', TRUE, 'TAX012', 1800.00, 12, 9, 3, 12),
('EMP013', 'Phạm Văn Nam', '001234567902', '159 Quang Trung, Gò Vấp, TP.HCM', '1993-06-17', 'Male', 'vu.thi.f@company.com', '0901234579', '2020-07-15', TRUE, 'TAX013', 2600.00, 13, 11, 4, 13),
('EMP014', 'Hoàng Thị Oanh', '001234567903', '357 Phan Văn Trị, Gò Vấp, TP.HCM', '1994-08-09', 'Female', 'do.van.g@company.com', '0901234580', '2020-08-01', TRUE, 'TAX014', 2400.00, 14, 11, 4, 14),
('EMP015', 'Vũ Văn Phúc', '001234567904', '486 Lê Văn Việt, Q9, TP.HCM', '1995-10-23', 'Male', 'bui.thi.h@company.com', '0901234581', '2020-08-15', TRUE, 'TAX015', 2100.00, 15, 12, 4, 15),
('EMP016', 'Đỗ Thị Quỳnh', '001234567905', '597 Xa Lộ Hà Nội, Q9, TP.HCM', '1990-12-05', 'Female', 'dang.van.i@company.com', '0901234582', '2020-09-01', TRUE, 'TAX016', 2700.00, 16, 13, 3, 16),
('EMP017', 'Bùi Văn Rồng', '001234567906', '678 Nguyễn Oanh, Gò Vấp, TP.HCM', '1991-01-16', 'Male', 'nguyen.thi.k@company.com', '0901234583', '2020-09-15', TRUE, 'TAX017', 2400.00, 17, 14, 3, 17),
('EMP018', 'Đặng Thị Sen', '001234567907', '789 Tô Hiến Thành, Q10, TP.HCM', '1992-03-27', 'Female', 'tran.van.l@company.com', '0901234584', '2020-10-01', TRUE, 'TAX018', 2200.00, 18, 14, 3, 18),
('EMP019', 'Nguyễn Văn Tùng', '001234567908', '890 Nguyễn Kiệm, Phú Nhuận, TP.HCM', '1993-05-13', 'Male', 'le.thi.m@company.com', '0901234585', '2020-10-15', TRUE, 'TAX019', 2000.00, 19, 15, 3, 19),
('EMP020', 'Trần Thị Uyên', '001234567909', '901 Phan Đăng Lưu, Phú Nhuận, TP.HCM', '1994-07-21', 'Female', 'pham.van.n@company.com', '0901234586', '2020-11-01', TRUE, 'TAX020', 2900.00, 20, 16, 5, 20),
('EMP021', 'Lê Văn Việt', '001234567910', '112 Ba Tháng Hai, Q10, TP.HCM', '1995-09-04', 'Male', 'hoang.thi.o@company.com', '0901234587', '2020-11-15', TRUE, 'TAX021', 2600.00, 21, 17, 5, 21),
('EMP022', 'Phạm Thị Xuân', '001234567911', '223 Nguyễn Đình Chiểu, Q3, TP.HCM', '1990-11-18', 'Female', 'vu.van.p@company.com', '0901234588', '2020-12-01', TRUE, 'TAX022', 2300.00, 22, 17, 5, 22),
('EMP023', 'Hoàng Văn Yên', '001234567912', '334 Võ Thị Sáu, Q3, TP.HCM', '1991-02-26', 'Male', 'do.thi.q@company.com', '0901234589', '2020-12-15', TRUE, 'TAX023', 2100.00, 23, 18, 5, 23),
('EMP024', 'Vũ Thị Zung', '001234567913', '445 Nam Kỳ Khởi Nghĩa, Q3, TP.HCM', '1992-04-08', 'Female', 'bui.van.r@company.com', '0901234590', '2021-01-15', TRUE, 'TAX024', 3200.00, 24, 19, 3, 24),
('EMP025', 'Đỗ Văn An', '001234567914', '556 Hai Bà Trưng, Q1, TP.HCM', '1993-06-15', 'Male', 'dang.thi.s@company.com', '0901234591', '2021-02-01', TRUE, 'TAX025', 2900.00, 25, 20, 4, 25),
('EMP026', 'Bùi Thị Bích', '001234567915', '667 Lý Tự Trọng, Q1, TP.HCM', '1994-08-29', 'Female', 'nguyen.van.t@company.com', '0901234592', '2021-02-15', TRUE, 'TAX026', 2700.00, 26, 21, 4, 26),
('EMP027', 'Đặng Văn Cường', '001234567916', '778 Pasteur, Q1, TP.HCM', '1995-10-11', 'Male', 'tran.thi.u@company.com', '0901234593', '2021-03-01', TRUE, 'TAX027', 2500.00, 27, 22, 4, 27),
('EMP028', 'Nguyễn Thị Duyên', '001234567917', '889 Nguyễn Trãi, Q5, TP.HCM', '1990-12-24', 'Female', 'le.van.v@company.com', '0901234594', '2021-03-15', TRUE, 'TAX028', 3100.00, 28, 23, 5, 28),
('EMP029', 'Trần Văn Ế', '001234567918', '990 Nguyễn Thị Minh Khai, Q3, TP.HCM', '1991-01-30', 'Male', 'pham.thi.w@company.com', '0901234595', '2021-04-01', TRUE, 'TAX029', 2800.00, 29, 24, 4, 29),
('EMP030', 'Lê Thị Phương', '001234567919', '101 Đinh Tiên Hoàng, Q1, TP.HCM', '1992-03-19', 'Female', 'hoang.van.x@company.com', '0901234596', '2021-04-15', TRUE, 'TAX030', 2600.00, 30, 25, 6, 30),
('EMP031', 'Phạm Văn Giang', '001234567920', '202 Lê Duẩn, Q1, TP.HCM', '1993-05-07', 'Male', 'vu.thi.y@company.com', '0901234597', '2021-05-01', TRUE, 'TAX031', 2300.00, 31, 26, 2, 1),
('EMP032', 'Hoàng Thị Hương', '001234567921', '303 Nguyễn Văn Cừ, Q5, TP.HCM', '1994-07-14', 'Female', 'do.van.z@company.com', '0901234598', '2021-05-15', TRUE, 'TAX032', 2100.00, 32, 27, 7, 2),
('EMP033', 'Vũ Văn Iêm', '001234567922', '404 Tôn Đức Thắng, Q1, TP.HCM', '1995-09-22', 'Male', 'intern1@company.com', '0901234599', '2024-01-15', TRUE, 'TAX033', 500.00, 33, 28, 3, 3),
('EMP034', 'Đỗ Thị Khánh', '001234567923', '505 Bến Chương Dương, Q1, TP.HCM', '1996-11-03', 'Female', 'intern2@company.com', '0901234600', '2024-01-15', TRUE, 'TAX034', 500.00, 34, 28, 3, 4),
('EMP035', 'Bùi Văn Lâm', '001234567924', '606 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM', '1997-01-12', 'Male', 'intern3@company.com', '0901234601', '2024-02-01', TRUE, 'TAX035', 500.00, 35, 28, 4, 5),
('EMP036', 'Đặng Thị Minh', '001234567925', '707 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM', '1996-03-28', 'Female', 'intern4@company.com', '0901234602', '2024-02-01', TRUE, 'TAX036', 500.00, 36, 28, 5, 6),
('EMP037', 'Nguyễn Văn Năm', '001234567926', '808 Ung Văn Khiêm, Bình Thạnh, TP.HCM', '1997-05-15', 'Male', 'intern5@company.com', '0901234603', '2024-03-01', TRUE, 'TAX037', 500.00, 37, 28, 2, 7),
('EMP038', 'Trần Thị Oanh', '001234567927', '909 Bạch Đằng, Bình Thạnh, TP.HCM', '1996-07-20', 'Female', 'intern6@company.com', '0901234604', '2024-03-01', TRUE, 'TAX038', 500.00, 38, 28, 6, 8),
('EMP039', 'Lê Văn Phương', '001234567928', '121 Nguyễn Xí, Bình Thạnh, TP.HCM', '1989-09-16', 'Male', 'nguyen.van.aa@company.com', '0901234605', '2021-06-01', TRUE, 'TAX039', 2800.00, 39, 8, 3, 9),
('EMP040', 'Phạm Thị Quý', '001234567929', '232 Phan Văn Hân, Bình Thạnh, TP.HCM', '1990-11-08', 'Female', 'tran.thi.bb@company.com', '0901234606', '2021-06-15', TRUE, 'TAX040', 2500.00, 40, 8, 3, 10),
('EMP041', 'Hoàng Văn Rộng', '001234567930', '343 Đinh Bộ Lĩnh, Bình Thạnh, TP.HCM', '1991-02-27', 'Male', 'le.van.cc@company.com', '0901234607', '2021-07-01', TRUE, 'TAX041', 2300.00, 41, 9, 3, 11),
('EMP042', 'Vũ Thị Sáng', '001234567931', '454 Nơ Trang Long, Bình Thạnh, TP.HCM', '1992-04-18', 'Female', 'pham.thi.dd@company.com', '0901234608', '2021-07-15', TRUE, 'TAX042', 2100.00, 42, 9, 3, 12),
('EMP043', 'Đỗ Văn Thành', '001234567932', '565 Bùi Đình Túy, Bình Thạnh, TP.HCM', '1993-06-09', 'Male', 'hoang.van.ee@company.com', '0901234609', '2021-08-01', TRUE, 'TAX043', 2600.00, 43, 11, 4, 13),
('EMP044', 'Bùi Thị Uyên', '001234567933', '676 Lý Chính Thắng, Q3, TP.HCM', '1994-08-25', 'Female', 'vu.thi.ff@company.com', '0901234610', '2021-08-15', TRUE, 'TAX044', 2400.00, 44, 12, 4, 14),
('EMP045', 'Đặng Văn Vinh', '001234567934', '787 Trần Quang Khải, Q1, TP.HCM', '1995-10-14', 'Male', 'do.van.gg@company.com', '0901234611', '2021-09-01', TRUE, 'TAX045', 2700.00, 45, 14, 3, 15),
('EMP046', 'Nguyễn Thị Xuân', '001234567935', '898 Lê Thánh Tôn, Q1, TP.HCM', '1990-12-30', 'Female', 'bui.thi.hh@company.com', '0901234612', '2021-09-15', TRUE, 'TAX046', 2500.00, 46, 17, 5, 16),
('EMP047', 'Trần Văn Yên', '001234567936', '909 Mạc Đĩnh Chi, Q1, TP.HCM', '1991-02-11', 'Male', 'dang.van.ii@company.com', '0901234613', '2021-10-01', TRUE, 'TAX047', 2200.00, 47, 18, 5, 17),
('EMP048', 'Lê Thị Zun', '001234567937', '121 Hồ Tùng Mậu, Q1, TP.HCM', '1992-04-22', 'Female', 'nguyen.thi.jj@company.com', '0901234614', '2021-10-15', TRUE, 'TAX048', 2000.00, 48, 8, 3, 18),
('EMP049', 'Phạm Văn An Bình', '001234567938', '232 Trần Cao Vân, Q1, TP.HCM', '1993-06-05', 'Male', 'emp049@company.com', '0901234615', '2021-11-01', TRUE, 'TAX049', 2300.00, NULL, 9, 3, 19),
('EMP050', 'Hoàng Thị Bích Ngọc', '001234567939', '343 Đồng Khởi, Q1, TP.HCM', '1994-08-17', 'Female', 'emp050@company.com', '0901234616', '2021-11-15', TRUE, 'TAX050', 2100.00, NULL, 11, 4, 20);

-- ============================================
-- Seeding LeaveType
-- ============================================
INSERT INTO LeaveType (leave_type_name, total_day) VALUES
('Nghỉ phép năm', 12),
('Nghỉ ốm', 30),
('Nghỉ việc riêng có lương', 3),
('Nghỉ việc riêng không lương', 365),
('Nghỉ thai sản', 180),
('Nghỉ hiếu', 3),
('Nghỉ hỷ', 3);

-- ============================================
-- Seeding LeaveBalance
-- ============================================
INSERT INTO LeaveBalance (year, used_leave, remaining_leave, employee_id, leave_type_id) VALUES
-- Năm 2024 - Nghỉ phép năm (12 ngày)
(2024, 3, 9, 1, 1), (2024, 2, 10, 2, 1), (2024, 5, 7, 3, 1), (2024, 4, 8, 4, 1),
(2024, 1, 11, 5, 1), (2024, 6, 6, 6, 1), (2024, 3, 9, 7, 1), (2024, 2, 10, 8, 1),
(2024, 4, 8, 9, 1), (2024, 5, 7, 10, 1), (2024, 3, 9, 11, 1), (2024, 1, 11, 12, 1),
(2024, 7, 5, 13, 1), (2024, 4, 8, 14, 1), (2024, 2, 10, 15, 1), (2024, 5, 7, 16, 1),
(2024, 3, 9, 17, 1), (2024, 6, 6, 18, 1), (2024, 4, 8, 19, 1), (2024, 2, 10, 20, 1),
(2024, 5, 7, 21, 1), (2024, 3, 9, 22, 1), (2024, 1, 11, 23, 1), (2024, 4, 8, 24, 1),
(2024, 6, 6, 25, 1), (2024, 3, 9, 26, 1), (2024, 2, 10, 27, 1), (2024, 5, 7, 28, 1),
(2024, 4, 8, 29, 1), (2024, 3, 9, 30, 1), (2024, 1, 11, 31, 1), (2024, 2, 10, 32, 1),
(2024, 0, 12, 33, 1), (2024, 0, 12, 34, 1), (2024, 0, 12, 35, 1), (2024, 0, 12, 36, 1),
(2024, 0, 12, 37, 1), (2024, 0, 12, 38, 1), (2024, 5, 7, 39, 1), (2024, 4, 8, 40, 1),
(2024, 3, 9, 41, 1), (2024, 2, 10, 42, 1), (2024, 6, 6, 43, 1), (2024, 3, 9, 44, 1),
(2024, 4, 8, 45, 1), (2024, 5, 7, 46, 1), (2024, 2, 10, 47, 1), (2024, 3, 9, 48, 1),
(2024, 1, 11, 49, 1), (2024, 4, 8, 50, 1),
-- Năm 2024 - Nghỉ ốm (30 ngày)
(2024, 2, 28, 1, 2), (2024, 1, 29, 2, 2), (2024, 0, 30, 3, 2), (2024, 3, 27, 4, 2),
(2024, 1, 29, 5, 2), (2024, 0, 30, 6, 2), (2024, 2, 28, 7, 2), (2024, 1, 29, 8, 2),
(2024, 0, 30, 9, 2), (2024, 2, 28, 10, 2);

-- ============================================
-- Seeding Request
-- ============================================
INSERT INTO Request (status, submit_at, reason, request_type, handle_at, response_reason, employee_id) VALUES
('Approved', '2024-10-01 09:00:00', 'Nghỉ phép du lịch gia đình', 'Leave', '2024-10-01 14:30:00', 'Đã duyệt', 8),
('Approved', '2024-10-05 10:15:00', 'Nghỉ ốm do cảm cúm', 'Leave', '2024-10-05 15:20:00', 'Đã duyệt', 9),
('Approved', '2024-10-10 08:30:00', 'Việc gia đình đột xuất', 'Leave', '2024-10-10 16:00:00', 'Đã duyệt', 10),
('Rejected', '2024-10-12 11:00:00', 'Nghỉ phép cá nhân', 'Leave', '2024-10-12 14:00:00', 'Không đủ ngày phép', 11),
('Approved', '2024-10-15 09:45:00', 'Quên chấm công ngày 14/10', 'TimesheetUpdate', '2024-10-15 13:00:00', 'Đã xác nhận với bảo vệ', 12),
('Pending', '2024-11-18 10:00:00', 'Nghỉ phép năm', 'Leave', NULL, NULL, 13),
('Approved', '2024-10-20 14:30:00', 'Đi khám bệnh định kỳ', 'Leave', '2024-10-20 16:45:00', 'Đã duyệt', 14),
('Approved', '2024-10-25 08:00:00', 'Quên checkout ngày 24/10', 'TimesheetUpdate', '2024-10-25 11:30:00', 'Đã duyệt', 15),
('Cancelled', '2024-10-28 09:30:00', 'Nghỉ việc riêng', 'Leave', NULL, NULL, 16),
('Approved', '2024-11-01 10:45:00', 'Tham gia đám cưới người thân', 'Leave', '2024-11-01 15:00:00', 'Đã duyệt', 17),
('Approved', '2024-11-03 08:15:00', 'Quên checkin ngày 02/11', 'TimesheetUpdate', '2024-11-03 12:00:00', 'Đã duyệt', 18),
('Pending', '2024-11-19 09:00:00', 'Nghỉ ốm', 'Leave', NULL, NULL, 19),
('Approved', '2024-11-05 11:30:00', 'Nghỉ phép năm', 'Leave', '2024-11-05 14:45:00', 'Đã duyệt', 20),
('Rejected', '2024-11-08 10:00:00', 'Quên chấm công ngày 07/11', 'TimesheetUpdate', '2024-11-08 15:30:00', 'Không có bằng chứng xác thực', 21),
('Approved', '2024-11-10 09:15:00', 'Nghỉ việc riêng có lương', 'Leave', '2024-11-10 13:20:00', 'Đã duyệt', 22);

-- ============================================
-- Seeding LeaveRequest
-- ============================================
INSERT INTO LeaveRequest (request_id, start_date, end_date, proof_document, leave_type_id) VALUES
(1, '2024-10-15', '2024-10-17', 'ticket_booking.pdf', 1),
(2, '2024-10-08', '2024-10-09', 'medical_certificate.pdf', 2),
(3, '2024-10-14', '2024-10-16', NULL, 3),
(4, '2024-10-18', '2024-10-20', NULL, 1),
(6, '2024-11-22', '2024-11-25', NULL, 1),
(7, '2024-10-23', '2024-10-23', 'hospital_report.pdf', 2),
(9, '2024-11-02', '2024-11-03', NULL, 4),
(10, '2024-11-05', '2024-11-06', 'wedding_invitation.pdf', 7),
(12, '2024-11-21', '2024-11-22', 'medical_certificate_2.pdf', 2),
(13, '2024-11-12', '2024-11-14', NULL, 1),
(15, '2024-11-13', '2024-11-13', NULL, 3);

-- ============================================
-- Seeding TimesheetUpdateRequest
-- ============================================
INSERT INTO TimesheetUpdateRequest (request_id, attendance_date, checkin_time, checkout_time) VALUES
(5, '2024-10-14', '08:30:00', NULL),
(8, '2024-10-24', NULL, '18:00:00'),
(11, '2024-11-02', '08:45:00', NULL),
(14, '2024-11-07', '08:30:00', '17:30:00');

-- ============================================
-- Seeding Attendance
-- ============================================
INSERT INTO Attendance (attendance_date, checkin_time, checkout_time, working_hours, IP_checkin, IP_checkout, checkin_location_status, checkout_location_status, employee_id) VALUES
-- Tháng 10/2024
('2024-10-01', '08:15:00', '17:30:00', 8.25, '192.168.1.10', '192.168.1.10', 'OnSite', 'OnSite', 8),
('2024-10-01', '08:30:00', '17:45:00', 8.25, '192.168.1.11', '192.168.1.11', 'OnSite', 'OnSite', 9),
('2024-10-02', '08:20:00', '17:35:00', 8.25, '192.168.1.10', '192.168.1.10', 'OnSite', 'OnSite', 8),
('2024-10-02', '08:25:00', '17:40:00', 8.25, '192.168.1.11', '192.168.1.11', 'OnSite', 'OnSite', 9),
('2024-10-03', '08:10:00', '17:25:00', 8.25, '192.168.1.10', '192.168.1.10', 'OnSite', 'OnSite', 8),
('2024-10-03', '08:35:00', '17:50:00', 8.25, '10.0.0.15', '10.0.0.15', 'Remote', 'Remote', 10),
('2024-10-04', '08:30:00', '17:45:00', 8.25, '192.168.1.10', '192.168.1.10', 'OnSite', 'OnSite', 8),
('2024-10-04', '08:40:00', '17:55:00', 8.25, '10.0.0.16', '10.0.0.16', 'Remote', 'Remote', 11),
('2024-10-07', '08:25:00', '17:40:00', 8.25, '192.168.1.12', '192.168.1.12', 'OnSite', 'OnSite', 12),
('2024-10-07', '08:30:00', '17:45:00', 8.25, '192.168.1.13', '192.168.1.13', 'OnSite', 'OnSite', 13),
('2024-10-08', '08:35:00', '17:50:00', 8.25, '192.168.1.14', '192.168.1.14', 'OnSite', 'OnSite', 14),
('2024-10-09', '08:20:00', '17:35:00', 8.25, '192.168.1.15', '192.168.1.15', 'OnSite', 'OnSite', 15),
('2024-10-10', '08:30:00', '17:45:00', 8.25, '10.0.0.20', '10.0.0.20', 'Remote', 'Remote', 16),
('2024-10-11', '08:15:00', '17:30:00', 8.25, '192.168.1.17', '192.168.1.17', 'OnSite', 'OnSite', 17),
-- Tháng 11/2024
('2024-11-01', '08:20:00', '17:35:00', 8.25, '192.168.1.10', '192.168.1.10', 'OnSite', 'OnSite', 8),
('2024-11-01', '08:25:00', '17:40:00', 8.25, '192.168.1.11', '192.168.1.11', 'OnSite', 'OnSite', 9),
('2024-11-04', '08:30:00', '17:45:00', 8.25, '192.168.1.10', '192.168.1.10', 'OnSite', 'OnSite', 8),
('2024-11-04', '08:35:00', '17:50:00', 8.25, '10.0.0.15', '10.0.0.15', 'Remote', 'Remote', 10),
('2024-11-05', '08:15:00', '17:30:00', 8.25, '192.168.1.10', '192.168.1.10', 'OnSite', 'OnSite', 8),
('2024-11-06', '08:20:00', '17:35:00', 8.25, '192.168.1.11', '192.168.1.11', 'OnSite', 'OnSite', 9),
('2024-11-07', '08:25:00', '17:40:00', 8.25, '192.168.1.12', '192.168.1.12', 'OnSite', 'OnSite', 12),
('2024-11-08', '08:30:00', '17:45:00', 8.25, '192.168.1.13', '192.168.1.13', 'OnSite', 'OnSite', 13),
('2024-11-11', '08:35:00', '17:50:00', 8.25, '192.168.1.14', '192.168.1.14', 'OnSite', 'OnSite', 14),
('2024-11-12', '08:20:00', '17:35:00', 8.25, '192.168.1.15', '192.168.1.15', 'OnSite', 'OnSite', 15),
('2024-11-13', '08:30:00', '17:45:00', 8.25, '10.0.0.20', '10.0.0.20', 'Remote', 'Remote', 16),
('2024-11-14', '08:15:00', '17:30:00', 8.25, '192.168.1.17', '192.168.1.17', 'OnSite', 'OnSite', 17),
('2024-11-15', '08:25:00', '17:40:00', 8.25, '192.168.1.18', '192.168.1.18', 'OnSite', 'OnSite', 18),
('2024-11-18', '08:30:00', '17:45:00', 8.25, '192.168.1.19', '192.168.1.19', 'OnSite', 'OnSite', 19),
('2024-11-19', '08:20:00', '17:35:00', 8.25, '192.168.1.20', '192.168.1.20', 'OnSite', 'OnSite', 20);

-- ============================================
-- Seeding RunningActivity
-- ============================================
INSERT INTO RunningActivity (title, image, description, registration_start_date, registration_end_date, start_date, end_date, min_participant, max_participant, status, target_distance, rules, completion_bonus, top_1_bonus, top_2_bonus, top_3_bonus) VALUES
('Thử thách chạy bộ mùa xuân 2024', 'spring_run_2024.jpg', 'Thử thách chạy bộ chào mừng năm mới 2024', '2024-01-01 00:00:00', '2024-01-15 23:59:59', '2024-01-16', '2024-02-15', 10, 100, 'Completed', '50km', 'Chạy tối thiểu 50km trong 30 ngày. Được tính các hoạt động chạy trên Strava.', 500, 2000, 1500, 1000),
('Challenge Hè Năng Động 2024', 'summer_challenge_2024.jpg', 'Thử thách chạy bộ mùa hè sôi động', '2024-06-01 00:00:00', '2024-06-10 23:59:59', '2024-06-11', '2024-07-31', 15, 150, 'Completed', '100km', 'Hoàn thành 100km trong 50 ngày. Mỗi lần chạy tối thiểu 3km mới được tính.', 800, 3000, 2000, 1500),
('Chạy Vì Sức Khỏe - Tháng 10/2024', 'health_run_oct_2024.jpg', 'Thử thách chạy bộ tháng 10', '2024-09-20 00:00:00', '2024-10-05 23:59:59', '2024-10-06', '2024-10-31', 10, 80, 'Completed', '40km', 'Chạy ít nhất 40km trong tháng 10. Khuyến khích chạy đều đặn mỗi tuần.', 400, 1500, 1000, 700),
('Marathon Cuối Năm 2024', 'year_end_marathon_2024.jpg', 'Thử thách marathon chào đón năm mới', '2024-11-01 00:00:00', '2024-11-20 23:59:59', '2024-11-21', '2024-12-31', 20, 200, 'Active', '150km', 'Hoàn thành 150km trong 40 ngày. Mỗi hoạt động tối thiểu 5km.', 1000, 5000, 3500, 2500),
('Thử Thách Xuân 2025', 'spring_challenge_2025.jpg', 'Chạy bộ chào năm mới 2025', '2024-12-15 00:00:00', '2025-01-10 23:59:59', '2025-01-11', '2025-02-28', 10, 100, 'Draft', '80km', 'Chạy 80km trong 48 ngày đầu năm 2025.', 600, 2500, 1800, 1200);

-- ============================================
-- Seeding ParticipateIn
-- ============================================
INSERT INTO ParticipateIn (employee_id, running_activity_id, total_run, is_completed, rank_position, reward_points) VALUES
-- Spring Run 2024 (Hoàn thành)
(8, 1, 55000, TRUE, 1, 2500),
(9, 1, 53000, TRUE, 2, 2000),
(10, 1, 51000, TRUE, 3, 1500),
(11, 1, 50000, TRUE, NULL, 500),
(12, 1, 50000, TRUE, NULL, 500),
(13, 1, 52000, TRUE, NULL, 500),
(14, 1, 48000, FALSE, NULL, 0),
(15, 1, 45000, FALSE, NULL, 0),
-- Summer Challenge 2024
(8, 2, 120000, TRUE, 1, 3800),
(9, 2, 115000, TRUE, 2, 2800),
(10, 2, 110000, TRUE, 3, 2300),
(11, 2, 105000, TRUE, NULL, 800),
(12, 2, 103000, TRUE, NULL, 800),
(16, 2, 100000, TRUE, NULL, 800),
(17, 2, 102000, TRUE, NULL, 800),
(18, 2, 95000, FALSE, NULL, 0),
(19, 2, 90000, FALSE, NULL, 0),
(20, 2, 85000, FALSE, NULL, 0),
-- Health Run Oct 2024
(8, 3, 50000, TRUE, 1, 1900),
(9, 3, 48000, TRUE, 2, 1400),
(10, 3, 45000, TRUE, 3, 1100),
(13, 3, 42000, TRUE, NULL, 400),
(14, 3, 41000, TRUE, NULL, 400),
(15, 3, 40000, TRUE, NULL, 400),
(21, 3, 38000, FALSE, NULL, 0),
(22, 3, 35000, FALSE, NULL, 0),
-- Marathon End Year 2024 (Đang diễn ra)
(8, 4, 85000, FALSE, NULL, 0),
(9, 4, 78000, FALSE, NULL, 0),
(10, 4, 72000, FALSE, NULL, 0),
(11, 4, 68000, FALSE, NULL, 0),
(12, 4, 65000, FALSE, NULL, 0),
(13, 4, 60000, FALSE, NULL, 0),
(14, 4, 55000, FALSE, NULL, 0),
(15, 4, 52000, FALSE, NULL, 0),
(16, 4, 48000, FALSE, NULL, 0),
(17, 4, 45000, FALSE, NULL, 0),
(18, 4, 42000, FALSE, NULL, 0),
(19, 4, 38000, FALSE, NULL, 0),
(20, 4, 35000, FALSE, NULL, 0),
(21, 4, 30000, FALSE, NULL, 0),
(22, 4, 28000, FALSE, NULL, 0),
(23, 4, 25000, FALSE, NULL, 0),
(24, 4, 22000, FALSE, NULL, 0),
(25, 4, 20000, FALSE, NULL, 0);

-- ============================================
-- Seeding PointAccount
-- ============================================
INSERT INTO PointAccount (current_points, total_earns, total_transferred, last_monthly_reward, last_performance_reward, employee_id) VALUES
(5000.00, 12000, 7000, 500, 1000, 1),
(3500.00, 8500, 5000, 350, 800, 2),
(3200.00, 7800, 4600, 350, 700, 3),
(4500.00, 10500, 6000, 450, 900, 4),
(4200.00, 9800, 5600, 420, 850, 5),
(4000.00, 9200, 5200, 400, 800, 6),
(3800.00, 8800, 5000, 380, 750, 7),
(9300.00, 15000, 5700, 280, 600, 8),
(7800.00, 13000, 5200, 250, 550, 9),
(6800.00, 11500, 4700, 230, 500, 10),
(2800.00, 6500, 3700, 200, 450, 11),
(3300.00, 7000, 3700, 200, 450, 12),
(3500.00, 7500, 4000, 260, 500, 13),
(3000.00, 6800, 3800, 240, 480, 14),
(2700.00, 6200, 3500, 210, 450, 15),
(3500.00, 7300, 3800, 270, 520, 16),
(3300.00, 7100, 3800, 240, 500, 17),
(2200.00, 5900, 3700, 220, 450, 18),
(2000.00, 5600, 3600, 200, 430, 19),
(2900.00, 6500, 3600, 290, 550, 20),
(2600.00, 6200, 3600, 260, 520, 21),
(2300.00, 5900, 3600, 230, 490, 22),
(2100.00, 5600, 3500, 210, 460, 23),
(3200.00, 7000, 3800, 320, 600, 24),
(2900.00, 6700, 3800, 290, 570, 25),
(2700.00, 6400, 3700, 270, 540, 26),
(2500.00, 6100, 3600, 250, 510, 27),
(3100.00, 6900, 3800, 310, 590, 28),
(2800.00, 6600, 3800, 280, 560, 29),
(2600.00, 6300, 3700, 260, 530, 30),
(2300.00, 6000, 3700, 230, 500, 31),
(2100.00, 5700, 3600, 210, 470, 32),
(500.00, 800, 300, 100, 0, 33),
(500.00, 800, 300, 100, 0, 34),
(500.00, 800, 300, 100, 0, 35),
(500.00, 800, 300, 100, 0, 36),
(500.00, 800, 300, 100, 0, 37),
(500.00, 800, 300, 100, 0, 38),
(2800.00, 6500, 3700, 280, 550, 39),
(2500.00, 6200, 3700, 250, 520, 40),
(2300.00, 5900, 3600, 230, 490, 41),
(2100.00, 5600, 3500, 210, 460, 42),
(2600.00, 6300, 3700, 260, 530, 43),
(2400.00, 6000, 3600, 240, 500, 44),
(2700.00, 6400, 3700, 270, 540, 45),
(2500.00, 6100, 3600, 250, 510, 46),
(2200.00, 5800, 3600, 220, 480, 47),
(2000.00, 5500, 3500, 200, 450, 48),
(2300.00, 5900, 3600, 230, 490, 49),
(2100.00, 5600, 3500, 210, 460, 50);

-- ============================================
-- Seeding ConversionRule
-- ============================================
INSERT INTO ConversionRule (expiry, min_points, max_points, conversion_rate, effective_at, expired_at, is_begin_applied) VALUES
(365, 0, 10000, 0.50, '2024-01-01 00:00:00', NULL, TRUE),
(365, 10001, 50000, 0.55, '2024-01-01 00:00:00', NULL, FALSE),
(365, 50001, 100000, 0.60, '2024-01-01 00:00:00', NULL, FALSE);

-- ============================================
-- Seeding PointPolicy
-- ============================================
INSERT INTO PointPolicy (is_being_applied, conversion_rule_id) VALUES
(TRUE, 1);

-- ============================================
-- Seeding MonthlyReward
-- ============================================
INSERT INTO MonthlyReward (position_id, point_policy_id, monthly_points) VALUES
(1, 1, 500),  -- CEO
(2, 1, 500),  -- CTO
(3, 1, 500),  -- CFO
(4, 1, 350),  -- HR Manager
(5, 1, 450),  -- Department Manager
(6, 1, 320),  -- Team Leader
(7, 1, 280),  -- Senior Software Engineer
(8, 1, 250),  -- Software Engineer
(9, 1, 200),  -- Junior Software Engineer
(10, 1, 280), -- Senior Business Analyst
(11, 1, 260), -- Business Analyst
(12, 1, 210), -- Junior Business Analyst
(13, 1, 270), -- Senior QA Engineer
(14, 1, 240), -- QA Engineer
(15, 1, 210), -- Junior QA Engineer
(16, 1, 290), -- Senior Designer
(17, 1, 260), -- Designer
(18, 1, 210), -- Junior Designer
(19, 1, 320), -- DevOps Engineer
(20, 1, 290), -- Data Analyst
(21, 1, 310), -- Product Manager
(22, 1, 300), -- Project Manager
(23, 1, 310), -- Marketing Manager
(24, 1, 300), -- Sales Manager
(25, 1, 260), -- Accountant
(26, 1, 230), -- HR Specialist
(27, 1, 210), -- Receptionist
(28, 1, 100); -- Intern

-- ============================================
-- Seeding DepartmentBudget
-- ============================================
INSERT INTO DepartmentBudget (department_id, point_policy_id, budget) VALUES
(1, 1, 50000),  -- Ban Giám Đốc
(2, 1, 30000),  -- Phòng Nhân Sự
(3, 1, 80000),  -- Phòng Kỹ Thuật
(4, 1, 45000),  -- Phòng Kinh Doanh
(5, 1, 35000),  -- Phòng Marketing
(6, 1, 25000),  -- Phòng Kế Toán
(7, 1, 20000);  -- Phòng Hành Chính

-- ============================================
-- Seeding Transaction
-- ============================================
INSERT INTO Transaction (create_at, points, transaction_type, point_account_id) VALUES
-- CashOut transactions
('2024-03-15 10:30:00', -1000.00, 'CashOut', 1),
('2024-06-20 14:15:00', -1500.00, 'CashOut', 2),
('2024-08-10 09:45:00', -800.00, 'CashOut', 3),
('2024-09-05 11:20:00', -1200.00, 'CashOut', 4),
('2024-10-12 15:30:00', -900.00, 'CashOut', 8),
-- ActivityReward transactions (Spring Run 2024)
('2024-02-20 10:00:00', 2500.00, 'ActionReward', 8),
('2024-02-20 10:00:00', 2000.00, 'ActionReward', 9),
('2024-02-20 10:00:00', 1500.00, 'ActionReward', 10),
('2024-02-20 10:00:00', 500.00, 'ActionReward', 11),
('2024-02-20 10:00:00', 500.00, 'ActionReward', 12),
('2024-02-20 10:00:00', 500.00, 'ActionReward', 13),
-- ActivityReward transactions (Summer Challenge 2024)
('2024-08-05 10:00:00', 3800.00, 'ActionReward', 8),
('2024-08-05 10:00:00', 2800.00, 'ActionReward', 9),
('2024-08-05 10:00:00', 2300.00, 'ActionReward', 10),
('2024-08-05 10:00:00', 800.00, 'ActionReward', 11),
('2024-08-05 10:00:00', 800.00, 'ActionReward', 12),
('2024-08-05 10:00:00', 800.00, 'ActionReward', 16),
('2024-08-05 10:00:00', 800.00, 'ActionReward', 17),
-- ActivityReward transactions (Health Run Oct 2024)
('2024-11-05 10:00:00', 1900.00, 'ActionReward', 8),
('2024-11-05 10:00:00', 1400.00, 'ActionReward', 9),
('2024-11-05 10:00:00', 1100.00, 'ActionReward', 10),
('2024-11-05 10:00:00', 400.00, 'ActionReward', 13),
('2024-11-05 10:00:00', 400.00, 'ActionReward', 14),
('2024-11-05 10:00:00', 400.00, 'ActionReward', 15),
-- PerformanceReward transactions
('2024-04-01 09:00:00', 1000.00, 'PerformanceReward', 1),
('2024-04-01 09:00:00', 800.00, 'PerformanceReward', 2),
('2024-04-01 09:00:00', 700.00, 'PerformanceReward', 3),
('2024-04-01 09:00:00', 900.00, 'PerformanceReward', 4),
('2024-04-01 09:00:00', 850.00, 'PerformanceReward', 5),
('2024-07-01 09:00:00', 1000.00, 'PerformanceReward', 1),
('2024-07-01 09:00:00', 800.00, 'PerformanceReward', 2),
('2024-07-01 09:00:00', 900.00, 'PerformanceReward', 4),
('2024-10-01 09:00:00', 600.00, 'PerformanceReward', 8),
('2024-10-01 09:00:00', 550.00, 'PerformanceReward', 9),
('2024-10-01 09:00:00', 500.00, 'PerformanceReward', 10);

-- ============================================
-- Seeding CashOut
-- ============================================
INSERT INTO CashOut (transaction_id, cash_amount) VALUES
(1, 500000.00),   -- 1000 points = 500,000 VND
(2, 750000.00),   -- 1500 points = 750,000 VND
(3, 400000.00),   -- 800 points = 400,000 VND
(4, 600000.00),   -- 1200 points = 600,000 VND
(5, 450000.00);   -- 900 points = 450,000 VND

-- ============================================
-- Seeding ActivityReward
-- ============================================
INSERT INTO ActivityReward (transaction_id, message, earned_points, running_activity_id) VALUES
(6, 'Chúc mừng! Bạn đã giành vị trí Nhất cuộc thi Spring Run 2024', 2500, 1),
(7, 'Chúc mừng! Bạn đã giành vị trí Nhì cuộc thi Spring Run 2024', 2000, 1),
(8, 'Chúc mừng! Bạn đã giành vị trí Ba cuộc thi Spring Run 2024', 1500, 1),
(9, 'Chúc mừng! Bạn đã hoàn thành Spring Run 2024', 500, 1),
(10, 'Chúc mừng! Bạn đã hoàn thành Spring Run 2024', 500, 1),
(11, 'Chúc mừng! Bạn đã hoàn thành Spring Run 2024', 500, 1),
(12, 'Chúc mừng! Bạn đã giành vị trí Nhất cuộc thi Summer Challenge 2024', 3800, 2),
(13, 'Chúc mừng! Bạn đã giành vị trí Nhì cuộc thi Summer Challenge 2024', 2800, 2),
(14, 'Chúc mừng! Bạn đã giành vị trí Ba cuộc thi Summer Challenge 2024', 2300, 2),
(15, 'Chúc mừng! Bạn đã hoàn thành Summer Challenge 2024', 800, 2),
(16, 'Chúc mừng! Bạn đã hoàn thành Summer Challenge 2024', 800, 2),
(17, 'Chúc mừng! Bạn đã hoàn thành Summer Challenge 2024', 800, 2),
(18, 'Chúc mừng! Bạn đã hoàn thành Summer Challenge 2024', 800, 2),
(19, 'Chúc mừng! Bạn đã giành vị trí Nhất cuộc thi Health Run Oct 2024', 1900, 3),
(20, 'Chúc mừng! Bạn đã giành vị trí Nhì cuộc thi Health Run Oct 2024', 1400, 3),
(21, 'Chúc mừng! Bạn đã giành vị trí Ba cuộc thi Health Run Oct 2024', 1100, 3),
(22, 'Chúc mừng! Bạn đã hoàn thành Health Run Oct 2024', 400, 3),
(23, 'Chúc mừng! Bạn đã hoàn thành Health Run Oct 2024', 400, 3),
(24, 'Chúc mừng! Bạn đã hoàn thành Health Run Oct 2024', 400, 3);

-- ============================================
-- Seeding PerformanceReward
-- ============================================
INSERT INTO PerformanceReward (transaction_id, message, department_id) VALUES
(25, 'Thưởng hiệu suất Quý 1/2024 - Ban Giám Đốc', 1),
(26, 'Thưởng hiệu suất Quý 1/2024 - Phòng Nhân Sự', 2),
(27, 'Thưởng hiệu suất Quý 1/2024 - Phòng Nhân Sự', 2),
(28, 'Thưởng hiệu suất Quý 1/2024 - Phòng Kỹ Thuật', 3),
(29, 'Thưởng hiệu suất Quý 1/2024 - Phòng Kinh Doanh', 4),
(30, 'Thưởng hiệu suất Quý 2/2024 - Ban Giám Đốc', 1),
(31, 'Thưởng hiệu suất Quý 2/2024 - Phòng Nhân Sự', 2),
(32, 'Thưởng hiệu suất Quý 2/2024 - Phòng Kinh Doanh', 4),
(33, 'Thưởng hiệu suất Quý 3/2024 - Phòng Kỹ Thuật', 3),
(34, 'Thưởng hiệu suất Quý 3/2024 - Phòng Kỹ Thuật', 3),
(35, 'Thưởng hiệu suất Quý 3/2024 - Phòng Kỹ Thuật', 3);

-- ============================================
-- Seeding StravaConnections (Một số nhân viên)
-- ============================================
INSERT INTO StravaConnections (access_token, refresh_token, expires_at, strava_profile_url, strava_firstname, strava_lastname, strava_username, strava_athlete_id, employee_id, connection_status, connection_at) VALUES
('sample_access_token_001', 'sample_refresh_token_001', 1735660800, 'https://www.strava.com/athletes/12345001', 'Văn', 'Nguyễn', 'nguyen_van_a', '12345001', 8, 'Connected', '2024-01-10 08:30:00'),
('sample_access_token_002', 'sample_refresh_token_002', 1735660800, 'https://www.strava.com/athletes/12345002', 'Thị', 'Trần', 'tran_thi_b', '12345002', 9, 'Connected', '2024-01-12 09:15:00'),
('sample_access_token_003', 'sample_refresh_token_003', 1735660800, 'https://www.strava.com/athletes/12345003', 'Văn', 'Lê', 'le_van_c', '12345003', 10, 'Connected', '2024-01-15 10:20:00'),
('sample_access_token_004', 'sample_refresh_token_004', 1735660800, 'https://www.strava.com/athletes/12345004', 'Thị', 'Phạm', 'pham_thi_d', '12345004', 11, 'Connected', '2024-01-18 11:45:00'),
('sample_access_token_005', 'sample_refresh_token_005', 1735660800, 'https://www.strava.com/athletes/12345005', 'Văn', 'Hoàng', 'hoang_van_e', '12345005', 12, 'Connected', '2024-01-20 14:30:00'),
('sample_access_token_006', 'sample_refresh_token_006', 1735660800, 'https://www.strava.com/athletes/12345006', 'Thị', 'Vũ', 'vu_thi_f', '12345006', 13, 'Connected', '2024-06-02 08:00:00'),
('sample_access_token_007', 'sample_refresh_token_007', 1735660800, 'https://www.strava.com/athletes/12345007', 'Văn', 'Đỗ', 'do_van_g', '12345007', 14, 'Connected', '2024-06-05 09:30:00'),
('sample_access_token_008', 'sample_refresh_token_008', 1735660800, 'https://www.strava.com/athletes/12345008', 'Thị', 'Bùi', 'bui_thi_h', '12345008', 15, 'Connected', '2024-06-08 10:15:00'),
('sample_access_token_009', 'sample_refresh_token_009', 1735660800, 'https://www.strava.com/athletes/12345009', 'Văn', 'Đặng', 'dang_van_i', '12345009', 16, 'Connected', '2024-09-22 11:00:00'),
('sample_access_token_010', 'sample_refresh_token_010', 1735660800, 'https://www.strava.com/athletes/12345010', 'Thị', 'Nguyễn', 'nguyen_thi_k', '12345010', 17, 'Connected', '2024-09-25 13:20:00'),
('sample_access_token_011', 'sample_refresh_token_011', 1735660800, 'https://www.strava.com/athletes/12345011', 'Văn', 'Trần', 'tran_van_l', '12345011', 18, 'Connected', '2024-09-28 14:45:00'),
('sample_access_token_012', 'sample_refresh_token_012', 1735660800, 'https://www.strava.com/athletes/12345012', 'Thị', 'Lê', 'le_thi_m', '12345012', 19, 'Connected', '2024-10-01 15:30:00'),
('sample_access_token_013', 'sample_refresh_token_013', 1735660800, 'https://www.strava.com/athletes/12345013', 'Văn', 'Phạm', 'pham_van_n', '12345013', 20, 'Connected', '2024-10-05 08:20:00'),
('sample_access_token_014', 'sample_refresh_token_014', 1735660800, 'https://www.strava.com/athletes/12345014', 'Thị', 'Hoàng', 'hoang_thi_o', '12345014', 21, 'Connected', '2024-11-02 09:10:00'),
('sample_access_token_015', 'sample_refresh_token_015', 1735660800, 'https://www.strava.com/athletes/12345015', 'Văn', 'Vũ', 'vu_van_p', '12345015', 22, 'Connected', '2024-11-05 10:40:00');

-- ============================================
-- End of V2__Seeding_Data.sql
-- ============================================