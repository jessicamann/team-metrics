import { Feature, StoryData } from "@app/progress/type";
import { countBy, groupBy } from "lodash";

/**
 *
 * @internal
 */
export function groupByFeature(
  data: StoryData[],
): Record<Feature, StoryData[]> {
  return groupBy(data, "feature");
}

/**
 *
 * @internal
 */
export function countByStatus(data: StoryData[]): {
  "In progress": number;
  "Not started": number;
  Done: number;
} {
  const result = countBy(data, "status");
  return {
    "In progress": result["In progress"] || 0,
    "Not started": result["Not started"] || 0,
    Done: result["Done"] || 0,
  };
}
