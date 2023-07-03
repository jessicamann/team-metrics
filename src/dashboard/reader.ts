import { InputData } from "@app/common/repository";
import { byWeek, intoThroughput } from "@app/throughput";
import { isAfter, subMonths } from "date-fns";
import { groupBy, some } from "lodash";

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

function intoForecast(data: InputData[]): Forecastable[] {
  return data
    .filter((d) => d.feature)
    .map((d) => ({
      id: d.id,
      completed: !!d.endDate,
      feature: d.feature,
      recentlyWorkedOn: isRecent(d.startDate, d.endDate),
    }));
}

export function intoForecastSummary(data: InputData[]) {
  const throughput = intoThroughput(data)
    .toThroughput(byWeek)
    .map((d) => d.total);
  const forecast = groupBy(intoForecast(data), "feature");

  return { throughput, forecastableByFeature: forecast };
}
