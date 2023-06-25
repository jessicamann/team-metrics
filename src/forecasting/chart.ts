import { format } from "date-fns";
import { writeFileSync } from "fs";
import { percentiles } from "../common/math";
import { runMonteCarlo } from "./montecarlo";
import { readIntoForecastingData } from "./reader";

type ShortDate = string;

export async function showAsCalendar(filepath: string): Promise<{
  filePath: string;
  remainingStories: number;
  p50: ShortDate;
  p85: ShortDate;
  p95: ShortDate;
}> {
  const { throughput, remaining } = await readIntoForecastingData(filepath);

  const results = runMonteCarlo(10000, remaining, throughput).sort();
  const {
    [50]: p50,
    [85]: p85,
    [95]: p95,
    [100]: p100,
  } = percentiles(results, 50, 85, 95, 100);

  const resultFile = filepath.replace(".csv", ".json");
  writeFileSync(
    `${resultFile}`,
    JSON.stringify([
      { date: p50, simulations: 50 },
      { date: p85, simulations: 85 },
      { date: p95, simulations: 95 },
      { date: p100, simulations: 100 },
    ]),
  );

  return {
    remainingStories: remaining,
    filePath: resultFile,
    p50: format(p50, "MM/dd/yy"),
    p85: format(p85, "MM/dd/yy"),
    p95: format(p95, "MM/dd/yy"),
  };
}
