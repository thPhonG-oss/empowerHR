
INSERT INTO Role (name) VALUES ('ADMIN'), ('MANAGER'), ('EMPLOYEE');

-- 1.2. Permissions
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
('MANAGE_ROLE') ;

-- 1.3. Role_Permission
INSERT INTO Role_Permission (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1,4), (1,5), (1,6), (1,7), (1,8), (1,9), (1,10), (1,11), (1,12), (1,13), (1, 14), (1, 15), (1, 16), (1, 17), (1, 18), (1, 19), (1, 20), (1, 21), (1, 22), (1, 23), (1, 24),
(2, 1), (2, 2), (2, 3), (2,4), (2,5), (2,6), (2,7), (2,8), (2,9), (2,10), (2,11), (2,12), (2,13), (2, 14), (2, 15), (2, 16), (2, 17), (2, 18), (2, 19), (2, 20), (2, 21), (2, 22), (2, 23), (2, 24),
(3, 4);

-- 1.4. WorkLocation
INSERT INTO WorkLocation (name, address, allowed_ip_ranges) VALUES
('Head Office - HCM', '227 Nguyễn Văn Cừ, Q.5, TP.HCM', '["192.168.1.0/24"]'),
('Ha Noi Branch', 'Cầu Giấy, Hà Nội', '["192.168.2.0/24"]'),
('Work From Home', 'Remote', '["0.0.0.0/0"]');

-- 1.5. JobPositions
INSERT INTO JobPosition (position_name) VALUES
('General Director'), ('HR Manager'), ('IT Manager'),
('Senior Developer'), ('Junior Developer'), ('Tester'),
('Accountant'), ('Sales Executive');

-- 1.6. LeaveType
INSERT INTO LeaveType (leave_type_name, total_day) VALUES
('Nghỉ phép năm', 12), ('Nghỉ ốm', 30), ('Nghỉ không lương', 365), ('Remote', 5);

-- 1.7. ConversionRule
INSERT INTO ConversionRule (min_points, max_points, conversion_rate) VALUES (10, 10000, 1000.00);

-- ============================================
-- 2. BANK (SỬA LẠI: 20 RECORDS CHO 20 NHÂN VIÊN)
-- ============================================
INSERT INTO Bank (bank_name, branch, bank_account_number) VALUES
( 'Vietcombank', 'CN Sở Giao Dịch', '0011000000001'),
( 'Techcombank', 'CN Tân Bình', '1903000000002'),
( 'MB Bank', 'CN Quận 5', '9999000000003'),
( 'ACB', 'CN Thủ Đức', '1234000000004'),
( 'TPBank', 'CN Quận 1', '0354000000005'),
( 'Vietinbank', 'CN Hoàn Kiếm', '1010000000006'),
( 'BIDV', 'CN Cầu Giấy', '2111000000007'),
( 'Sacombank', 'CN Phú Nhuận', '0600000000008'),
( 'VPBank', 'CN Đống Đa', '1111000000009'),
( 'VIB', 'CN Quận 7', '6010000000010'),
( 'Vietcombank', 'CN Bình Thạnh', '0011000000011'),
( 'Techcombank', 'CN Ba Đình', '1903000000012'),
( 'MB Bank', 'CN Đà Nẵng', '9999000000013'),
( 'Agribank', 'CN Sài Gòn', '1600000000014'),
( 'ACB', 'CN Hà Đông', '1234000000015'),
( 'TPBank', 'CN Tân Phú', '0354000000016'),
( 'MSB', 'CN Hải Châu', '1100000000017'),
( 'OCB', 'CN Gò Vấp', '0004000000018'),
( 'Vietcombank', 'CN Thủ Thiêm', '0011000000019'),
( 'Techcombank', 'CN Hoàng Mai', '1903000000020');

-- 1.8. ConversionRule (Quy đổi điểm: 1 điểm = 1000 VND)
INSERT INTO ConversionRule (min_points, max_points, conversion_rate) VALUES
(10, 10000, 1000.00);

-- ============================================
-- 2. CẤU TRÚC TỔ CHỨC (DEPT & ACCOUNTS & EMPLOYEES)
-- ============================================

-- 2.1. Departments (Tạm để manager_id = NULL)
INSERT INTO Department (department_name, established_date, point_balance, work_location_id) VALUES
( 'Board of Directors', '2020-01-01', 500000, 1),
( 'IT Department', '2020-02-15', 200000, 1),
( 'HR Department', '2020-03-01', 100000, 2),
( 'Sales Department', '2020-05-20', 150000, 3);

