// utils/leaveType.js
import employeeApi from "../api/employeeApi";

export const getLeaveTypes = async () => {
  try {
    const res = await employeeApi.getLeaveType();
    return res?.result.map(({ leaveTypeId, leaveTypeName }) => ({
      id: leaveTypeId,
      name: leaveTypeName,
    }));
  } catch (error) {
    console.error("Failed to get leave types", error);
    return [];
  }
};
