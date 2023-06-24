import percentile from "percentile";
import { Point } from "./chart";

/**
 *
 * @param at The percentile, an integer between 0-100.
 * @param data The dataset; the "y" value will be used for determining percentile.
 */
export function percentileAt(at: number, data: Point[]): number {
  const result = percentile(
    at,
    data.map((d) => d.y),
  );

  if (Array.isArray(result)) {
    return result[0];
  }

  return result;
}