-- ============================================
-- 2.2. ACCOUNTS (Tạo 20 accounts)
-- ============================================
-- Lưu ý: Password giả định là chuỗi hash
INSERT INTO Account (username, password, account_status) VALUES
('newuser', '$2a$10$HASHEDPASSWORD', 1),
('itmanager', '$2a$10$HASHEDPASSWORD', 1),
('hrmanager', '$2a$10$HASHEDPASSWORD', 1),
('salesmanager', '$2a$10$HASHEDPASSWORD', 1),
('devsenior1', '$2a$10$HASHEDPASSWORD', 1),
('devsenior2', '$2a$10$HASHEDPASSWORD', 1),
('devjunior1', '$2a$10$HASHEDPASSWORD', 1),
('devjunior2', '$2a$10$HASHEDPASSWORD', 1),
('devjunior3', '$2a$10$HASHEDPASSWORD', 1),
('tester1', '$2a$10$HASHEDPASSWORD', 1),
('tester2', '$2a$10$HASHEDPASSWORD', 1),
('hrstaff1', '$2a$10$HASHEDPASSWORD', 1),
('hrstaff2', '$2a$10$HASHEDPASSWORD', 1),
('accountant1', '$2a$10$HASHEDPASSWORD', 1),
('sales1', '$2a$10$HASHEDPASSWORD', 1),
('sales2', '$2a$10$HASHEDPASSWORD', 1),
('sales3', '$2a$10$HASHEDPASSWORD', 1),
('sales4', '$2a$10$HASHEDPASSWORD', 1),
('internit', '$2a$10$HASHEDPASSWORD', 1),
('internhr', '$2a$10$HASHEDPASSWORD', 1);

-- ============================================
-- 2.3. ACCOUNT_ROLE (Mapping Role)
-- ============================================
INSERT INTO Account_Role (account_id, role_id) VALUES
(1, 1),
(2, 2), (3, 2), (4, 2),
(5, 3), (6, 3), (7, 3), (8, 3), (9, 3), (10, 3),
(11, 3), (12, 3), (13, 3), (14, 3), (15, 3),
(16, 3), (17, 3), (18, 3), (19, 3), (20, 3);

