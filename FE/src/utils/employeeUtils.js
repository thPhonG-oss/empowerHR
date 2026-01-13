import employeeApi from "../api/employeeApi";

export const getMyName = async () => {
  try {
    const res = await employeeApi.getMyProfile();
    return res?.result?.employeeName || null;
  } catch (error) {
    console.error("Get my name failed:", error);
    return null;
  }
};
