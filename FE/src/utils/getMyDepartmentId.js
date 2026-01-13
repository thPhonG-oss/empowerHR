import employeeApi from "../api/employeeApi";
import departmentApi from "../api/departmentApi";

export const getMyDepartmentId = async () => {
  try {
    // Gọi API lấy thông tin profile của nhân viên
    const profileRes = await employeeApi.getMyProfile();
    const myDepartmentName = profileRes?.result?.department;

    if (!myDepartmentName) {
      console.warn("Không tìm thấy tên phòng ban trong profile.");
      return null;
    }

    // Gọi API lấy tất cả phòng ban
    const departmentsRes = await departmentApi.getAllDepartment();
    const departments = departmentsRes?.result || [];

    // Tìm phòng ban trùng tên với phòng ban trong profile
    const myDepartment = departments.find(
      (dept) => dept.departmentName === myDepartmentName
    );

    if (!myDepartment) {
      console.warn("Không tìm thấy phòng ban khớp với profile.");
      return null;
    }

    return myDepartment.departmentId;
  } catch (error) {
    console.error("Lỗi khi lấy department id:", error);
    return null;
  }
};