-- ============================================
-- 2.4. EMPLOYEES (20 Nhân viên)
-- ============================================
-- Thứ tự insert khớp với ID từ 1->20 để map đúng với Bank và Account
INSERT INTO Employee
(employee_code, employee_name, identity_card, address, date_of_birth, gender, email, phone_number, starting_date, tax_code, account_id, department_id, position_id, bank_id)
VALUES
('EMP001', 'Nguyễn Văn Admin', '079090000001', '123 Nguyễn Huệ, Q.1, TP.HCM', '1985-01-01', 'Male', 'admin@company.com', '0909000001', '2020-01-01', '0101234567', 1, 1, 1, 1),
('EMP002', 'Trần IT Manager', '079090000002', '45 Lê Duẩn, Q.1, TP.HCM', '1988-05-15', 'Male', 'it.lead@company.com', '0909000002', '2020-02-15', '0101234568', 2, 2, 3, 2),
('EMP003', 'Lê HR Manager', '079090000003', '10 Hai Bà Trưng, Q.3, TP.HCM', '1990-03-20', 'Female', 'hr.lead@company.com', '0909000003', '2020-03-01', '0101234569', 3, 3, 2, 3),
('EMP004', 'Phạm Sales Lead', '079090000004', '88 Võ Văn Kiệt, Q.5, TP.HCM', '1987-12-10', 'Male', 'sales.lead@company.com', '0909000004', '2020-05-20', '0101234570', 4, 4, 8, 4),
('EMP005', 'Nguyễn Dev A', '079095000005', '12 Phan Đăng Lưu, Bình Thạnh', '1995-06-01', 'Male', 'dev1@company.com', '0912000005', '2021-01-10', '0101234571', 5, 2, 4, 5),
('EMP006', 'Trần Dev B', '079096000006', '34 Hoàng Văn Thụ, Tân Bình', '1996-08-15', 'Female', 'dev2@company.com', '0912000006', '2021-02-15', '0101234572', 6, 2, 4, 6),
('EMP007', 'Lê Dev C', '079098000007', '56 Nguyễn Trãi, Q.5, TP.HCM', '1998-02-20', 'Male', 'dev3@company.com', '0912000007', '2022-06-01', '0101234573', 7, 2, 5, 7),
('EMP008', 'Hoàng Dev D', '079099000008', '78 Lý Thường Kiệt, Q.10', '1999-11-11', 'Male', 'dev4@company.com', '0912000008', '2022-07-20', '0101234574', 8, 2, 5, 8),
('EMP009', 'Vũ Dev E', '079200000009', '90 Phạm Văn Đồng, Thủ Đức', '2000-01-05', 'Female', 'dev5@company.com', '0912000009', '2023-01-05', '0101234575', 9, 2, 5, 9),
('EMP010', 'Đặng Tester A', '079197000010', '11 Nguyễn Văn Nghi, Gò Vấp', '1997-04-10', 'Female', 'test1@company.com', '0933000010', '2022-03-10', '0101234576', 10, 2, 6, 10),
('EMP011', 'Bùi Tester B', '079198000011', '22 Quang Trung, Gò Vấp', '1998-09-15', 'Male', 'test2@company.com', '0933000011', '2022-04-15', '0101234577', 11, 2, 6, 11),
('EMP012', 'Ngô HR A', '079195000012', '33 Lê Văn Sỹ, Q.3, TP.HCM', '1995-12-01', 'Female', 'hr1@company.com', '0944000012', '2021-08-01', '0101234578', 12, 3, 7, 12),
('EMP013', 'Dương HR B', '079194000013', '44 Nam Kỳ Khởi Nghĩa, Q.1', '1994-10-30', 'Male', 'hr2@company.com', '0944000013', '2021-09-15', '0101234579', 13, 3, 7, 13),
('EMP014', 'Lý Accountant', '079192000014', '55 Trần Hưng Đạo, Q.1', '1992-07-20', 'Female', 'acc@company.com', '0955000014', '2020-10-10', '0101234580', 14, 1, 7, 14),
('EMP015', 'Trương Sales A', '079196000015', '66 Xô Viết Nghệ Tĩnh, Bình Thạnh', '1996-03-15', 'Male', 'sale1@company.com', '0966000015', '2021-11-20', '0101234581', 15, 4, 8, 15),
('EMP016', 'Đỗ Sales B', '079198000016', '77 Điện Biên Phủ, Bình Thạnh', '1998-05-05', 'Female', 'sale2@company.com', '0966000016', '2021-12-05', '0101234582', 16, 4, 8, 16),
('EMP017', 'Hồ Sales C', '079197000017', '88 Đinh Tiên Hoàng, Q.1', '1997-01-20', 'Male', 'sale3@company.com', '0966000017', '2022-01-15', '0101234583', 17, 4, 8, 17),
('EMP018', 'Võ Sales D', '079199000018', '99 Nguyễn Thị Minh Khai, Q.1', '1999-08-08', 'Female', 'sale4@company.com', '0966000018', '2022-02-20', '0101234584', 18, 4, 8, 18),
('EMP019', 'Phan Intern IT', '079202000019', 'KTX Khu B, Thủ Đức', '2002-09-02', 'Male', 'intern1@company.com', '0988000019', '2024-01-01', '8000000001', 19, 2, 5, 19),
('EMP020', 'Đinh Intern HR', '079202000020', 'KTX Khu A, Thủ Đức', '2002-12-25', 'Female', 'intern2@company.com', '0988000020', '2024-01-15', '8000000002', 20, 3, 7, 20);

-- 2.5. UPDATE DEPARTMENT MANAGER (Cập nhật người quản lý sau khi có Employee)
UPDATE Department SET manager_id = 1 WHERE department_id = 1;
UPDATE Department SET manager_id = 2 WHERE department_id = 2;
UPDATE Department SET manager_id = 3 WHERE department_id = 3;
UPDATE Department SET manager_id = 4 WHERE department_id = 4;

-- ============================================
-- 3. REQUEST SYSTEM
-- ============================================

