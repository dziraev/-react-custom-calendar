export const getNumbersOfDaysInMonth = (
  monthIndex: number,
  yearNumber: number = new Date().getFullYear()
) => new Date(yearNumber, monthIndex + 1, 0).getDate(); // monthIndex + 1  and date 0 give the opportunity to get numbers of days in a month
