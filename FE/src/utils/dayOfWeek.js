function getDayOfWeek(dateStr) {
  const day = new Date(dateStr).getDay();
  const map = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  return map[day];
}

export default getDayOfWeek;