-- === Đợt 1: Insert 30 Request xin nghỉ phép (Sẽ có ID từ 1 -> 30) ===
INSERT INTO Request (status, request_type, reason, employee_id, submit_at) VALUES
('Approved', 'LeaveRequest', 'Nghỉ phép năm', 5, '2024-02-01 08:00:00'),
('Pending', 'LeaveRequest', 'Nghỉ ốm', 6, '2024-02-02 09:00:00'),
('Rejected', 'LeaveRequest', 'Việc cá nhân', 7, '2024-02-03 10:00:00'),
('Approved', 'LeaveRequest', 'Về quê', 8, '2024-02-04 08:30:00'),
('Approved', 'LeaveRequest', 'Đám cưới', 9, '2024-02-05 14:00:00'),
('Pending', 'LeaveRequest', 'Du lịch', 10, '2024-03-01 08:00:00'),
('Approved', 'LeaveRequest', 'Khám bệnh', 11, '2024-03-02 09:15:00'),
('Cancelled', 'LeaveRequest', 'Hủy kèo', 12, '2024-03-03 11:00:00'),
('Approved', 'LeaveRequest', 'Nghỉ bù', 13, '2024-03-05 16:00:00'),
('Pending', 'LeaveRequest', 'Công tác', 15, '2024-03-10 08:00:00'),
('Approved', 'LeaveRequest', 'Nghỉ ốm', 16, '2024-03-12 07:30:00'),
('Rejected', 'LeaveRequest', 'Không lý do', 17, '2024-03-15 08:00:00'),
('Approved', 'LeaveRequest', 'Phép năm', 18, '2024-03-20 09:00:00'),
('Pending', 'LeaveRequest', 'Con ốm', 19, '2024-04-01 08:00:00'),
('Approved', 'LeaveRequest', 'Phép năm', 20, '2024-04-05 08:00:00'),
('Approved', 'LeaveRequest', 'Du lịch hè', 5, '2024-06-01 08:00:00'),
('Pending', 'LeaveRequest', 'Việc nhà', 6, '2024-06-02 08:00:00'),
('Approved', 'LeaveRequest', 'Nghỉ ốm', 7, '2024-06-05 08:00:00'),
('Rejected', 'LeaveRequest', 'Thiếu người', 8, '2024-06-10 08:00:00'),
('Approved', 'LeaveRequest', 'Kết hôn', 9, '2024-06-15 08:00:00'),
('Pending', 'LeaveRequest', 'Phép năm', 10, '2024-07-01 08:00:00'),
('Approved', 'LeaveRequest', 'Giấy tờ', 11, '2024-07-05 08:00:00'),
('Cancelled', 'LeaveRequest', 'Hủy', 12, '2024-07-10 08:00:00'),
('Approved', 'LeaveRequest', 'Nghỉ ốm', 13, '2024-07-15 08:00:00'),
('Pending', 'LeaveRequest', 'Việc riêng', 15, '2024-08-01 08:00:00'),
('Approved', 'LeaveRequest', 'Phép năm', 16, '2024-08-05 08:00:00'),
('Approved', 'LeaveRequest', 'Nghỉ bù', 17, '2024-08-10 08:00:00'),
('Rejected', 'LeaveRequest', 'Busy', 18, '2024-08-15 08:00:00'),
('Pending', 'LeaveRequest', 'Phép năm', 19, '2024-09-01 08:00:00'),
('Approved', 'LeaveRequest', 'Nghỉ ốm', 20, '2024-09-05 08:00:00');

-- Insert chi tiết LeaveRequest khớp với ID 1->30
INSERT INTO LeaveRequest (request_id, start_date, end_date, leave_type_id, proof_document) VALUES
(1, '2024-02-10', '2024-02-15', 1, NULL), (2, '2024-02-02', '2024-02-04', 2, 'doc.pdf'),
(3, '2024-02-05', '2024-02-05', 1, NULL), (4, '2024-02-08', '2024-02-12', 1, NULL),
(5, '2024-02-20', '2024-02-20', 1, 'img.jpg'), (6, '2024-03-05', '2024-03-07', 1, NULL),
(7, '2024-03-02', '2024-03-02', 2, 'doc.jpg'), (8, '2024-03-10', '2024-03-11', 1, NULL),
(9, '2024-03-06', '2024-03-06', 1, NULL), (10, '2024-03-15', '2024-03-18', 1, NULL),
(11, '2024-03-12', '2024-03-13', 2, 'img.jpg'), (12, '2024-03-20', '2024-03-20', 3, NULL),
(13, '2024-03-25', '2024-03-27', 1, NULL), (14, '2024-04-02', '2024-04-03', 2, NULL),
(15, '2024-04-10', '2024-04-12', 1, NULL), (16, '2024-06-10', '2024-06-15', 1, NULL),
(17, '2024-06-03', '2024-06-03', 1, NULL), (18, '2024-06-05', '2024-06-06', 2, 'doc.jpg'),
(19, '2024-06-12', '2024-06-12', 1, NULL), (20, '2024-06-20', '2024-06-22', 1, NULL),
(21, '2024-07-05', '2024-07-07', 1, NULL), (22, '2024-07-06', '2024-07-06', 1, NULL),
(23, '2024-07-12', '2024-07-12', 1, NULL), (24, '2024-07-15', '2024-07-16', 2, 'doc.jpg'),
(25, '2024-08-02', '2024-08-02', 3, NULL), (26, '2024-08-10', '2024-08-15', 1, NULL),
(27, '2024-08-12', '2024-08-12', 1, NULL), (28, '2024-08-16', '2024-08-16', 1, NULL),
(29, '2024-09-02', '2024-09-05', 1, NULL), (30, '2024-09-06', '2024-09-06', 2, 'doc.jpg');

