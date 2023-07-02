import { map } from "lodash";
import { readFromCsvAndDo } from "@app/common/csv";
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

/**
 *
 * @param filepath the path to the csv file containing raw data
 * @returns a list of StoryData (from the csv rows) for calculating throughput
 */
export async function readAsStory(filepath: string): Promise<StoryDataList> {
  const stories: StoryData[] = await readFromCsvAndDo<StoryData>(
    filepath,
    (row, skip) => {
      const { id, endDate } = row as {
        id: string;
        endDate: string;
      };
      if (!endDate) {
        skip();
      }

      return { id, completedAt: new Date(endDate) };
    },
  );

  return {
    stories,
    toThroughput: (fn: GroupFn) => toThroughput(stories, fn),
  };
}
