export function getFirstAndLastDayOfCurrentMonth(): {
  from: string;
  to: string;
} {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Calculate the 27th of the last month
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthDate = new Date(currentYear, lastMonth, 27);

  // Calculate the 27th of the current month
  const currentMonthDate = new Date(currentYear, currentMonth, 27);

  let fyear = lastMonthDate.getFullYear();
  let fmonth = (lastMonthDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  let fday = lastMonthDate.getDate().toString().padStart(2, '0');

  let lyear = currentMonthDate.getFullYear();
  let lmonth = (currentMonthDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  let lday = currentMonthDate.getDate().toString().padStart(2, '0');

  // Create the formatted date string
  let fformattedDate = `${fyear}-${fmonth}-${fday}`;
  let lformattedDate = `${lyear}-${lmonth}-${lday}`;

  return { from: fformattedDate, to: lformattedDate };
}