-- === Đợt 2: Insert 30 Request cập nhật chấm công (Sẽ có ID từ 31 -> 60) ===
INSERT INTO Request (status, request_type, reason, employee_id, submit_at) VALUES
('Approved', 'TimesheetUpdateRequest', 'Quên check-in', 5, '2024-02-01 17:00:00'),
('Approved', 'TimesheetUpdateRequest', 'Máy lỗi', 6, '2024-02-02 17:00:00'),
('Pending', 'TimesheetUpdateRequest', 'Họp trễ', 7, '2024-02-03 18:00:00'),
('Rejected', 'TimesheetUpdateRequest', 'Ko lý do', 8, '2024-02-04 17:00:00'),
('Approved', 'TimesheetUpdateRequest', 'Quên out', 9, '2024-02-05 18:00:00'),
('Approved', 'TimesheetUpdateRequest', 'Gặp khách', 10, '2024-02-06 19:00:00'),
('Pending', 'TimesheetUpdateRequest', 'Quên thẻ', 11, '2024-02-07 08:30:00'),
('Approved', 'TimesheetUpdateRequest', 'System error', 12, '2024-02-08 08:00:00'),
('Approved', 'TimesheetUpdateRequest', 'Site khách', 13, '2024-02-09 09:00:00'),
('Rejected', 'TimesheetUpdateRequest', 'Personal', 14, '2024-02-10 17:00:00'),
('Pending', 'TimesheetUpdateRequest', 'Quên in', 15, '2024-03-01 08:15:00'),
('Approved', 'TimesheetUpdateRequest', 'Broken machine', 16, '2024-03-02 08:00:00'),
('Approved', 'TimesheetUpdateRequest', 'Quên out', 17, '2024-03-03 17:30:00'),
('Approved', 'TimesheetUpdateRequest', 'Business trip', 18, '2024-03-04 08:00:00'),
('Pending', 'TimesheetUpdateRequest', 'Forgot card', 19, '2024-03-05 08:05:00'),
('Approved', 'TimesheetUpdateRequest', 'Meeting', 20, '2024-03-06 18:00:00'),
('Rejected', 'TimesheetUpdateRequest', 'Early leave', 5, '2024-03-07 16:30:00'),
('Approved', 'TimesheetUpdateRequest', 'Forgot in', 6, '2024-03-08 08:00:00'),
('Approved', 'TimesheetUpdateRequest', 'Error', 7, '2024-03-09 08:00:00'),
('Pending', 'TimesheetUpdateRequest', 'Meeting', 8, '2024-03-10 19:00:00'),
('Approved', 'TimesheetUpdateRequest', 'Forgot out', 9, '2024-04-01 17:30:00'),
('Approved', 'TimesheetUpdateRequest', 'Maintenance', 10, '2024-04-02 08:00:00'),
('Rejected', 'TimesheetUpdateRequest', 'Late', 11, '2024-04-03 10:00:00'),
('Approved', 'TimesheetUpdateRequest', 'Outside', 12, '2024-04-04 09:00:00'),
('Pending', 'TimesheetUpdateRequest', 'Forgot', 13, '2024-04-05 13:30:00'),
('Approved', 'TimesheetUpdateRequest', 'Card', 14, '2024-04-06 08:00:00'),
('Approved', 'TimesheetUpdateRequest', 'Team building', 15, '2024-04-07 08:00:00'),
('Pending', 'TimesheetUpdateRequest', 'Forgot out', 16, '2024-04-08 17:30:00'),
('Approved', 'TimesheetUpdateRequest', 'Error', 17, '2024-04-09 08:00:00'),
('Approved', 'TimesheetUpdateRequest', 'Forgot in', 18, '2024-04-10 08:00:00');

