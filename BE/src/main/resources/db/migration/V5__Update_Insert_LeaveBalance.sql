
UPDATE LeaveBalance
SET year = 2026
WHERE year = 2025
  AND leave_balance_id > 0;


-- Bật event scheduler (nếu chưa bật)
SET GLOBAL event_scheduler = ON;

DELIMITER $$

CREATE EVENT IF NOT EXISTS init_leave_balance_2026
ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 10 SECOND
DO
BEGIN
    INSERT INTO LeaveBalance
    (
        year,
        used_leave,
        remaining_leave,
        created_at,
        updated_at,
        employee_id,
        leave_type_id
    )
    SELECT
        2026,
        0,
        lt.total_day,
        NOW(),
        NOW(),
        e.employee_id,
        lt.leave_type_id
    FROM Employee e
    JOIN LeaveType lt ON lt.leave_type_id IN (1,2,3,4)
    WHERE e.employee_id IN (21,22,23,24)
    AND NOT EXISTS (
        SELECT 1
        FROM LeaveBalance lb
        WHERE lb.employee_id = e.employee_id
          AND lb.leave_type_id = lt.leave_type_id
          AND lb.year = 2026
    );
END$$

DELIMITER ;
