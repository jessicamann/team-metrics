import { percentiles } from "@app/common/math";
import { InputData } from "@app/common/repository";
import { runMonteCarlo } from "@app/forecasting";
import { format, isAfter, subMonths } from "date-fns";
import { chain, compact, countBy, every, groupBy, map, some } from "lodash";
import { byWeek, intoThroughput } from "@app/throughput";

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

export type Options = {
  onlyRecent: boolean;
};

export type Forecastable = {
  id: string;
  completed: boolean;
  feature: string;
  recentlyWorkedOn: boolean;
};

function isNotRecent(items: Forecastable[]) {
  return every(items, (v) => !v.recentlyWorkedOn);
}

function datesAreRecent(...dates: string[]) {
  const oneMonthAgo = subMonths(new Date(), 1);
  return some(dates, (d) => isAfter(new Date(d), oneMonthAgo));
}

function fromInput(data: InputData[]): Forecastable[] {
  return data
    .filter((d) => d.feature)
    .map((d) => ({
      id: d.id,
      completed: !!d.endDate,
      feature: d.feature,
      recentlyWorkedOn: datesAreRecent(d.startDate, d.endDate),
    }));
}

function forecast(remaining: number, throughput: number[]) {
  const simulations = runMonteCarlo(20000, remaining, throughput);
  return percentiles(simulations, 50, 85, 95);
}

function toFeatureSummary(options: Options, throughput: number[]) {
  return function (value: Forecastable[], featureName: string) {
    if (options.onlyRecent && isNotRecent(value)) {
      return;
    }

    const completed = countBy(value, "completed")["true"];
    const incomplete = countBy(value, "completed")["false"];
    const forecastConfidence = forecast(incomplete, throughput);

    return {
      name: featureName,
      progress: {
        completed: completed,
        total: value.length,
      },
      forecast: {
        p50: format(forecastConfidence[50], "MM/dd/yy"),
        p85: format(forecastConfidence[85], "MM/dd/yy"),
        p95: format(forecastConfidence[95], "MM/dd/yy"),
      },
    };
  };
}

export function forecastSummary(
  data: InputData[],
  options: Options,
): Summary[] {
  const throughput = intoThroughput(data)
    .count(byWeek)
    .map((d) => d.total);

  return chain(fromInput(data))
    .groupBy("feature")
    .map(toFeatureSummary(options, throughput))
    .compact()
    .value();
}
