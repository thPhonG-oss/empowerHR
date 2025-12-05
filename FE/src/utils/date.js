// utils/date.js
export const getCurrentDateParts = () => {
  const now = new Date();

  const dayOfWeek = now.toLocaleDateString("vi-VN", { weekday: "long" }); // Thứ
  const day = now.getDate(); // Ngày
  const month = now.getMonth() + 1; // Tháng (0-11)
  const year = now.getFullYear(); // Năm

  return { dayOfWeek, day, month, year };
};
