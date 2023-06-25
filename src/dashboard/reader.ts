import { groupBy } from "lodash";
import { readFromCsvAndDo } from "../common/csv";
import { byWeek, readAsThroughput } from "../throughput";

function readAsForecastable(filepath: string) {
  return readFromCsvAndDo(filepath, (row, skip) => {
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
    return { id, completed, feature, completedAt };
  });
}

export async function readIntoProgressAndForecastable(filepath: string) {
  const throughputPromise = readAsThroughput(filepath).then((r) =>
    r.toThroughput(byWeek).map((d) => d.total),
  );

  const forecastablePromise = await readAsForecastable(filepath).then((r) =>
    groupBy(r, "feature"),
  );

  const [throughput, forecastableByFeature] = await Promise.all([
    throughputPromise,
    forecastablePromise,
  ]);

  return { throughput, forecastableByFeature };
}
