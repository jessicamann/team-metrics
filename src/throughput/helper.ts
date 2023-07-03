import { map } from "lodash";
import { DurationFn, StoryData, ThroughputData } from "./type";

/**
 * @internal
 */
export function countOfStories(
  data: StoryData[],
  byDuration: DurationFn,
): ThroughputData[] {
  const grouped = byDuration(data);

  return map(grouped, (value, key) => ({
    periodEnd: new Date(key),
    total: value.length,
  }));
}
