import { countOfStories, intoThroughput } from "./reader";
import { GroupFn, StoryData } from "./type";

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
    const testGroupBy: GroupFn = (stories) => ({ "2023-02-04": stories });

    expect(intoThroughput(input).count(testGroupBy)).toEqual([
      {
        periodEnd: new Date("2023-02-04"),
        total: 1,
      },
    ]);
  });
});

describe("countOfStories", () => {
  it("counts the number of stories completed for each duration", () => {
    const testStory = { id: "1", completedAt: new Date("2023-02-04") };
    const result = countOfStories([testStory], () => ({
      "2023-02-04": [testStory],
    }));
    expect(result).toEqual([{ periodEnd: new Date("2023-02-04"), total: 1 }]);
  });

  it("returns an array of period by total", () => {
    const story1 = { id: "1", completedAt: new Date("2023-02-04") };
    const story2 = { id: "2", completedAt: new Date("2023-02-05") };
    const story3 = { id: "3", completedAt: new Date("2023-02-06") };
    const result = countOfStories([story1, story2, story3], () => ({
      "2023-02-04": [story1, story2],
      "2023-02-10": [story3],
    }));
    expect(result).toEqual([
      { periodEnd: new Date("2023-02-04"), total: 2 },
      { periodEnd: new Date("2023-02-10"), total: 1 },
    ]);
  });
});
