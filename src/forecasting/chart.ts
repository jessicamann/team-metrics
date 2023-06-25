import { format } from "date-fns";
import { writeFileSync } from "fs";
import { readAsThroughput, byWeek } from "../throughput";
import percentile from "percentile";
import { run } from "./montecarlo";
import { readInUnfinishedStories } from "./transform";

type ShortDate = string;

export async function forecastHowLong(filpath: string): Promise<{
  filePath: string;
  remainingStories: number;
  p50: ShortDate;
  p85: ShortDate;
  p95: ShortDate;
}> {
  const pastThroughput = (await readAsThroughput(filpath))
    .toThroughput(byWeek)
    .map((d) => d.total);

  const remainingStories = await readInUnfinishedStories(filpath);

  const results = run(10000, remainingStories, pastThroughput).sort();
  const p50 = percentile(50, results) as number;
  const p85 = percentile(85, results) as number;
  const p95 = percentile(95, results) as number;
  const p100 = percentile(100, results) as number;

  const filename = filpath.replace(".csv", ".json");
  writeFileSync(
    `${filename}`,
    JSON.stringify([
      { date: p50, simulations: 50 },
      { date: p85, simulations: 85 },
      { date: p95, simulations: 95 },
      { date: p100, simulations: 100 },
    ]),
  );

  return {
    remainingStories,
    filePath: "path-to-data",
    p50: format(p50, "MM/dd/yy"),
    p85: format(p85, "MM/dd/yy"),
    p95: format(p95, "MM/dd/yy"),
  };
}
