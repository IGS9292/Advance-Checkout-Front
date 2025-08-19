import dayjs from "dayjs";

export const generateMonthsInRange = (startDate: string, endDate: string) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const months: string[] = [];

  let current = start.startOf("month");
  while (current.isBefore(end) || current.isSame(end, "month")) {
    months.push(current.format("MMM YYYY"));
    current = current.add(1, "month");
  }

  return months;
};
