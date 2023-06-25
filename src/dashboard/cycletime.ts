import percentile from "percentile";
import { toCycleTime } from "../cycletime/data";
import { toOutlyingItems } from "./toOutlyingItems";
import { ItemId } from "./type";

type Summary = {
  outliers: ItemId[];
  p25: number;
  p75: number;
  p85: number;
};

export async function cycletimesSummary(filepath: string): Promise<Summary> {
  const cycleTimeData = await toCycleTime(filepath);
  const times = cycleTimeData.map((d) => d.cycletime);

  return {
    outliers: toOutlyingItems(cycleTimeData),
    p25: percentile(25, times) as number,
    p75: percentile(75, times) as number,
    p85: percentile(85, times) as number,
  };
}
