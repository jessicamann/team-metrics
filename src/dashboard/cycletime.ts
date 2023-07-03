import { percentiles } from "@app/common/math";
import { InputData } from "@app/common/repository";
import { intoCycleTime } from "@app/cycletime";
import { toOutlyingItems } from "./toOutlyingItems";
import { ItemId } from "./type";

type Summary = {
  outliers: ItemId[];
  p25: number;
  p75: number;
  p85: number;
};

export function cycletimesSummary(input: InputData[]): Summary {
  const cycleTimeData = intoCycleTime(input);
  const outliers = toOutlyingItems(cycleTimeData);
  const times = cycleTimeData.map((d) => d.cycletime);
  const { [25]: p25, [75]: p75, [85]: p85 } = percentiles(times, 25, 75, 85);

  return { outliers, p25, p75, p85 };
}
