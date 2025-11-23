ALTER TABLE Employee
ADD CONSTRAINT uq_employee_code UNIQUE (employee_code),
ADD CONSTRAINT uq_identity_card UNIQUE (identity_card),
ADD CONSTRAINT uq_email UNIQUE (email);