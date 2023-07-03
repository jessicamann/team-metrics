import { InputData } from "@app/common/repository";
import { Options, StoryData } from "./type";

function inIncludeList(d: InputData, options?: Options) {
  if (!options?.only) return true;
  return options.only.includes(d.feature);
}

function toStatus(d: InputData) {
  if (d.endDate) return "Done";
  if (d.startDate) return "In progress";
  return "Not started";
}

export function toProgress(data: InputData[], options?: Options): StoryData[] {
  return data
    .filter((d) => d.feature && inIncludeList(d, options))
    .map((d) => ({
      feature: d.feature,
      status: toStatus(d),
    }));
}
