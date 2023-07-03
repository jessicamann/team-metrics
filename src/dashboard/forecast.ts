import { format, isAfter, subMonths } from "date-fns";
import { chain, some } from "lodash";
import { percentiles } from "@app/common/math";
import { InputData } from "@app/common/repository";
import { forecast } from "@app/forecasting/api";
import { Options } from "./type";

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

function isRecent(data: InputData[]): boolean {
  const oneMonthAgo = subMonths(new Date(), 1);
  return some(
    data,
    (d) =>
      isAfter(new Date(d.endDate), oneMonthAgo) ||
      isAfter(new Date(d.startDate), oneMonthAgo),
  );
}

function withFeature(data: InputData[]): InputData[] {
  return data.filter((d) => d.feature);
}

function toFeatureSummary(options: Options) {
  return function (value: InputData[], featureName: string) {
    if (options.onlyRecent && !isRecent(value)) {
      return;
    }

    const completed = value.filter((d) => d.endDate).length;
    const dates = forecast(value).simulate();
    const forecastConfidence = percentiles(dates, 50, 85, 95);

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
  return chain(withFeature(data))
    .groupBy("feature")
    .map(toFeatureSummary(options))
    .compact()
    .value();
}
