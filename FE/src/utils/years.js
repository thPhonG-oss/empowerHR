export function getRecentYears(count = 6) {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let i = 0; i < count; i++) {
    years.push(currentYear - i);
  }

  return years;
}
