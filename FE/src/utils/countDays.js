export function countDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Tính số ms giữa 2 ngày
  const diffMs = end - start;

  // Chuyển sang số ngày
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  // +1 để tính cả start và end
  return diffDays + 1;
}
