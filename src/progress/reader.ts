import { readFromCsvAndDo } from "../common/csv";
import { Options, StoryData } from "./type";

export async function readAsStoryData(
  filepath: string,
  options?: Options,
): Promise<StoryData[]> {
  return readFromCsvAndDo(filepath, (row, skip) => {
    const { startDate, endDate, feature } = row as {
      endDate: string;
      startDate: string;
      feature: string;
    };

    if (!feature) {
      skip();
    }

    if (options?.only && !options.only.includes(feature)) {
      skip();
    }

    if (endDate) {
      return { feature, status: "Done" };
    } else if (startDate) {
      return { feature, status: "In progress" };
    } else {
      return { feature, status: "Not started" };
    }
  });
}
