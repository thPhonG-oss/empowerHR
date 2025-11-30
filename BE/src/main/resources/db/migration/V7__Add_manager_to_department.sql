ALTER TABLE Department
ADD COLUMN manager_id INT;

-- 2. Thêm Constraint Foreign Key
-- Set NULL khi Employee bị xóa để giữ Department tồn tại
ALTER TABLE Department
ADD CONSTRAINT fk_department_manager
FOREIGN KEY (manager_id) REFERENCES Employee(employee_id) ON DELETE SET NULL;
