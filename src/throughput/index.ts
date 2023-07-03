import { getById } from "@app/common/repository";
import { showAsLineChart } from "./chart";
import { byWeek } from "./durations";
import { intoThroughput } from "./reader";
import { ThroughputData } from "./type";

async function toWeeklyThroughput(id: string): Promise<ThroughputData[]> {
  const data = intoThroughput(getById(id));
  return data
    .toThroughput(byWeek)
    .sort((a, b) => a.periodEnd.getTime() - b.periodEnd.getTime());
}

export { byWeek, intoThroughput, showAsLineChart, toWeeklyThroughput };
