import { map } from "lodash";
import { readFromCsvAndDo } from "@app/common/csv";
import { GroupFn, StoryData, StoryDataList, ThroughputData } from "./type";
import { InputData, getById } from "@app/common/repository";

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
 * @deprecated
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
