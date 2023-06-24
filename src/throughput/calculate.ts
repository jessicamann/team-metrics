import { endOfWeek } from "date-fns";
import { groupBy, map } from "lodash";
import { StoryData, ThroughputData } from "./type";

type GroupFn = (data: StoryData[]) => Record<string, StoryData[]>;

export const byWeek: GroupFn = (
  data: StoryData[],
): Record<string, StoryData[]> => {
  return groupBy(data, (story) => endOfWeek(story.completedAt));
};

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
