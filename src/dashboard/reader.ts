import { groupBy, some } from "lodash";
import { readFromCsvAndDo } from "@app/common/csv";
import { byWeek, readAsThroughput } from "@app/throughput";
import { isAfter, subMonths } from "date-fns";

export type Forecastable = {
  id: string;
  completed: boolean;
  feature: string;
  recentlyWorkedOn: boolean;
};

function isRecent(...dates: string[]) {
  const oneMonthAgo = subMonths(new Date(), 1);
  return some(dates, (d) => isAfter(new Date(d), oneMonthAgo));
}

function readAsForecastable(filepath: string): Promise<Forecastable[]> {
  return readFromCsvAndDo(filepath, (row, skip) => {
    const { id, startDate, endDate, feature } = row as {
      id: string;
      startDate: string;
      endDate: string;
      feature: string;
    };

    if (!feature) {
      skip();
    }

    const completed = !!endDate;
    const recentlyWorkedOn = isRecent(startDate, endDate);
    return { id, completed, feature, recentlyWorkedOn };
  });
}

export async function readIntoProgressAndForecastable(filepath: string) {
  const throughputPromise = readAsThroughput(filepath).then((r) =>
    r.toThroughput(byWeek).map((d) => d.total),
  );

  const forecastablePromise = readAsForecastable(filepath).then((r) =>
    groupBy(r, "feature"),
  );

  const [throughput, forecastableByFeature] = await Promise.all([
    throughputPromise,
    forecastablePromise,
  ]);

  return { throughput, forecastableByFeature };
}
