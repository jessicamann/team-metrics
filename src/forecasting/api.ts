import { InputData } from "@app/common/repository";
import { intoForecastData } from "./reader";
import { runMonteCarlo } from "./montecarlo";

/**
 *
 * Currently limited to providing forecast using historical
 * weekly throughput only.
 * @todo: A better implementation would be using takt time.
 */
export function forecast(data: InputData[]) {
  const { throughput, remaining } = intoForecastData(data);
  return {
    remaining,
    simulate: () => runMonteCarlo(20000, remaining, throughput),
  };
}
