import { toThroughput } from "./reader";

it.todo("skips rows in the csv that has not been completed yet");

it.todo("returns the id and the completed date for each completed item");

describe("toThroughput", () => {
  it("counts the number of stories completed for each duration", () => {
    const testStory = { id: "1", completedAt: new Date("2023-02-04") };
    const result = toThroughput([testStory], () => ({
      "2023-02-04": [testStory],
    }));
    expect(result).toEqual([{ periodEnd: new Date("2023-02-04"), total: 1 }]);
  });

  it("returns an array of period by total", () => {
    const story1 = { id: "1", completedAt: new Date("2023-02-04") };
    const story2 = { id: "2", completedAt: new Date("2023-02-05") };
    const story3 = { id: "3", completedAt: new Date("2023-02-06") };
    const result = toThroughput([story1, story2, story3], () => ({
      "2023-02-04": [story1, story2],
      "2023-02-10": [story3],
    }));
    expect(result).toEqual([
      { periodEnd: new Date("2023-02-04"), total: 2 },
      { periodEnd: new Date("2023-02-10"), total: 1 },
    ]);
  });
});
