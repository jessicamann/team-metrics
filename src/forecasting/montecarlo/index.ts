import { runOnce } from "./simulation";
import { CompletedDate } from "./type";

export function run(
  times: number,
  remainingStories: number,
  historicalWeeklyThroughput: number[],
): CompletedDate[] {
  const simulate = () => runOnce(remainingStories, historicalWeeklyThroughput);
  return Array(times).fill(0).map(simulate);
}
