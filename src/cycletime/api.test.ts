import { toCycleTime } from "./api";

describe("toCycleTime", () => {
  const inputData = [
    { id: "1", startDate: "2023-01-04", endDate: "2023-01-05", feature: "" },
    { id: "2", startDate: "2023-01-04", endDate: "2023-01-05", feature: "" },
    { id: "3", startDate: "", endDate: "2023-01-05", feature: "" },
    { id: "4", startDate: "", endDate: "", feature: "" },
  ];

  it("returns the data as cycle time", () => {
    expect(toCycleTime(inputData)).toEqual(
      expect.arrayContaining([
        { id: "1", completedAt: new Date("2023-01-05"), cycletime: 2 },
      ]),
    );
  });

  it("does not include stories that did not start yet", () => {
    expect(toCycleTime(inputData)).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "2" }),
        expect.objectContaining({ id: "4" }),
      ]),
    );
  });

  it("does not include stories that hasn't ended yet", () => {
    expect(toCycleTime(inputData)).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "3" }),
        expect.objectContaining({ id: "4" }),
      ]),
    );
  });
});