-- Insert chi tiết TimesheetUpdate khớp với ID 31 -> 60
INSERT INTO TimesheetUpdateRequest (request_id, attendance_date, checkin_time, checkout_time) VALUES
(31, '2024-02-01', '08:00:00', '17:00:00'), (32, '2024-02-02', '08:00:00', '17:00:00'),
(33, '2024-02-03', '08:00:00', '18:00:00'), (34, '2024-02-04', '08:00:00', '17:00:00'),
(35, '2024-02-05', '08:00:00', '18:00:00'), (36, '2024-02-06', '08:00:00', '19:00:00'),
(37, '2024-02-07', '08:30:00', '17:30:00'), (38, '2024-02-08', '08:00:00', '17:00:00'),
(39, '2024-02-09', '09:00:00', '18:00:00'), (40, '2024-02-10', '08:00:00', '17:00:00'),
(41, '2024-03-01', '08:15:00', '17:15:00'), (42, '2024-03-02', '08:00:00', '17:00:00'),
(43, '2024-03-03', '08:00:00', '17:30:00'), (44, '2024-03-04', '08:00:00', '17:00:00'),
(45, '2024-03-05', '08:05:00', '17:05:00'), (46, '2024-03-06', '09:00:00', '18:00:00'),
(47, '2024-03-07', '08:00:00', '16:30:00'), (48, '2024-03-08', '08:00:00', '17:00:00'),
(49, '2024-03-09', '08:00:00', '17:00:00'), (50, '2024-03-10', '09:00:00', '19:00:00'),
(51, '2024-04-01', '08:30:00', '17:30:00'), (52, '2024-04-02', '08:00:00', '17:00:00'),
(53, '2024-04-03', '10:00:00', '19:00:00'), (54, '2024-04-04', '09:00:00', '18:00:00'),
(55, '2024-04-05', '08:00:00', '17:00:00'), (56, '2024-04-06', '08:00:00', '17:00:00'),
(57, '2024-04-07', '08:00:00', '17:00:00'), (58, '2024-04-08', '08:30:00', '17:30:00'),
(59, '2024-04-09', '08:00:00', '17:00:00'), (60, '2024-04-10', '08:00:00', '17:00:00');

-- ============================================
-- 4. GAMIFICATION & POINTS
-- ============================================
INSERT INTO PointPolicy (conversion_rule_id, is_being_applied) VALUES (1, 1);

-- 20 ví điểm cho 20 nhân viên
INSERT INTO PointAccount (employee_id, current_points, total_earns) VALUES
(1, 1000, 1000), (2, 500, 500), (3, 200, 200), (4, 800, 900),
(5, 150, 200), (6, 300, 300), (7, 50, 50), (8, 0, 0),
(9, 120, 120), (10, 400, 450), (11, 100, 100), (12, 0, 0),
(13, 1000, 2000), (14, 50, 50), (15, 600, 600), (16, 700, 750),
(17, 0, 0), (18, 100, 100), (19, 20, 20), (20, 30, 30);

INSERT INTO RunningActivity (title, status, start_date, end_date, target_distance) VALUES
('Summer Run 2024', 'Active', '2024-06-01', '2024-06-30', '100'),
('Tech Marathon', 'Completed', '2024-01-01', '2024-01-31', '50');

INSERT INTO ParticipateIn (employee_id, running_activity_id, total_run, is_completed) VALUES
(5, 1, 120, 1), (6, 1, 50, 0), (13, 1, 200, 1), (5, 2, 60, 1), (2, 2, 40, 0);

-- Transaction mẫu
INSERT INTO Transaction (point_account_id, points, transaction_type) VALUES (5, 100, 'ActionReward');
INSERT INTO ActivityReward (transaction_id, message, earned_points, running_activity_id) VALUES (1, 'Thưởng Summer Run', 100, 1);

INSERT INTO Transaction (point_account_id, points, transaction_type) VALUES (13, -1000, 'CashOut');
INSERT INTO CashOut (transaction_id, cash_amount) VALUES (2, 1000000);

INSERT INTO Transaction (point_account_id, points, transaction_type) VALUES (2, 500, 'PerformanceReward');
INSERT INTO PerformanceReward (transaction_id, message, department_id) VALUES (3, 'Thưởng quý 1', 2);

-- ============================================
-- 5. ATTENDANCE LOGS (~100 records)
-- ============================================
INSERT INTO Attendance (attendance_date, checkin_time, checkout_time, working_hours, checkin_location_status, employee_id) VALUES
-- Nhân viên 5 (Dev) - Chăm chỉ
('2024-12-01', '08:00:00', '17:00:00', 8.0, 'OnSite', 5),
('2024-12-02', '08:00:00', '17:00:00', 8.0, 'OnSite', 5),
('2024-12-03', '07:55:00', '17:05:00', 8.2, 'OnSite', 5),
('2024-12-04', '08:00:00', '17:00:00', 8.0, 'OnSite', 5),
('2024-12-05', '08:00:00', '17:00:00', 8.0, 'OnSite', 5),
('2024-12-06', '08:00:00', '17:00:00', 8.0, 'OnSite', 5),
('2024-12-07', '08:00:00', '12:00:00', 4.0, 'OnSite', 5),
('2024-12-09', '08:00:00', '17:00:00', 8.0, 'OnSite', 5),
('2024-12-10', '08:00:00', '17:00:00', 8.0, 'OnSite', 5),
('2024-12-11', '08:00:00', '17:00:00', 8.0, 'OnSite', 5),
('2024-12-12', '08:00:00', '17:00:00', 8.0, 'OnSite', 5),
('2024-12-13', '08:00:00', '17:00:00', 8.0, 'OnSite', 5),
('2024-12-14', '08:00:00', '12:00:00', 4.0, 'OnSite', 5),
('2024-12-16', '08:00:00', '17:00:00', 8.0, 'OnSite', 5),
('2024-12-17', '08:00:00', '17:00:00', 8.0, 'OnSite', 5),

