import { differenceInCalendarDays, isAfter } from "date-fns";
import { readFromCsvAndDo } from "../common/csv";
import { CycleTime } from "./types";

export function cycletimeBetween(end: Date, start: Date): number {
  const days = differenceInCalendarDays(end, start) + 1;
  if (days <= 0) {
    throw new Error("you've figured out time travel.");
  }
  return days;
}

export function toCycleTime(filepath: string): Promise<CycleTime[]> {
  return readFromCsvAndDo<CycleTime>(filepath, (row, skip) => {
    const { id, endDate, startDate } = row as {
      id: string;
      endDate: string;
      startDate: string;
    };
    if (!endDate || !startDate) {
      skip();
    }

    const cycleTime = cycletimeBetween(new Date(endDate), new Date(startDate));
    return { id, completedAt: new Date(endDate), cycletime: cycleTime };
  });
}
