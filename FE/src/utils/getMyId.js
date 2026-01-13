import employeeApi from "../api/employeeApi";

export const getMyId = async () => {
  try {
    const response = await employeeApi.getMyProfile();
    const myId = response?.result?.employeeId;

    if (!myId) {
      throw new Error("Không tìm thấy employeeId trong profile");
    }

    return myId;
  } catch (error) {
    console.error("Lỗi khi lấy employeeId:", error);
    throw error;
  }
};
