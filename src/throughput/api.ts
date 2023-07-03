import { InputData } from "@app/common/repository";
import { countOfStories } from "./helper";
import { DurationFn, StoryDataList } from "./type";
import { byWeek } from "./durations";

export function intoThroughput(data: InputData[]): StoryDataList {
  const stories = data
    .filter((d) => d.endDate)
    .map((d) => ({
      id: d.id,
      completedAt: new Date(d.endDate),
    }));

  return {
    stories,
    count: (fn: DurationFn) => countOfStories(stories, fn),
  };
}

export const Duration = {
  byWeek: byWeek,
};
