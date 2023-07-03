import { InputData } from "@app/common/repository";
import { Duration, intoThroughput } from "@app/throughput/api";

export type ForecastingData = {
  remaining: number;
  throughput: number[];
};

export function intoForecastData(data: InputData[]): ForecastingData {
  const throughput = intoThroughput(data)
    .count(Duration.byWeek)
    .map((d) => d.total);
  const remaining = data.filter((d) => !d.endDate).length;

  return { throughput, remaining };
}
