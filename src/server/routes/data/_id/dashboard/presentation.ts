import { InputData } from "@app/common/repository";
import { Options, cycletimesSummary, forecastSummary } from "@app/dashboard";

export function dashboardSummaries(data: InputData[], options: Options) {
  const { outliers, p25, p75, p85 } = cycletimesSummary(data);
  const summary = forecastSummary(data, options);
  return {
    cycletime: { p25, p75, p85 },
    outliers: outliers,
    forecast: summary,
  };
}
