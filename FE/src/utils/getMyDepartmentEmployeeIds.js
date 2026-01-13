import departmentApi from "../api/departmentApi";
import employeeApi from "../api/employeeApi";
import { getMyId } from "./getMyId";

export async function getMyDepartmentEmployeeIds() {
  try {
    const profileRes = await employeeApi.getMyProfile();
    const myDeptName = profileRes?.result?.department;
    if (!myDeptName) throw new Error("Không tìm thấy phòng ban của bạn.");

    const depRes = await departmentApi.getAllDepartment();
    const departments = depRes?.result || [];

    const myDept = departments.find(
      (dept) => dept.departmentName === myDeptName
    );
    if (!myDept) throw new Error("Không tìm thấy phòng ban trong hệ thống.");

    const empRes = await departmentApi.getEmployeesInDepartment(
      myDept.departmentId,
      1,
      1000
    );
    const employees = empRes?.result?.employeeResponseDTOS || [];

    const myId = await getMyId();

    const otherEmployeeIds = employees
      .filter((emp) => emp.employeeId !== myId)
      .map((emp) => emp.employeeId);

    return otherEmployeeIds;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách nhân viên trong phòng ban:", error);
    return [];
  }
}