-- Nhân viên 6 (Dev) - Hay đi trễ về sớm
('2024-12-01', '08:30:00', '17:30:00', 8.0, 'OnSite', 6),
('2024-12-02', '08:45:00', '17:00:00', 7.25, 'OnSite', 6),
('2024-12-03', '09:00:00', '18:00:00', 8.0, 'OnSite', 6),
('2024-12-04', '08:15:00', '17:15:00', 8.0, 'OnSite', 6),
('2024-12-05', '08:20:00', '17:30:00', 8.1, 'OnSite', 6),
('2024-12-06', '08:00:00', '16:30:00', 7.5, 'OnSite', 6),
('2024-12-09', '08:30:00', '17:30:00', 8.0, 'OnSite', 6),
('2024-12-10', '08:45:00', '17:45:00', 8.0, 'OnSite', 6),
('2024-12-11', '09:00:00', '18:00:00', 8.0, 'OnSite', 6),
('2024-12-12', '08:15:00', '17:15:00', 8.0, 'OnSite', 6),
('2024-12-13', '08:20:00', '17:20:00', 8.0, 'OnSite', 6),
('2024-12-16', '08:30:00', '17:30:00', 8.0, 'OnSite', 6),
('2024-12-17', '08:45:00', '17:45:00', 8.0, 'OnSite', 6),

-- Nhân viên 15 (Sales) - Hay làm Remote
('2024-12-01', '08:00:00', '17:00:00', 8.0, 'Remote', 15),
('2024-12-02', '08:00:00', '17:00:00', 8.0, 'Remote', 15),
('2024-12-03', '09:00:00', '18:00:00', 8.0, 'OnSite', 15),
('2024-12-04', '08:00:00', '17:00:00', 8.0, 'Remote', 15),
('2024-12-05', '08:00:00', '17:00:00', 8.0, 'Remote', 15),
('2024-12-06', '08:00:00', '17:00:00', 8.0, 'Remote', 15),
('2024-12-09', '08:00:00', '17:00:00', 8.0, 'OnSite', 15),
('2024-12-10', '08:00:00', '17:00:00', 8.0, 'Remote', 15),
('2024-12-11', '08:00:00', '17:00:00', 8.0, 'Remote', 15),
('2024-12-12', '08:00:00', '17:00:00', 8.0, 'Remote', 15),
('2024-12-13', '08:00:00', '17:00:00', 8.0, 'OnSite', 15),
('2024-12-16', '08:00:00', '17:00:00', 8.0, 'Remote', 15),
('2024-12-17', '08:00:00', '17:00:00', 8.0, 'Remote', 15),

-- Nhân viên 19 (Intern) - Làm việc đều đặn
('2024-12-01', '08:00:00', '17:00:00', 8.0, 'OnSite', 19),
('2024-12-02', '08:00:00', '17:00:00', 8.0, 'OnSite', 19),
('2024-12-03', '08:00:00', '17:00:00', 8.0, 'OnSite', 19),
('2024-12-04', '08:00:00', '17:00:00', 8.0, 'OnSite', 19),
('2024-12-05', '08:00:00', '17:00:00', 8.0, 'OnSite', 19),
('2024-12-06', '08:00:00', '17:00:00', 8.0, 'OnSite', 19),
('2024-12-09', '08:00:00', '17:00:00', 8.0, 'OnSite', 19),
('2024-12-10', '08:00:00', '17:00:00', 8.0, 'OnSite', 19),
('2024-12-11', '08:00:00', '17:00:00', 8.0, 'OnSite', 19),
('2024-12-12', '08:00:00', '17:00:00', 8.0, 'OnSite', 19),
('2024-12-13', '08:00:00', '17:00:00', 8.0, 'OnSite', 19),
('2024-12-16', '08:00:00', '17:00:00', 8.0, 'OnSite', 19),
('2024-12-17', '08:00:00', '17:00:00', 8.0, 'OnSite', 19),

