-- ============================================
-- Bảng Bank
-- ============================================
CREATE TABLE Bank (
    bank_id INT PRIMARY KEY AUTO_INCREMENT,
    bank_name VARCHAR(100) NOT NULL,
    branch VARCHAR(100),
    bank_account_number VARCHAR(50) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Bảng Permission
-- ============================================
CREATE TABLE Permission (
    permission_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ============================================
-- Bảng Role
-- ============================================
CREATE TABLE Role (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ============================================
-- Bảng Role_Permission (Many-to-Many)
-- ============================================
CREATE TABLE Role_Permission (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permission_role FOREIGN KEY (role_id)
        REFERENCES Role(role_id) ON DELETE CASCADE,
    CONSTRAINT fk_role_permission_permission FOREIGN KEY (permission_id)
        REFERENCES Permission(permission_id) ON DELETE CASCADE
);

-- ============================================
-- Bảng Account
-- ============================================
CREATE TABLE Account (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    role_id INT,
    CONSTRAINT fk_account_role FOREIGN KEY (role_id)
        REFERENCES Role(role_id) ON DELETE SET NULL
);

-- ============================================
-- Bảng Role_Account
-- ============================================
CREATE TABLE Account_Role(
    account_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (account_id, role_id),
    CONSTRAINT fk_account_role_account FOREIGN KEY (account_id)
        REFERENCES Account(account_id),
    CONSTRAINT fk_account_role_role FOREIGN KEY (role_id)
        REFERENCES Role(role_id)
);

-- ============================================
-- Bảng Position
-- ============================================
CREATE TABLE Position (
    position_id INT PRIMARY KEY AUTO_INCREMENT,
    position_name VARCHAR(100) NOT NULL UNIQUE
);

-- ============================================
-- Bảng Department
-- ============================================
CREATE TABLE Department (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    established_date DATE,
    point_balance DECIMAL(10,2) DEFAULT 0.00
);

-- ============================================
-- Bảng Employee
-- ============================================
CREATE TABLE Employee (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_code VARCHAR(10),
    employee_name VARCHAR(100) NOT NULL,
    identity_card VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender ENUM('Male', 'Female', 'Other'),
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(20),
    starting_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    tax_code VARCHAR(50),
    point_balance DECIMAL(10,2) DEFAULT 0.00,
    account_id INT UNIQUE,
    position_id INT,
    department_id INT,
    bank_id INT,
    CONSTRAINT fk_employee_account FOREIGN KEY (account_id)
        REFERENCES Account(account_id) ON DELETE SET NULL,
    CONSTRAINT fk_employee_position FOREIGN KEY (position_id)
        REFERENCES Position(position_id) ON DELETE SET NULL,
    CONSTRAINT fk_employee_department FOREIGN KEY (department_id)
        REFERENCES Department(department_id) ON DELETE SET NULL,
    CONSTRAINT fk_employee_bank FOREIGN KEY (bank_id)
        REFERENCES Bank(bank_id) ON DELETE SET NULL
);

-- ============================================
-- Bảng Request
-- ============================================
CREATE TABLE Request (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    status ENUM('Pending', 'Approved', 'Rejected', 'Cancelled') DEFAULT 'Pending',
    submit_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    request_type ENUM('Leave', 'TimesheetUpdate', 'Other') NOT NULL,
    handle_at DATETIME,
    response_reason TEXT,
    employee_id INT NOT NULL,
    CONSTRAINT fk_request_employee FOREIGN KEY (employee_id)
        REFERENCES Employee(employee_id) ON DELETE CASCADE
);

-- ============================================
-- Bảng LeaveType
-- ============================================
CREATE TABLE LeaveType (
    leave_type_id INT PRIMARY KEY AUTO_INCREMENT,
    leave_type_name VARCHAR(100) NOT NULL UNIQUE,
    total_day INT NOT NULL
);

-- ============================================
-- Bảng LeaveRequest (Kế thừa từ Request)
-- ============================================
CREATE TABLE LeaveRequest (
    request_id INT PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    proof_document TEXT,
    leave_type_id INT NOT NULL,
    CONSTRAINT fk_leave_request_request FOREIGN KEY (request_id)
        REFERENCES Request(request_id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_request_leave_type FOREIGN KEY (leave_type_id)
        REFERENCES LeaveType(leave_type_id) ON DELETE RESTRICT
);

-- ============================================
-- Bảng TimesheetUpdateRequest (Kế thừa từ Request)
-- ============================================
CREATE TABLE TimesheetUpdateRequest (
    request_id INT PRIMARY KEY,
    attendance_date DATE NOT NULL,
    checkin_time TIME,
    checkout_time TIME,
    CONSTRAINT fk_timesheet_update_request FOREIGN KEY (request_id)
        REFERENCES Request(request_id) ON DELETE CASCADE
);

-- ============================================
-- Bảng LeaveBalance
-- ============================================
CREATE TABLE LeaveBalance (
    leave_balance_id INT PRIMARY KEY AUTO_INCREMENT,
    year YEAR NOT NULL,
    used_leave INT DEFAULT 0,
    remaining_leave INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    employee_id INT NOT NULL,
    leave_type_id INT NOT NULL,
    CONSTRAINT fk_leave_balance_employee FOREIGN KEY (employee_id)
        REFERENCES Employee(employee_id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_balance_leave_type FOREIGN KEY (leave_type_id)
        REFERENCES LeaveType(leave_type_id) ON DELETE RESTRICT,
    CONSTRAINT unique_employee_leave_year UNIQUE (employee_id, leave_type_id, year)
);

-- ============================================
-- Bảng Attendance
-- ============================================
CREATE TABLE Attendance (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    attendance_date DATE NOT NULL,
    checkin_time TIME,
    checkout_time TIME,
    working_hours DECIMAL(4,2),
    IP_checkin VARCHAR(45),
    IP_checkout VARCHAR(45),
    checkin_location_status ENUM('OnSite', 'Remote', 'Unknown'),
    checkout_location_status ENUM('OnSite', 'Remote', 'Unknown'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    employee_id INT NOT NULL,
    CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id)
        REFERENCES Employee(employee_id) ON DELETE CASCADE,
    CONSTRAINT unique_employee_attendance_date UNIQUE (employee_id, attendance_date)
);

-- ============================================
-- Bảng InvalidateToken
-- ============================================
CREATE TABLE InvalidatedToken (
    id INT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(500) NOT NULL UNIQUE,
    expire_time DATETIME NOT NULL,
    account_id INT NOT NULL,
    CONSTRAINT fk_invalidated_token_account FOREIGN KEY (account_id)
        REFERENCES Account(account_id) ON DELETE CASCADE
);

-- ============================================
-- Bảng StravaConnections
-- ============================================
CREATE TABLE StravaConnections (
    connection_id INT PRIMARY KEY AUTO_INCREMENT,
    access_token TEXT,
    refresh_token TEXT,
    expires_at BIGINT,
    strava_profile_url VARCHAR(500),
    strava_firstname TEXT,
    strava_lastname TEXT,
    strava_username TEXT,
    strava_athlete_id VARCHAR(50),
    employee_id INT NOT NULL,
    connection_status VARCHAR(50),
    connection_at DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_strava_connection_employee FOREIGN KEY (employee_id)
        REFERENCES Employee(employee_id) ON DELETE CASCADE,
);
-- ============================================
-- Bảng RunningActivity
-- ============================================
CREATE TABLE RunningActivity (
    running_activity_id INT PRIMARY KEY AUTO_INCREMENT,
    title TEXT NOT NULL,
    image TEXT,
    description TEXT,
    registration_start_date DATETIME,
    registration_end_date DATETIME,
    start_date DATE,
    end_date DATE,
    min_participant INT,
    max_participant INT,
    status ENUM('Draft', 'Active', 'Completed', 'Cancelled') DEFAULT 'Draft',
    target_distance VARCHAR(50),
    rules TEXT,
    completion_bonus INT,
    top_1_bonus INT,
    top_2_bonus INT,
    top_3_bonus INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ParticipateIn (
    participate_in_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    running_activity_id INT NOT NULL,
    total_run INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    rank_position INT,
    reward_points INT DEFAULT 0,
    CONSTRAINT fk_employee_participatein FOREIGN KEY (employee_id)
        REFERENCES Employee(employee_id),
    CONSTRAINT fk_running_activity_participate_in FOREIGN KEY (running_activity_id)
        REFERENCES RunningActivity(running_activity_id),
    CONSTRAINT unique_employee_running_activity UNIQUE(employee_id, running_activity_id)
);

-- ============================================
-- Bảng PointAccount
-- ============================================
CREATE TABLE PointAccount (
    point_account_id INT PRIMARY KEY AUTO_INCREMENT,
    current_points DECIMAL(10,2) DEFAULT 0.00,
    total_earns INT DEFAULT 0,
    total_transferred INT DEFAULT 0,
    last_monthly_reward INT DEFAULT 0,
    last_performance_reward INT DEFAULT 0,
    update_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    employee_id INT UNIQUE,
    CONSTRAINT fk_point_account_employee FOREIGN KEY (employee_id)
        REFERENCES Employee(employee_id) ON DELETE CASCADE
);

-- ============================================
-- Bảng Transaction
-- ============================================
CREATE TABLE Transaction (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    points DECIMAL(10,2) NOT NULL,
    transaction_type ENUM('CashOut', 'ActionReward', 'PerformanceReward', 'Other') NOT NULL,
    point_account_id INT NOT NULL,
    CONSTRAINT fk_transaction_point_account FOREIGN KEY (point_account_id)
        REFERENCES PointAccount(point_account_id) ON DELETE CASCADE
);

-- ============================================
-- Bảng CashOut (Kế thừa từ Transaction)
-- ============================================
CREATE TABLE CashOut (
    transaction_id INT PRIMARY KEY,
    cash_amount DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_cashout_transaction FOREIGN KEY (transaction_id)
        REFERENCES Transaction(transaction_id) ON DELETE CASCADE
);

-- ============================================
-- Bảng ActionReward (Kế thừa từ Transaction)
-- ============================================
CREATE TABLE ActivityReward (
    transaction_id INT PRIMARY KEY,
    message TEXT,
    earned_points INT,
    running_activity_id INT NOT NULL,
    CONSTRAINT fk_activity_reward_transaction FOREIGN KEY (transaction_id)
        REFERENCES Transaction(transaction_id) ON DELETE CASCADE,
    CONSTRAINT fk_activity_reward_running_activity FOREIGN KEY (running_activity_id)
        REFERENCES RunningActivity(running_activity_id)
);

-- ============================================
-- Bảng PerformanceReward (Kế thừa từ Transaction)
-- ============================================
CREATE TABLE PerformanceReward (
    transaction_id INT PRIMARY KEY,
    message TEXT,
    department_id INT NOT NULL,
    CONSTRAINT fk_performance_reward_transaction FOREIGN KEY (transaction_id)
        REFERENCES Transaction(transaction_id) ON DELETE CASCADE,
    CONSTRAINT fk_performance_reward_department FOREIGN KEY (department_id)
        REFERENCES Department(department_id)
);

-- ============================================
-- Bảng ConversionRule
-- ============================================
CREATE TABLE ConversionRule(
    conversion_rule_id INT PRIMARY KEY AUTO_INCREMENT,
    expiry INT DEFAULT 365, -- hạn dùng điểm
    min_points INT DEFAULT 0,
    max_points INT DEFAULT 0,
    conversion_rate DECIMAL(4,2) DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    effective_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expired_at DATETIME DEFAULT NULL,
    is_begin_applied BOOLEAN DEFAULT TRUE
);


-- ============================================
-- Bảng PointPolicy
-- ============================================
CREATE TABLE PointPolicy(
   point_policy_id INT PRIMARY KEY AUTO_INCREMENT,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   is_being_applied BOOLEAN DEFAULT true,
   conversion_rule_id INT NOT NULL,
   CONSTRAINT fk_point_policy_conversion_rule FOREIGN KEY (conversion_rule_id)
        REFERENCES ConversionRule(conversion_rule_id) ON DELETE SET NULL
);


-- ============================================
-- Bảng MonthlyReward
-- ============================================
CREATE TABLE MonthlyReward (
    position_id INT NOT NULL,
    point_policy_id INT NOT NULL,
    monthly_points INT DEFAULT 0,
    PRIMARY KEY (position_id, point_policy_id),
    CONSTRAINT fk_monthly_budget_position FOREIGN KEY (position_id)
        REFERENCES Position(position_id),
    CONSTRAINT fk_monthly_budget_point_policy FOREIGN KEY (point_policy_id)
        REFERENCES PointPolicy(point_policy_id)
);


-- ============================================
-- Bảng DepartmentBudget
-- ============================================
CREATE TABLE DepartmentBudget (
    department_id INT NOT NULL,
    point_policy_id INT  NOT NULL,
    budget INT DEFAULT 0,
    PRIMARY KEY (department_id, point_policy_id),
    CONSTRAINT fk_department_budget_department FOREIGN KEY (department_id)
        REFERENCES Department(department_id),
    CONSTRAINT fk_department_budget_point_policy FOREIGN KEY (point_policy_id)
        REFERENCES PointPolicy(point_policy_id)
);






