import { runOnce } from "./simulation";
import { CompletedDate } from "./type";

export function runMonteCarlo(
  times: number,
  remainingStories: number,
  historicalWeeklyThroughput: number[],
): CompletedDate[] {
  const simulateTrial = () =>
    runOnce(remainingStories, historicalWeeklyThroughput);
  return Array(times).fill(0).map(simulateTrial);
}
