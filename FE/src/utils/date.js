export const getCurrentDateParts = () => {
  const now = new Date();

  const dayOfWeek = now.toLocaleDateString("vi-VN", { weekday: "long" });
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  return { dayOfWeek, day, month, year };
};
