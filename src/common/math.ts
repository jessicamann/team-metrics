import percentile from "percentile";

type PLevel = number;
type Value = number;

export function percentiles(
  data: number[],
  ...pLevels: number[]
): Record<PLevel, Value> {
  return pLevels.reduce(
    (obj, p) => ({
      ...obj,
      [p]: percentile(p, data) as number,
    }),
    {},
  );
}
