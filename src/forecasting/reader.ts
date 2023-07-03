import { InputData } from "@app/common/repository";
import { byWeek, intoThroughput } from "@app/throughput";

type ForecastingData = {
  remaining: number;
  throughput: number[];
};

export function intoForecastData(data: InputData[]): ForecastingData {
  const throughput = intoThroughput(data)
    .toThroughput(byWeek)
    .map((d) => d.total);
  const remaining = data.filter((d) => !d.endDate).length;

  return { throughput, remaining };
}
