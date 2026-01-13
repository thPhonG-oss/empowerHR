import departmentApi from "../api/departmentApi";
import { getMyDepartmentId } from "./getMyDepartmentId";

export const getMyDepartmentPointBalance = async () => {
  try {
    const myDepartmentId = await getMyDepartmentId();
    if (!myDepartmentId) {
      console.warn("Không lấy được departmentId của người dùng.");
      return null;
    }

    const departmentsRes = await departmentApi.getAllDepartment();
    const departments = departmentsRes?.result || [];

    const myDepartment = departments.find(
      (dept) => dept.departmentId === myDepartmentId
    );

    if (!myDepartment) {
      console.warn("Không tìm thấy phòng ban của người dùng trong danh sách.");
      return null;
    }

    return myDepartment.pointBalance ?? null;
  } catch (error) {
    console.error("Lỗi khi lấy pointBalance của phòng ban:", error);
    return null;
  }
};
