import { percentiles } from "@app/common/math";
import { toOutlyingItems } from "./toOutlyingItems";
import { ItemId } from "./type";
import { getById } from "@app/common/repository";
import { intoCycleTime } from "@app/cycletime";

type Summary = {
  outliers: ItemId[];
  p25: number;
  p75: number;
  p85: number;
};

export async function cycletimesSummary(id: string): Promise<Summary> {
  const input = getById(id);
  const cycleTimeData = intoCycleTime(input);
  const outliers = toOutlyingItems(cycleTimeData);
  const times = cycleTimeData.map((d) => d.cycletime);
  const { [25]: p25, [75]: p75, [85]: p85 } = percentiles(times, 25, 75, 85);

  return { outliers, p25, p75, p85 };
}
