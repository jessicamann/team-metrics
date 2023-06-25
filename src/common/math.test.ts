import { percentiles } from "./math";

describe("percentiles", () => {
  it("returns the values for each provided percetile", () => {
    const { [50]: p50, [80]: p80 } = percentiles([1, 2, 3, 4, 5], 50, 80);

    expect(p50).toEqual(3);
    expect(p80).toEqual(4);
  });
});
