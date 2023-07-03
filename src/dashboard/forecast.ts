import { percentiles } from "@app/common/math";
import { getById } from "@app/common/repository";
import { runMonteCarlo } from "@app/forecasting";
import { format } from "date-fns";
import { compact, countBy, every, map } from "lodash";
import { Forecastable, intoForecastSummary } from "./reader";

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
  id: string,
  options: Options,
): Promise<Summary[]> {
  const data = getById(id);
  const { throughput, forecastableByFeature } = intoForecastSummary(data);

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
