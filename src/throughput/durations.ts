import { endOfDay, endOfWeek } from "date-fns";
import { groupBy } from "lodash";
import { StoryData } from "./type";

type GroupFn = (data: StoryData[]) => Record<string, StoryData[]>;

export const byWeek: GroupFn = (
  data: StoryData[],
): Record<string, StoryData[]> => {
  return groupBy(data, (story) => endOfWeek(story.completedAt));
};

export const byDay: GroupFn = (
  data: StoryData[],
): Record<string, StoryData[]> => {
  return groupBy(data, (story) => endOfDay(story.completedAt));
};