-- Nhân viên 2 (IT Manager) - Chấm công full
('2024-12-01', '07:45:00', '17:15:00', 8.5, 'OnSite', 2),
('2024-12-02', '07:50:00', '17:20:00', 8.5, 'OnSite', 2),
('2024-12-03', '08:00:00', '17:30:00', 8.5, 'OnSite', 2),
('2024-12-04', '07:45:00', '17:00:00', 8.25, 'OnSite', 2),
('2024-12-05', '07:50:00', '17:10:00', 8.3, 'OnSite', 2),
('2024-12-06', '08:00:00', '17:00:00', 8.0, 'OnSite', 2),
('2024-12-09', '07:45:00', '17:15:00', 8.5, 'OnSite', 2),
('2024-12-10', '07:50:00', '17:20:00', 8.5, 'OnSite', 2),
('2024-12-11', '08:00:00', '17:30:00', 8.5, 'OnSite', 2),
('2024-12-12', '07:45:00', '17:00:00', 8.25, 'OnSite', 2),
('2024-12-13', '07:50:00', '17:10:00', 8.3, 'OnSite', 2),
('2024-12-16', '08:00:00', '17:00:00', 8.0, 'OnSite', 2),
('2024-12-17', '07:45:00', '17:15:00', 8.5, 'OnSite', 2),

-- Nhân viên 3 (HR Manager)
('2024-12-01', '08:00:00', '17:00:00', 8.0, 'OnSite', 3),
('2024-12-02', '08:00:00', '17:00:00', 8.0, 'OnSite', 3),
('2024-12-03', '08:00:00', '17:00:00', 8.0, 'OnSite', 3),
('2024-12-04', '08:00:00', '17:00:00', 8.0, 'OnSite', 3),
('2024-12-05', '08:00:00', '17:00:00', 8.0, 'OnSite', 3),
('2024-12-06', '08:00:00', '17:00:00', 8.0, 'OnSite', 3),
('2024-12-09', '08:00:00', '17:00:00', 8.0, 'OnSite', 3),
('2024-12-10', '08:00:00', '17:00:00', 8.0, 'OnSite', 3),
('2024-12-11', '08:00:00', '17:00:00', 8.0, 'OnSite', 3),
('2024-12-12', '08:00:00', '17:00:00', 8.0, 'OnSite', 3),
('2024-12-13', '08:00:00', '17:00:00', 8.0, 'OnSite', 3),
('2024-12-16', '08:00:00', '17:00:00', 8.0, 'OnSite', 3),
('2024-12-17', '08:00:00', '17:00:00', 8.0, 'OnSite', 3),

-- Nhân viên 20 (Intern HR)
('2024-12-01', '08:15:00', '17:15:00', 8.0, 'OnSite', 20),
('2024-12-02', '08:15:00', '17:15:00', 8.0, 'OnSite', 20),
('2024-12-03', '08:15:00', '17:15:00', 8.0, 'OnSite', 20),
('2024-12-04', '08:15:00', '17:15:00', 8.0, 'OnSite', 20),
('2024-12-05', '08:15:00', '17:15:00', 8.0, 'OnSite', 20),
('2024-12-06', '08:15:00', '17:15:00', 8.0, 'OnSite', 20),
('2024-12-09', '08:15:00', '17:15:00', 8.0, 'OnSite', 20),
('2024-12-10', '08:15:00', '17:15:00', 8.0, 'OnSite', 20),
('2024-12-11', '08:15:00', '17:15:00', 8.0, 'OnSite', 20),
('2024-12-12', '08:15:00', '17:15:00', 8.0, 'OnSite', 20),
('2024-12-13', '08:15:00', '17:15:00', 8.0, 'OnSite', 20),
('2024-12-16', '08:15:00', '17:15:00', 8.0, 'OnSite', 20),
('2024-12-17', '08:15:00', '17:15:00', 8.0, 'OnSite', 20),

-- Nhân viên 10 (Tester)
('2024-12-01', '08:00:00', '17:00:00', 8.0, 'OnSite', 10),
('2024-12-02', '08:00:00', '17:00:00', 8.0, 'OnSite', 10),
('2024-12-03', '08:00:00', '17:00:00', 8.0, 'OnSite', 10),
('2024-12-04', '08:00:00', '17:00:00', 8.0, 'OnSite', 10),
('2024-12-05', '08:00:00', '17:00:00', 8.0, 'OnSite', 10),
('2024-12-06', '08:00:00', '17:00:00', 8.0, 'OnSite', 10),
('2024-12-09', '08:00:00', '17:00:00', 8.0, 'OnSite', 10),
('2024-12-10', '08:00:00', '17:00:00', 8.0, 'OnSite', 10),
('2024-12-11', '08:00:00', '17:00:00', 8.0, 'OnSite', 10),
('2024-12-12', '08:00:00', '17:00:00', 8.0, 'OnSite', 10),
('2024-12-13', '08:00:00', '17:00:00', 8.0, 'OnSite', 10),
('2024-12-16', '08:00:00', '17:00:00', 8.0, 'OnSite', 10),
('2024-12-17', '08:00:00', '17:00:00', 8.0, 'OnSite', 10);
