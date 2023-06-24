import { addDays, addWeeks } from "date-fns";
import { CompletedDate } from "./type";

type StoryCount = number;

const randomlySelectFromPastThroughput = (throughput: number[]): number => {
  const randomIndex = Math.floor(Math.random() * throughput.length);
  return throughput[randomIndex];
};

function progressByOneWeek(
  throughput: number[],
  storyCount: StoryCount,
  today: Date,
): { nextDay: Date; remaining: StoryCount } {
  const completed = randomlySelectFromPastThroughput(throughput);

  return {
    nextDay: addWeeks(today, 1),
    remaining: storyCount - completed,
  };
}

// todo: can refactor this to use takt time instead of throughput
export function runOnce(
  storyCount: StoryCount,
  historicalWeeklyThroughput: number[],
): CompletedDate {
  let remainingStories = storyCount;
  let completionDay = new Date();
  while (remainingStories > 0) {
    const { nextDay, remaining } = progressByOneWeek(
      historicalWeeklyThroughput,
      remainingStories,
      completionDay,
    );

    remainingStories = remaining;
    completionDay = nextDay;
  }

  return completionDay.getTime();
}
