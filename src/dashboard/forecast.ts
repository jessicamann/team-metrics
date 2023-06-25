import { countBy, groupBy, map } from "lodash";
import { readFromCsvAndDo } from "..//common/csv";
import { run } from "../forecasting/montecarlo";
import { byWeek, toThroughput } from "../throughput/calculate";
import percentile from "percentile";
import { format } from "date-fns";
import { readAsStory } from "../throughput/chart";

type Summary = {
  name: string;
  progress: {
    completed: number;
    total: number;
  };
  forecast: {
    p50: string;
    p85: string;
    p95: string;
  };
};

export async function forecastSummary(filepath: string): Promise<Summary[]> {
  const throughputData = await readAsStory(filepath);
  const pastThroughput = toThroughput(throughputData, byWeek).map(
    (d) => d.total,
  );

  const data = await readFromCsvAndDo(filepath, (row, skip) => {
    const { id, endDate, feature } = row as {
      id: string;
      endDate: string;
      feature: string;
    };

    if (!feature) {
      skip();
    }

    const completed = !!endDate;
    const completedAt = completed
      ? new Date(endDate)
      : (null as unknown as Date);
    return { completed, feature, completedAt: completedAt, id };
  });

  return map(groupBy(data, "feature"), (value, key) => {
    const completed = countBy(value, "completed")["true"];
    const incomplete = countBy(value, "completed")["false"];

    const simulations = run(10000, incomplete, pastThroughput);

    return {
      name: key,
      progress: {
        completed: completed,
        total: value.length,
      },
      forecast: {
        p50: format(percentile(50, simulations) as number, "MM/dd/yy"),
        p85: format(percentile(85, simulations) as number, "MM/dd/yy"),
        p95: format(percentile(95, simulations) as number, "MM/dd/yy"),
      },
    };
  });
}
