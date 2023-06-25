import { byWeek } from "./durations";
import { showAsLineChart } from "./chart";
import { readAsStory } from "./reader";
import { ThroughputData } from "./type";

async function toWeeklyThroughput(filepath: string): Promise<ThroughputData[]> {
  const data = await readAsStory(filepath);
  return data
    .toThroughput(byWeek)
    .sort((a, b) => a.periodEnd.getTime() - b.periodEnd.getTime());
}

export {
  byWeek,
  showAsLineChart,
  toWeeklyThroughput,
  readAsStory as readAsThroughput,
};
