import { InputData } from "@app/common/repository";
import { map } from "lodash";
import { GroupFn, StoryData, StoryDataList, ThroughputData } from "./type";

/**
 * @internal
 */
export function toThroughput(
  data: StoryData[],
  byDuration: GroupFn,
): ThroughputData[] {
  const grouped = byDuration(data);

  return map(grouped, (value, key) => ({
    periodEnd: new Date(key),
    total: value.length,
  }));
}

export function intoThroughput(data: InputData[]): StoryDataList {
  const stories = data
    .filter((d) => d.endDate)
    .map((d) => ({
      id: d.id,
      completedAt: new Date(d.endDate),
    }));

  return {
    stories,
    toThroughput: (fn: GroupFn) => toThroughput(stories, fn),
  };
}
