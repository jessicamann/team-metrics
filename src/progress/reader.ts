import { InputData } from "@app/common/repository";
import { Options, StoryData } from "./type";

function inIncludeList(d: InputData, options?: Options) {
  if (!options?.only) return true;
  return options.only.includes(d.feature);
}

export function intoProgressData(
  data: InputData[],
  options?: Options,
): StoryData[] {
  return data
    .filter((d) => d.feature && inIncludeList(d, options))
    .map((d) => {
      if (d.endDate) {
        return { feature: d.feature, status: "Done" };
      } else if (d.startDate) {
        return { feature: d.feature, status: "In progress" };
      } else {
        return { feature: d.feature, status: "Not started" };
      }
    });
}
