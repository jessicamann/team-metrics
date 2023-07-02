import { percentiles } from "@app/common/math";
import { readAsCycleTiime } from "@app/cycletime";
import { toOutlyingItems } from "./toOutlyingItems";
import { ItemId } from "./type";

type Summary = {
  outliers: ItemId[];
  p25: number;
  p75: number;
  p85: number;
};

export async function cycletimesSummary(filepath: string): Promise<Summary> {
  const cycleTimeData = await readAsCycleTiime(filepath);
  const outliers = toOutlyingItems(cycleTimeData);
  const times = cycleTimeData.map((d) => d.cycletime);
  const { [25]: p25, [75]: p75, [85]: p85 } = percentiles(times, 25, 75, 85);

  return { outliers, p25, p75, p85 };
}
