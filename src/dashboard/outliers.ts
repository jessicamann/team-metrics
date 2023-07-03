import { isAfter, subMonths } from "date-fns";
import percentile from "percentile";
import { CycleTime } from "@app/cycletime/types";
import { ItemId } from "./type";

/**
 *
 * @param cycleTimeData
 * @returns a list of stories that took longer 85% percentile in the past month
 */
export const toOutlyingItems = (cycleTimeData: CycleTime[]): ItemId[] => {
  const aMonthAgo = subMonths(new Date(), 1);
  const recentOnly = cycleTimeData.filter((d) =>
    isAfter(d.completedAt, aMonthAgo),
  );

  const time = cycleTimeData.map((d) => d.cycletime);
  const p85 = percentile(85, time) as number;

  return recentOnly.filter((d) => d.cycletime > p85).map((d) => d.id);
};
