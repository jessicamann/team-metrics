import { intoThroughput } from "./api";
import { DurationFn } from "./type";

describe("intoThroughput", () => {
  it("skips stories which have not been completed", () => {
    const input = [
      { id: "1", endDate: "2023-02-04", startDate: "2023-01-31", feature: "" },
      { id: "2", endDate: "", startDate: "2023-01-31", feature: "" },
      { id: "3", endDate: "", startDate: "", feature: "" },
      { id: "4", endDate: "2023-02-04", startDate: "", feature: "" },
    ];

    expect(intoThroughput(input).stories).toEqual([
      expect.objectContaining({ id: "1" }),
      expect.objectContaining({ id: "4" }),
    ]);
  });

  it("returns the throughput over a duration", () => {
    const input = [
      { id: "1", endDate: "2023-02-04", startDate: "2023-01-31", feature: "" },
    ];
    const testGroupBy: DurationFn = (stories) => ({ "2023-02-04": stories });

    expect(intoThroughput(input).count(testGroupBy)).toEqual([
      {
        periodEnd: new Date("2023-02-04"),
        total: 1,
      },
    ]);
  });
});
