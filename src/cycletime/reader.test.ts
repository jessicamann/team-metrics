import { cycletimeBetween, intoCycleTime } from "./reader";

describe("readAsCycleTime", () => {
  const inputData = [
    { id: "1", startDate: "2023-01-04", endDate: "2023-01-05", feature: "" },
    { id: "2", startDate: "2023-01-04", endDate: "2023-01-05", feature: "" },
    { id: "3", startDate: "", endDate: "2023-01-05", feature: "" },
    { id: "4", startDate: "", endDate: "", feature: "" },
  ];

  it("returns the data as cycle time", () => {
    expect(intoCycleTime(inputData)).toEqual(
      expect.arrayContaining([
        { id: "1", completedAt: new Date("2023-01-05"), cycletime: 2 },
      ]),
    );
  });

  it("does not include stories that did not start yet", () => {
    expect(intoCycleTime(inputData)).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "2" }),
        expect.objectContaining({ id: "4" }),
      ]),
    );
  });

  it("does not include stories that hasn't ended yet", () => {
    expect(intoCycleTime(inputData)).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "3" }),
        expect.objectContaining({ id: "4" }),
      ]),
    );
  });
});

describe("cycletimeBetween", () => {
  it("returns 1 calendar day if work start and end on the same day", () => {
    expect(
      cycletimeBetween(new Date("2023-06-23"), new Date("2023-06-23")),
    ).toEqual(1);
  });

  it("returns 2 days if work ends the day after it begins", () => {
    expect(
      cycletimeBetween(new Date("2023-06-24"), new Date("2023-06-23")),
    ).toEqual(2);
  });

  it("throws an error if the work ended before it began", () => {
    expect(() =>
      cycletimeBetween(new Date("2023-06-24"), new Date("2023-06-25")),
    ).toThrow("you've figured out time travel.");
  });
});
