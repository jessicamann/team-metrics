import { InputData } from "@app/common/repository";
import { differenceInCalendarDays } from "date-fns";
import { CycleTime } from "./types";

export function cycletimeBetween(end: Date, start: Date): number {
  const days = differenceInCalendarDays(end, start) + 1;
  if (days <= 0) {
    throw new Error("you've figured out time travel.");
  }
  return days;
}

function isComplete(d: InputData) {
  return d.startDate && d.endDate;
}

function toCycleTime(d: InputData): CycleTime {
  return {
    id: d.id,
    completedAt: new Date(d.endDate),
    cycletime: cycletimeBetween(new Date(d.endDate), new Date(d.startDate)),
  };
}

export function intoCycleTime(data: InputData[]): CycleTime[] {
  return data.filter(isComplete).map(toCycleTime);
}
