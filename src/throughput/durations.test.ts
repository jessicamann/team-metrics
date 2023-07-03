import { endOfWeek } from "date-fns";
import { byWeek } from "./durations";

describe("byWeek", () => {
  it("groups the stories completed in the same week", () => {
    const feb4 = new Date(2023, 1, 4);
    const feb5 = new Date(2023, 1, 5);
    const feb6 = new Date(2023, 1, 6);

    const result = byWeek([
      { id: "1", completedAt: feb4 }, // a saturday
      { id: "2", completedAt: feb5 }, // a sunday
      { id: "3", completedAt: feb6 }, // a monday
    ]);

    const firstWeek = endOfWeek(feb4);
    const secondWeek = endOfWeek(feb6);

    expect(result).toEqual({
      [firstWeek.toString()]: [{ id: "1", completedAt: feb4 }],
      [secondWeek.toString()]: [
        { id: "2", completedAt: feb5 },
        { id: "3", completedAt: feb6 },
      ],
    });
  });
});
