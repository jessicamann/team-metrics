import { percentiles } from "@app/common/math";
import { eachDayOfInterval, endOfDay, format } from "date-fns";
import { runMonteCarlo } from "./montecarlo";
import { readIntoForecastingData } from "./reader";

type ShortDate = string; // yyyy-mm-dd

/**
 * @internal
 */
export function toCalendarData(
  from: number,
  to: number,
  value: number,
): { date: string; value: number }[] {
  const start = endOfDay(from);
  const end = endOfDay(to);
  return eachDayOfInterval({ start, end }).map((d) => ({
    date: format(d, "yyyy-MM-dd"),
    value,
  }));
}

export async function showAsCalendar(filepath: string): Promise<{
  calendarData: { date: string; value?: number }[];
  remainingStories: number;
  p50: ShortDate;
  p85: ShortDate;
  p95: ShortDate;
}> {
  const { throughput, remaining } = await readIntoForecastingData(filepath);

  const results = runMonteCarlo(10000, remaining, throughput).sort();
  const {
    [20]: p20,
    [50]: p50,
    [85]: p85,
    [95]: p95,
    [100]: p100,
  } = percentiles(results, 20, 50, 85, 95, 100);
  const firstPossibleCompletionDate = results[0];
  const _calendarData = [
    ...toCalendarData(firstPossibleCompletionDate, p20, 10),
    ...toCalendarData(p20, p50, 35),
    ...toCalendarData(p50, p85, 60),
    ...toCalendarData(p85, p95, 90),
    ...toCalendarData(p95, p100, 96),
  ];

  return {
    calendarData: _calendarData,
    remainingStories: remaining,
    p50: format(p50, "MM/dd/yy"),
    p85: format(p85, "MM/dd/yy"),
    p95: format(p95, "MM/dd/yy"),
  };
}
