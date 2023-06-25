import { format } from "date-fns";
import { compact, countBy, every, map, some } from "lodash";
import { percentiles } from "../common/math";
import { runMonteCarlo } from "../forecasting";
import { Forecastable, readIntoProgressAndForecastable } from "./reader";

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

type Options = {
  onlyRecent: boolean;
};

function shouldSkip(items: Forecastable[]) {
  return every(items, (v) => !v.recentlyWorkedOn);
}

export async function forecastSummary(
  filepath: string,
  options: Options,
): Promise<Summary[]> {
  const { throughput, forecastableByFeature } =
    await readIntoProgressAndForecastable(filepath);

  return compact(
    map(forecastableByFeature, (value, key) => {
      if (options.onlyRecent && shouldSkip(value)) {
        return;
      }

      const completed = countBy(value, "completed")["true"];
      const incomplete = countBy(value, "completed")["false"];

      const simulations = runMonteCarlo(10000, incomplete, throughput);
      const {
        [50]: p50,
        [85]: p85,
        [95]: p95,
      } = percentiles(simulations, 50, 85, 95);

      return {
        name: key,
        progress: {
          completed: completed,
          total: value.length,
        },
        forecast: {
          p50: format(p50, "MM/dd/yy"),
          p85: format(p85, "MM/dd/yy"),
          p95: format(p95, "MM/dd/yy"),
        },
      };
    }),
  );
}
