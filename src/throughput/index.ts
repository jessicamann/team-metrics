import { byWeek } from "./durations";
import { showAsLineChart } from "./chart";
import { readAsStory, intoThroughput } from "./reader";
import { ThroughputData } from "./type";
import { getById } from "@app/common/repository";

async function toWeeklyThroughput(id: string): Promise<ThroughputData[]> {
  const data = intoThroughput(getById(id));
  return data
    .toThroughput(byWeek)
    .sort((a, b) => a.periodEnd.getTime() - b.periodEnd.getTime());
}

export {
  byWeek,
  showAsLineChart,
  toWeeklyThroughput,
  readAsStory as readAsThroughput,
  intoThroughput,
};
